using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProjetoLES.Server.Data;
using ProjetoLES.Server.DTO_s;
using ProjetoLES.Server.DTO_s.Transaction;
using ProjetoLES.Server.Enums;
using ProjetoLES.Server.Interfaces.Services;
using ProjetoLES.Server.Models;

namespace ProjetoLES.Server.Services
{
    public class TransactionService : ITransactionService
    {
        private static readonly TimeSpan AfterSalesRequestWindow = TimeSpan.FromDays(7);

        private const string PrescriptionPending = "PENDENTE";
        private const string PrescriptionApproved = "APROVADA";
        private const string PrescriptionRejected = "REPROVADA";
        private const string PrescriptionResubmissionRequested = "REENVIO_SOLICITADO";
        private const string AfterSalesPending = "PENDENTE";
        private const string AfterSalesApproved = "APROVADA";
        private const string AfterSalesRejected = "REPROVADA";

        private static readonly JsonSerializerOptions JsonOptions = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        private readonly AppDbContext _context;

        public TransactionService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResultDTO<TransactionModel>> GetMyTransactionsAsync(
            Guid userUuid,
            int page,
            int pageSize,
            string? status,
            CancellationToken cancellationToken = default)
        {
            var user = await _context.Users
                .AsNoTracking()
                .Include(u => u.Customer)
                .FirstOrDefaultAsync(u => u.Uuid == userUuid && u.IsActive, cancellationToken)
                ?? throw new KeyNotFoundException("Usuário não encontrado.");

            if (user.Customer is null)
                throw new InvalidOperationException("Usuário não está vinculado a um cliente.");

            return await GetTransactionsCoreAsync(
                page,
                pageSize,
                status,
                customerId: user.Customer.Id,
                cancellationToken);
        }

        public async Task<PagedResultDTO<TransactionModel>> GetTransactionsAsync(
            int page,
            int pageSize,
            string? status,
            Guid? customerUuid,
            CancellationToken cancellationToken = default)
        {
            int? customerId = null;

            if (customerUuid.HasValue)
            {
                customerId = await _context.Customers
                    .AsNoTracking()
                    .Where(c => c.Uuid == customerUuid.Value)
                    .Select(c => (int?)c.Id)
                    .FirstOrDefaultAsync(cancellationToken)
                    ?? throw new KeyNotFoundException("Cliente não encontrado.");
            }

            return await GetTransactionsCoreAsync(
                page,
                pageSize,
                status,
                customerId,
                cancellationToken);
        }

        public async Task<AfterSalesRequestDTO> CreateAfterSalesRequestAsync(
            Guid transactionUuid,
            Guid userUuid,
            AfterSalesRequestCreateDTO dto,
            CancellationToken cancellationToken = default)
        {
            var customerId = await GetCustomerIdByUserUuidAsync(userUuid, cancellationToken);

            var transaction = await _context.Transactions
                .FirstOrDefaultAsync(t => t.Uuid == transactionUuid, cancellationToken)
                ?? throw new KeyNotFoundException("Pedido não encontrado.");

            if (transaction.CustomerId != customerId)
                throw new UnauthorizedAccessException("Acesso não autorizado ao pedido.");

            if ((DateTime.UtcNow - transaction.CreatedAt) > AfterSalesRequestWindow)
                throw new InvalidOperationException("Prazo de 7 dias para troca/devolução expirado para este pedido.");

            var metadata = TryParseMetadata(transaction.MetadataJson)
                ?? throw new InvalidOperationException("Pedido sem metadados para troca/devolução.");

            var type = NormalizeAfterSalesType(dto.Type);
            var reason = (dto.Reason ?? string.Empty).Trim();
            var requestedItemsRaw = dto.Items?.ToList() ?? new List<AfterSalesRequestCreateItemDTO>();

            if (reason.Length < 8)
                throw new InvalidOperationException("Descreva o motivo com pelo menos 8 caracteres.");

            if (requestedItemsRaw.Count == 0)
                throw new InvalidOperationException("Selecione ao menos um item para a solicitação.");

            var requests = metadata.AfterSalesRequests?.ToList() ?? new List<AfterSalesRequestMetadata>();
            if (requests.Any(r => r.Status == AfterSalesPending))
                throw new InvalidOperationException("Já existe uma solicitação pendente para este pedido.");

            var purchasedItemsByProduct = metadata.Items
                .GroupBy(i => i.ProductUuid)
                .ToDictionary(
                    g => g.Key,
                    g => new
                    {
                        Quantity = g.Sum(x => x.Quantity),
                        Name = g.First().ProductName
                    });

            var requestedItems = requestedItemsRaw
                .Where(i => i.Quantity > 0)
                .GroupBy(i => i.ProductUuid)
                .Select(g => new { ProductUuid = g.Key, Quantity = g.Sum(x => x.Quantity) })
                .ToList();

            if (requestedItems.Count == 0)
                throw new InvalidOperationException("Selecione ao menos um item com quantidade válida.");

            var requestItemsMetadata = new List<AfterSalesRequestItemMetadata>();

            foreach (var item in requestedItems)
            {
                if (!purchasedItemsByProduct.TryGetValue(item.ProductUuid, out var purchased))
                    throw new InvalidOperationException("Existe item inválido na solicitação.");

                if (item.Quantity > purchased.Quantity)
                    throw new InvalidOperationException("Quantidade solicitada excede a quantidade comprada.");

                requestItemsMetadata.Add(new AfterSalesRequestItemMetadata(
                    item.ProductUuid,
                    purchased.Name,
                    item.Quantity));
            }

            var request = new AfterSalesRequestMetadata(
                Guid.NewGuid(),
                type,
                AfterSalesPending,
                reason,
                null,
                DateTime.UtcNow,
                null,
                null,
                requestItemsMetadata);

            requests.Add(request);

            var updatedMetadata = metadata with { AfterSalesRequests = requests };
            transaction.MetadataJson = JsonSerializer.Serialize(updatedMetadata, JsonOptions);
            transaction.Status = type == "DEVOLUCAO" ? "DEVOLUCAO_PENDENTE" : "TROCA_PENDENTE";

            await _context.SaveChangesAsync(cancellationToken);

            return MapAfterSalesRequest(request, transaction.Uuid, metadata.TransactionCode);
        }

        public async Task<ExchangeCreditBalanceDTO> GetMyExchangeCreditBalanceAsync(
            Guid userUuid,
            CancellationToken cancellationToken = default)
        {
            var customerId = await GetCustomerIdByUserUuidAsync(userUuid, cancellationToken);
            var snapshot = await GetExchangeCreditSnapshotAsync(customerId, cancellationToken);
            return new ExchangeCreditBalanceDTO(snapshot.AvailableCredit, snapshot.Entries);
        }

        public async Task<IEnumerable<AfterSalesRequestDTO>> GetAfterSalesRequestsAsync(
            string? status,
            string? type,
            DateTime? requestedFrom,
            DateTime? requestedTo,
            CancellationToken cancellationToken = default)
        {
            var normalizedStatus = string.IsNullOrWhiteSpace(status)
                ? null
                : status.Trim().ToUpperInvariant();

            var normalizedType = string.IsNullOrWhiteSpace(type)
                ? null
                : NormalizeAfterSalesType(type);

            var transactions = await _context.Transactions
                .AsNoTracking()
                .Where(t => t.MetadataJson != null)
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync(cancellationToken);

            var result = new List<AfterSalesRequestDTO>();

            foreach (var transaction in transactions)
            {
                var metadata = TryParseMetadata(transaction.MetadataJson);
                if (metadata?.AfterSalesRequests is null || metadata.AfterSalesRequests.Count == 0)
                    continue;

                foreach (var request in metadata.AfterSalesRequests)
                {
                    if (normalizedStatus is not null && request.Status != normalizedStatus)
                        continue;

                    if (normalizedType is not null && request.Type != normalizedType)
                        continue;

                    if (requestedFrom.HasValue && request.RequestedAt < requestedFrom.Value.Date)
                        continue;

                    if (requestedTo.HasValue && request.RequestedAt > requestedTo.Value.Date.AddDays(1).AddTicks(-1))
                        continue;

                    result.Add(MapAfterSalesRequest(request, transaction.Uuid, metadata.TransactionCode));
                }
            }

            return result
                .OrderByDescending(r => DateTime.TryParse(r.RequestedAt, out var dt) ? dt : DateTime.MinValue)
                .ToList();
        }

        public async Task ReviewAfterSalesRequestAsync(
            Guid transactionUuid,
            Guid requestUuid,
            bool approve,
            string? note,
            string reviewedBy,
            CancellationToken cancellationToken = default)
        {
            var transaction = await _context.Transactions
                .FirstOrDefaultAsync(t => t.Uuid == transactionUuid, cancellationToken)
                ?? throw new KeyNotFoundException("Pedido não encontrado.");

            var metadata = TryParseMetadata(transaction.MetadataJson)
                ?? throw new InvalidOperationException("Pedido sem metadados válidos.");

            var requests = metadata.AfterSalesRequests?.ToList() ?? new List<AfterSalesRequestMetadata>();
            if (requests.Count == 0)
                throw new KeyNotFoundException("Solicitação de troca/devolução não encontrada.");

            var index = requests.FindIndex(r => r.RequestUuid == requestUuid);
            if (index < 0)
                throw new KeyNotFoundException("Solicitação de troca/devolução não encontrada.");

            var current = requests[index];
            if (current.Status != AfterSalesPending)
                throw new InvalidOperationException("Esta solicitação já foi analisada.");

            decimal? compensationAmount = null;
            string? compensationType = null;
            DateTime? stockUpdatedAt = null;

            if (approve)
            {
                compensationAmount = await ApplyApprovedAfterSalesEffectsAsync(
                    metadata,
                    current,
                    cancellationToken);
                compensationType = current.Type == "DEVOLUCAO" ? "ESTORNO" : "CREDITO_TROCA";
                stockUpdatedAt = DateTime.UtcNow;
            }

            var reviewNote = string.IsNullOrWhiteSpace(note)
                ? approve
                    ? "Solicitação aprovada pela equipe administrativa."
                    : "Solicitação reprovada pela equipe administrativa."
                : note.Trim();

            if (approve && compensationAmount.HasValue)
            {
                reviewNote = $"{reviewNote} {compensationType}: {compensationAmount.Value.ToString("C", new CultureInfo("pt-BR"))}.";
            }

            requests[index] = current with
            {
                Status = approve ? AfterSalesApproved : AfterSalesRejected,
                ReviewNote = reviewNote,
                ReviewedAt = DateTime.UtcNow,
                ReviewedBy = reviewedBy,
                CompensationType = compensationType,
                CompensationAmount = compensationAmount,
                StockUpdatedAt = stockUpdatedAt
            };

            var updatedMetadata = metadata with { AfterSalesRequests = requests };
            transaction.MetadataJson = JsonSerializer.Serialize(updatedMetadata, JsonOptions);
            transaction.Status = current.Type switch
            {
                "DEVOLUCAO" when approve => "DEVOLUCAO_APROVADA",
                "DEVOLUCAO" => "DEVOLUCAO_REPROVADA",
                "TROCA" when approve => "TROCA_APROVADA",
                _ => "TROCA_REPROVADA"
            };

            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task<OrderDetailDTO> GetTransactionDetailAsync(
            Guid transactionUuid,
            Guid? userUuid,
            bool canViewAnyOrder,
            CancellationToken cancellationToken = default)
        {
            var transaction = await _context.Transactions
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.Uuid == transactionUuid, cancellationToken)
                ?? throw new KeyNotFoundException("Pedido não encontrado.");

            if (!canViewAnyOrder)
            {
                if (!userUuid.HasValue)
                    throw new UnauthorizedAccessException("Acesso não autorizado ao pedido.");

                var customerId = await _context.Users
                    .AsNoTracking()
                    .Include(u => u.Customer)
                    .Where(u => u.Uuid == userUuid.Value && u.IsActive)
                    .Select(u => u.Customer != null ? (int?)u.Customer.Id : null)
                    .FirstOrDefaultAsync(cancellationToken)
                    ?? throw new KeyNotFoundException("Usuário não encontrado.");

                if (transaction.CustomerId != customerId)
                    throw new UnauthorizedAccessException("Acesso não autorizado ao pedido.");
            }

            var metadata = TryParseMetadata(transaction.MetadataJson);
            var items = metadata?.Items.Select(item => new OrderDetailItemDTO(
                item.ProductUuid,
                item.ProductName,
                item.CategoryName,
                item.Quantity,
                item.UnitPrice,
                item.UnitPrice * item.Quantity,
                ToPrescriptionLabel(item.PrescriptionType)))
                .ToList() ?? new List<OrderDetailItemDTO>();

            var transactionCode = metadata?.TransactionCode;
            if (string.IsNullOrWhiteSpace(transactionCode))
            {
                var codeFromDescription = transaction.Description?.Split(" - ")?.FirstOrDefault()?.Trim();
                transactionCode = !string.IsNullOrWhiteSpace(codeFromDescription)
                    ? codeFromDescription
                    : $"PEDIDO {transaction.Uuid.ToString("N")[..8].ToUpperInvariant()}";
            }

            return new OrderDetailDTO(
                transaction.Uuid,
                transactionCode,
                transaction.Status,
                transaction.CreatedAt.ToLocalTime().ToString("dd/MM/yyyy HH:mm"),
                transaction.Description ?? string.Empty,
                metadata?.PaymentType ?? "Não informado",
                metadata?.AddressLabel ?? "Não informado",
                metadata?.CouponCode ?? "sem",
                metadata?.Subtotal ?? transaction.Amount,
                metadata?.Shipping ?? 0m,
                metadata?.Discount ?? 0m,
                metadata?.Total ?? transaction.Amount,
                metadata?.PrescriptionFileName,
                metadata?.PrescriptionStatus ?? "NAO_APLICA",
                metadata?.PrescriptionNote,
                items,
                (metadata?.AfterSalesRequests ?? new List<AfterSalesRequestMetadata>())
                    .Select(request => MapAfterSalesRequest(request, transaction.Uuid, transactionCode))
                    .ToList());
        }

        public async Task<PrescriptionFileDTO> GetPrescriptionFileAsync(
            Guid transactionUuid,
            Guid? userUuid,
            bool canViewAnyOrder,
            CancellationToken cancellationToken = default)
        {
            var transaction = await _context.Transactions
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.Uuid == transactionUuid, cancellationToken)
                ?? throw new KeyNotFoundException("Pedido não encontrado.");

            if (!canViewAnyOrder)
            {
                if (!userUuid.HasValue)
                    throw new UnauthorizedAccessException("Acesso não autorizado à receita.");

                var customerId = await GetCustomerIdByUserUuidAsync(userUuid.Value, cancellationToken);
                if (transaction.CustomerId != customerId)
                    throw new UnauthorizedAccessException("Acesso não autorizado à receita.");
            }

            var metadata = TryParseMetadata(transaction.MetadataJson)
                ?? throw new InvalidOperationException("Pedido sem metadados de receita.");

            var prescriptionBase64 = metadata.PrescriptionFileBase64;

            if (!string.IsNullOrWhiteSpace(metadata.PrescriptionStoredPath))
            {
                var physicalPath = GetPrescriptionPhysicalPath(metadata.PrescriptionStoredPath);
                if (File.Exists(physicalPath))
                {
                    var bytes = await File.ReadAllBytesAsync(physicalPath, cancellationToken);
                    prescriptionBase64 = Convert.ToBase64String(bytes);
                }
            }

            if (string.IsNullOrWhiteSpace(prescriptionBase64))
                throw new InvalidOperationException("Este pedido não possui arquivo de receita armazenado.");

            return new PrescriptionFileDTO(
                metadata.PrescriptionFileName ?? "receita",
                string.IsNullOrWhiteSpace(metadata.PrescriptionFileContentType)
                    ? "application/octet-stream"
                    : metadata.PrescriptionFileContentType,
                prescriptionBase64);
        }

        public async Task<CheckoutResponseDTO> CheckoutAsync(
            Guid userUuid,
            CheckoutRequestDTO dto,
            CancellationToken cancellationToken = default)
        {
            if (dto.Items is null || dto.Items.Count == 0)
                throw new InvalidOperationException("Informe ao menos um item para checkout.");

            var user = await _context.Users
                .Include(u => u.Customer)
                .FirstOrDefaultAsync(u => u.Uuid == userUuid && u.IsActive, cancellationToken)
                ?? throw new KeyNotFoundException("Usuário não encontrado.");

            if (user.Customer is null)
                throw new InvalidOperationException("Somente clientes podem finalizar pedido.");

            var requested = dto.Items
                .Where(i => i.Quantity > 0)
                .GroupBy(i => i.ProductUuid)
                .Select(g => new CheckoutItemDTO(g.Key, g.Sum(x => x.Quantity)))
                .ToList();

            if (requested.Count == 0)
                throw new InvalidOperationException("Todos os itens informados possuem quantidade inválida.");

            var productUuids = requested.Select(i => i.ProductUuid).ToList();

            var products = await _context.Products
                .Include(p => p.Stock)
                .Include(p => p.ProductCategories)
                    .ThenInclude(pc => pc.Category)
                .Where(p => productUuids.Contains(p.Uuid) && p.IsActive)
                .ToListAsync(cancellationToken);

            if (products.Count != requested.Count)
                throw new InvalidOperationException("Existem itens inválidos ou inativos no carrinho.");

            var lines = new List<TransactionItemMetadata>();
            decimal subtotal = 0m;

            foreach (var item in requested)
            {
                var product = products.First(p => p.Uuid == item.ProductUuid);
                var stock = product.Stock;

                if (stock is null || stock.AvailableQuantity < item.Quantity)
                    throw new InvalidOperationException($"Estoque insuficiente para {product.Name}.");

                stock.AvailableQuantity -= item.Quantity;
                stock.LastUpdated = DateTime.UtcNow;

                var categoryName = product.ProductCategories
                    .Select(pc => pc.Category.Name)
                    .FirstOrDefault() ?? "Sem categoria";

                var lineTotal = product.SalePrice * item.Quantity;
                subtotal += lineTotal;

                lines.Add(new TransactionItemMetadata(
                    product.Uuid,
                    product.Name,
                    categoryName,
                    item.Quantity,
                    product.SalePrice,
                    product.PrescriptionType));
            }

            var shipping = subtotal >= 80m ? 0m : 8.9m;
            var availableExchangeCredit = await GetAvailableExchangeCreditAsync(user.Customer.Id, cancellationToken);

            // Automatic flow: if customer has exchange credit and no coupon, apply it automatically.
            var normalizedCoupon = NormalizeCouponCode(dto.CouponCode);
            if (normalizedCoupon is "" or "sem" && availableExchangeCredit > 0m)
            {
                normalizedCoupon = "troca";
            }

            var discount = CalculateDiscount(normalizedCoupon, subtotal, shipping, availableExchangeCredit);
            var total = subtotal + shipping - discount;

            var resolvedAddressLabel = await ResolveAddressLabelAsync(user.Customer.Id, dto, cancellationToken);
            var (resolvedSingleCardLabel, resolvedSplitPayment) = await ResolvePaymentReferencesAsync(
                user.Customer.Id,
                dto,
                cancellationToken);

            var normalizedCheckout = dto with
            {
                AddressLabel = resolvedAddressLabel,
                SingleCardLabel = resolvedSingleCardLabel,
                SplitPayment = resolvedSplitPayment
            };

            ValidatePaymentRules(normalizedCheckout, total, normalizedCoupon is not ("" or "sem"));

            var requiresPrescription = lines.Any(l =>
                l.PrescriptionType == PrescriptionTypeEnum.TarjaVermelha ||
                l.PrescriptionType == PrescriptionTypeEnum.TarjaPreta);

            if (requiresPrescription)
                ValidatePrescriptionPayload(dto.PrescriptionFileName, dto.PrescriptionFileContentType, dto.PrescriptionFileBase64);

            string? storedPrescriptionPath = null;
            if (requiresPrescription)
            {
                storedPrescriptionPath = PersistPrescriptionFile(
                    dto.PrescriptionFileName!,
                    dto.PrescriptionFileBase64!);
            }

            var txCode = $"PED-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString("N")[..6].ToUpperInvariant()}";

            var metadata = new TransactionMetadata(
                txCode,
                dto.PaymentType,
                normalizedCheckout.AddressLabel,
                normalizedCoupon,
                normalizedCheckout.SingleCardLabel,
                normalizedCheckout.SplitPayment,
                subtotal,
                shipping,
                discount,
                total,
                lines,
                requiresPrescription ? dto.PrescriptionFileName : null,
                requiresPrescription ? PrescriptionPending : "NAO_APLICA",
                requiresPrescription
                    ? "Receita enviada no checkout aguardando análise."
                    : "Pedido sem exigência de receita.",
                null,
                null,
                requiresPrescription ? dto.PrescriptionFileContentType : null,
                null,
                storedPrescriptionPath,
                new List<AfterSalesRequestMetadata>(),
                normalizedCoupon == "troca" ? discount : 0m);

            var status = requiresPrescription ? "AGUARDANDO_ANALISE_RECEITA" : "EM_PROCESSAMENTO";
            var summaryDescription = $"{txCode} - {lines.Count} item(ns)";

            var transaction = new TransactionModel
            {
                CustomerId = user.Customer.Id,
                CreditCardId = null,
                Amount = total,
                Description = summaryDescription,
                Status = status,
                MetadataJson = JsonSerializer.Serialize(metadata, JsonOptions),
                CreatedAt = DateTime.UtcNow
            };

            await using var dbTransaction = await _context.Database.BeginTransactionAsync(cancellationToken);
            try
            {
                await _context.Transactions.AddAsync(transaction, cancellationToken);
                await _context.SaveChangesAsync(cancellationToken);
                await dbTransaction.CommitAsync(cancellationToken);
            }
            catch
            {
                await dbTransaction.RollbackAsync(cancellationToken);
                throw;
            }

            return new CheckoutResponseDTO(
                transaction.Uuid,
                txCode,
                transaction.Status,
                subtotal,
                shipping,
                discount,
                total);
        }

        public async Task<IEnumerable<PrescriptionReviewItemDTO>> GetPrescriptionReviewsAsync(
            string? status,
            CancellationToken cancellationToken = default)
        {
            var normalizedStatus = string.IsNullOrWhiteSpace(status)
                ? null
                : status.Trim().ToUpperInvariant();

            var transactions = await _context.Transactions
                .AsNoTracking()
                .Include(t => t.Customer)
                .Where(t => t.MetadataJson != null)
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync(cancellationToken);

            var items = new List<PrescriptionReviewItemDTO>();

            foreach (var transaction in transactions)
            {
                var metadata = TryParseMetadata(transaction.MetadataJson);
                if (metadata is null) continue;
                if (string.IsNullOrWhiteSpace(metadata.PrescriptionFileName)) continue;

                var reviewStatus = metadata.PrescriptionStatus;
                if (normalizedStatus is not null && reviewStatus != normalizedStatus)
                    continue;

                var prescriptionProducts = metadata.Items
                    .Where(i => i.PrescriptionType != PrescriptionTypeEnum.None)
                    .Select(i => new PrescriptionReviewProductDTO(
                        i.ProductName,
                        i.Quantity,
                        ToPrescriptionLabel(i.PrescriptionType)))
                    .ToList();

                if (prescriptionProducts.Count == 0)
                    continue;

                items.Add(new PrescriptionReviewItemDTO(
                    transaction.Id,
                    transaction.Uuid,
                    metadata.TransactionCode,
                    transaction.Customer.Name,
                    transaction.Customer.Cpf,
                    transaction.CreatedAt.ToLocalTime().ToString("dd/MM/yyyy HH:mm"),
                    metadata.PrescriptionFileName ?? "receita.pdf",
                    reviewStatus,
                    metadata.PrescriptionNote ?? string.Empty,
                    prescriptionProducts));
            }

            return items;
        }

        public async Task ApprovePrescriptionAsync(
            Guid transactionUuid,
            string? note,
            string reviewedBy,
            CancellationToken cancellationToken = default)
        {
            await ReviewPrescriptionAsync(
                transactionUuid,
                PrescriptionApproved,
                "APROVADA",
                note,
                reviewedBy,
                cancellationToken);
        }

        public async Task RejectPrescriptionAsync(
            Guid transactionUuid,
            string? note,
            string reviewedBy,
            CancellationToken cancellationToken = default)
        {
            await ReviewPrescriptionAsync(
                transactionUuid,
                PrescriptionRejected,
                "REPROVADA",
                note,
                reviewedBy,
                cancellationToken);
        }

        public async Task RequestPrescriptionResubmissionAsync(
            Guid transactionUuid,
            string? note,
            string reviewedBy,
            CancellationToken cancellationToken = default)
        {
            var transaction = await _context.Transactions
                .FirstOrDefaultAsync(t => t.Uuid == transactionUuid, cancellationToken)
                ?? throw new KeyNotFoundException("Transação não encontrada.");

            var metadata = TryParseMetadata(transaction.MetadataJson)
                ?? throw new InvalidOperationException("Transação sem metadados válidos.");

            if (string.IsNullOrWhiteSpace(metadata.PrescriptionFileName))
                throw new InvalidOperationException("Esta transação não possui receita para análise.");

            var updated = metadata with
            {
                PrescriptionStatus = PrescriptionResubmissionRequested,
                PrescriptionNote = string.IsNullOrWhiteSpace(note)
                    ? "Solicitado novo envio da receita pelo farmacêutico."
                    : note.Trim(),
                PrescriptionReviewedAt = DateTime.UtcNow,
                PrescriptionReviewedBy = reviewedBy
            };

            transaction.Status = "AGUARDANDO_REENVIO_RECEITA";
            transaction.MetadataJson = JsonSerializer.Serialize(updated, JsonOptions);

            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task ResubmitPrescriptionAsync(
            Guid transactionUuid,
            Guid userUuid,
            PrescriptionResubmissionRequestDTO dto,
            CancellationToken cancellationToken = default)
        {
            ValidatePrescriptionPayload(dto.PrescriptionFileName, dto.PrescriptionFileContentType, dto.PrescriptionFileBase64);

            var customerId = await GetCustomerIdByUserUuidAsync(userUuid, cancellationToken);

            var transaction = await _context.Transactions
                .FirstOrDefaultAsync(t => t.Uuid == transactionUuid, cancellationToken)
                ?? throw new KeyNotFoundException("Pedido não encontrado.");

            if (transaction.CustomerId != customerId)
                throw new UnauthorizedAccessException("Acesso não autorizado ao pedido.");

            if (transaction.Status is not ("AGUARDANDO_REENVIO_RECEITA" or "REPROVADA"))
                throw new InvalidOperationException("Este pedido não está elegível para reenvio de receita.");

            var metadata = TryParseMetadata(transaction.MetadataJson)
                ?? throw new InvalidOperationException("Transação sem metadados válidos.");

            var storedPrescriptionPath = PersistPrescriptionFile(
                dto.PrescriptionFileName,
                dto.PrescriptionFileBase64);

            var updated = metadata with
            {
                PrescriptionFileName = dto.PrescriptionFileName.Trim(),
                PrescriptionFileContentType = dto.PrescriptionFileContentType.Trim(),
                PrescriptionFileBase64 = null,
                PrescriptionStoredPath = storedPrescriptionPath,
                PrescriptionStatus = PrescriptionPending,
                PrescriptionNote = string.IsNullOrWhiteSpace(dto.Note)
                    ? "Nova receita enviada pelo cliente."
                    : dto.Note.Trim(),
                PrescriptionReviewedAt = null,
                PrescriptionReviewedBy = null
            };

            transaction.Status = "AGUARDANDO_ANALISE_RECEITA";
            transaction.MetadataJson = JsonSerializer.Serialize(updated, JsonOptions);

            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task<SalesCatalogDTO> GetSalesCatalogAsync(
            CancellationToken cancellationToken = default)
        {
            var transactions = await _context.Transactions
                .AsNoTracking()
                .Where(t => t.MetadataJson != null)
                .ToListAsync(cancellationToken);

            var flatLines = new List<SalesFlatLine>();

            foreach (var transaction in transactions)
            {
                var metadata = TryParseMetadata(transaction.MetadataJson);
                if (metadata is null) continue;

                if (transaction.Status == "REPROVADA")
                    continue;

                var period = transaction.CreatedAt.ToString("yyyy-MM");

                foreach (var item in metadata.Items)
                {
                    flatLines.Add(new SalesFlatLine(
                        period,
                        item.ProductName,
                        item.CategoryName,
                        item.Quantity,
                        item.UnitPrice * item.Quantity));
                }
            }

            var periods = flatLines
                .Select(f => f.Period)
                .Distinct()
                .OrderBy(p => p)
                .ToList();

            if (periods.Count == 0)
                periods.Add(DateTime.UtcNow.ToString("yyyy-MM"));

            var periodOptions = periods.Select(p => new SalesPeriodDTO(p, ToPeriodLabel(p))).ToList();

            var productSeries = BuildSeries(
                flatLines,
                periods,
                keySelector: f => f.ProductName,
                maxSeries: 12);

            var categorySeries = BuildSeries(
                flatLines,
                periods,
                keySelector: f => f.CategoryName,
                maxSeries: 12);

            return new SalesCatalogDTO(periodOptions, productSeries, categorySeries);
        }

        private async Task<decimal> ApplyApprovedAfterSalesEffectsAsync(
            TransactionMetadata metadata,
            AfterSalesRequestMetadata request,
            CancellationToken cancellationToken)
        {
            var requestedByProduct = request.Items
                .GroupBy(item => item.ProductUuid)
                .Select(group => new
                {
                    ProductUuid = group.Key,
                    Quantity = group.Sum(item => item.Quantity)
                })
                .ToList();

            var requestProductUuids = requestedByProduct.Select(item => item.ProductUuid).ToList();

            var stocks = await _context.ProductStocks
                .Include(stock => stock.Product)
                .Where(stock => requestProductUuids.Contains(stock.Product.Uuid))
                .ToListAsync(cancellationToken);

            foreach (var requestedItem in requestedByProduct)
            {
                var stock = stocks.FirstOrDefault(s => s.Product.Uuid == requestedItem.ProductUuid);
                if (stock is null)
                    continue;

                stock.AvailableQuantity += requestedItem.Quantity;
                stock.LastUpdated = DateTime.UtcNow;
            }

            var unitPriceByProduct = metadata.Items
                .GroupBy(item => item.ProductUuid)
                .ToDictionary(group => group.Key, group => group.First().UnitPrice);

            decimal compensationAmount = 0m;
            foreach (var requestedItem in requestedByProduct)
            {
                if (!unitPriceByProduct.TryGetValue(requestedItem.ProductUuid, out var unitPrice))
                    continue;

                compensationAmount += unitPrice * requestedItem.Quantity;
            }

            return compensationAmount;
        }

        private async Task<string> ResolveAddressLabelAsync(
            int customerId,
            CheckoutRequestDTO dto,
            CancellationToken cancellationToken)
        {
            if (dto.AddressUuid.HasValue)
            {
                var address = await _context.Set<CustomerAddressModel>()
                    .AsNoTracking()
                    .FirstOrDefaultAsync(
                        a => a.CustomerId == customerId && a.Uuid == dto.AddressUuid.Value && a.IsActive,
                        cancellationToken)
                    ?? throw new InvalidOperationException("Endereço de entrega inválido para este cliente.");

                return string.IsNullOrWhiteSpace(address.Label)
                    ? $"{address.Street}, {address.Number} - {address.City}/{address.State} • {address.ZipCode}"
                    : $"{address.Label} - {address.Street}, {address.Number} - {address.City}/{address.State} • {address.ZipCode}";
            }

            if (string.IsNullOrWhiteSpace(dto.AddressLabel))
                throw new InvalidOperationException("Selecione um endereço de entrega válido.");

            return dto.AddressLabel.Trim();
        }

        private async Task<(string? SingleCardLabel, CheckoutSplitPaymentDTO? SplitPayment)> ResolvePaymentReferencesAsync(
            int customerId,
            CheckoutRequestDTO dto,
            CancellationToken cancellationToken)
        {
            var paymentType = (dto.PaymentType ?? string.Empty).Trim().ToLowerInvariant();

            if (paymentType == "credito1")
            {
                if (dto.SingleCardUuid.HasValue)
                {
                    var card = await _context.Set<CreditCardModel>()
                        .AsNoTracking()
                        .Include(c => c.CardBrand)
                        .FirstOrDefaultAsync(
                            c => c.CustomerId == customerId && c.Uuid == dto.SingleCardUuid.Value && c.IsActive,
                            cancellationToken)
                        ?? throw new InvalidOperationException("Cartão inválido para este cliente.");

                    var masked = card.CardNumber.Length >= 4
                        ? $"**** **** **** {card.CardNumber[^4..]}"
                        : "****";

                    var label = $"{card.CardBrand?.Name?.ToUpperInvariant() ?? "CARTAO"} {masked}";
                    return (label, null);
                }

                return (dto.SingleCardLabel?.Trim(), null);
            }

            if (paymentType == "credito2")
            {
                if (dto.SplitPayment is null)
                    return (null, null);

                var split = dto.SplitPayment;
                var firstLabel = split.FirstCardLabel?.Trim();
                var secondLabel = split.SecondCardLabel?.Trim();

                if (split.FirstCardUuid.HasValue || split.SecondCardUuid.HasValue)
                {
                    if (!split.FirstCardUuid.HasValue || !split.SecondCardUuid.HasValue)
                        throw new InvalidOperationException("Selecione os dois cartões para pagamento dividido.");

                    if (split.FirstCardUuid == split.SecondCardUuid)
                        throw new InvalidOperationException("Selecione cartões diferentes para pagamento dividido.");

                    var cardUuids = new[] { split.FirstCardUuid.Value, split.SecondCardUuid.Value };
                    var cards = await _context.Set<CreditCardModel>()
                        .AsNoTracking()
                        .Include(c => c.CardBrand)
                        .Where(c => c.CustomerId == customerId && c.IsActive && cardUuids.Contains(c.Uuid))
                        .ToListAsync(cancellationToken);

                    if (cards.Count != 2)
                        throw new InvalidOperationException("Um ou mais cartões informados são inválidos para este cliente.");

                    var firstCard = cards.First(c => c.Uuid == split.FirstCardUuid.Value);
                    var secondCard = cards.First(c => c.Uuid == split.SecondCardUuid.Value);

                    firstLabel = BuildCardLabel(firstCard);
                    secondLabel = BuildCardLabel(secondCard);
                }

                return (null, new CheckoutSplitPaymentDTO(
                    firstLabel,
                    secondLabel,
                    split.FirstAmount,
                    split.SecondAmount,
                    split.FirstCardUuid,
                    split.SecondCardUuid));
            }

            return (null, null);
        }

        private static string BuildCardLabel(CreditCardModel card)
        {
            var masked = card.CardNumber.Length >= 4
                ? $"**** **** **** {card.CardNumber[^4..]}"
                : "****";

            return $"{card.CardBrand?.Name?.ToUpperInvariant() ?? "CARTAO"} {masked}";
        }

        private static string PersistPrescriptionFile(string fileName, string base64Content)
        {
            var directory = Path.Combine(Directory.GetCurrentDirectory(), "Storage", "Prescriptions");
            Directory.CreateDirectory(directory);

            var sanitizedFileName = string.IsNullOrWhiteSpace(fileName)
                ? "receita"
                : string.Join("", fileName.Trim().Where(c => char.IsLetterOrDigit(c) || c is '.' or '-' or '_'));

            var extension = Path.GetExtension(sanitizedFileName);
            if (string.IsNullOrWhiteSpace(extension))
                extension = ".bin";

            var storedFileName = $"{Guid.NewGuid():N}{extension}";
            var relativePath = Path.Combine("Storage", "Prescriptions", storedFileName);
            var fullPath = GetPrescriptionPhysicalPath(relativePath);

            var bytes = Convert.FromBase64String(base64Content.Trim());
            File.WriteAllBytes(fullPath, bytes);

            return relativePath;
        }

        private static string GetPrescriptionPhysicalPath(string relativePath)
            => Path.Combine(Directory.GetCurrentDirectory(), relativePath);

        private async Task<PagedResultDTO<TransactionModel>> GetTransactionsCoreAsync(
            int page,
            int pageSize,
            string? status,
            int? customerId,
            CancellationToken cancellationToken)
        {
            var safePage = Math.Max(1, page);
            var safePageSize = Math.Clamp(pageSize, 1, 100);

            var normalizedStatus = string.IsNullOrWhiteSpace(status)
                ? null
                : status.Trim().ToUpperInvariant();

            var query = _context.Transactions
                .AsNoTracking()
                .AsQueryable();

            if (customerId.HasValue)
                query = query.Where(t => t.CustomerId == customerId.Value);

            if (normalizedStatus is not null)
                query = query.Where(t => t.Status == normalizedStatus);

            var totalCount = await query.CountAsync(cancellationToken);

            var items = await query
                .OrderByDescending(t => t.CreatedAt)
                .Skip((safePage - 1) * safePageSize)
                .Take(safePageSize)
                .ToListAsync(cancellationToken);

            return new PagedResultDTO<TransactionModel>(items, totalCount, safePage, safePageSize);
        }

        private async Task ReviewPrescriptionAsync(
            Guid transactionUuid,
            string prescriptionStatus,
            string transactionStatus,
            string? note,
            string reviewedBy,
            CancellationToken cancellationToken)
        {
            var transaction = await _context.Transactions
                .FirstOrDefaultAsync(t => t.Uuid == transactionUuid, cancellationToken)
                ?? throw new KeyNotFoundException("Transação não encontrada.");

            var metadata = TryParseMetadata(transaction.MetadataJson)
                ?? throw new InvalidOperationException("Transação sem metadados válidos.");

            if (string.IsNullOrWhiteSpace(metadata.PrescriptionFileName))
                throw new InvalidOperationException("Esta transação não possui receita para análise.");

            var updated = metadata with
            {
                PrescriptionStatus = prescriptionStatus,
                PrescriptionNote = string.IsNullOrWhiteSpace(note)
                    ? prescriptionStatus == PrescriptionApproved
                        ? "Receita aprovada para separação do pedido."
                        : "Receita rejeitada. Solicitar novo envio ao cliente."
                    : note.Trim(),
                PrescriptionReviewedAt = DateTime.UtcNow,
                PrescriptionReviewedBy = reviewedBy
            };

            transaction.Status = transactionStatus;
            transaction.MetadataJson = JsonSerializer.Serialize(updated, JsonOptions);

            await _context.SaveChangesAsync(cancellationToken);
        }

        private static IEnumerable<SalesSeriesDTO> BuildSeries(
            IEnumerable<SalesFlatLine> lines,
            IList<string> periods,
            Func<SalesFlatLine, string> keySelector,
            int maxSeries)
        {
            var grouped = lines
                .GroupBy(keySelector)
                .Select(g => new
                {
                    Name = g.Key,
                    Total = g.Sum(x => x.Quantity),
                    Lines = g.ToList()
                })
                .OrderByDescending(g => g.Total)
                .Take(maxSeries)
                .ToList();

            return grouped.Select(group =>
            {
                var points = periods.Select(period =>
                {
                    var periodLines = group.Lines.Where(l => l.Period == period).ToList();
                    return new SalesPointDTO(
                        period,
                        ToPeriodLabel(period),
                        periodLines.Sum(l => l.Quantity),
                        periodLines.Sum(l => l.Revenue));
                }).ToList();

                return new SalesSeriesDTO(ToSlug(group.Name), group.Name, points);
            });
        }

        private static decimal CalculateDiscount(string? couponCode, decimal subtotal, decimal shipping, decimal availableExchangeCredit)
        {
            var coupon = NormalizeCouponCode(couponCode);

            return coupon switch
            {
                "semana10" => Math.Round(subtotal * 0.10m, 2),
                "fretegratis" => shipping,
                "troca" => Math.Min(availableExchangeCredit, subtotal + shipping),
                _ => 0m
            };
        }

        private static string NormalizeCouponCode(string? couponCode)
            => (couponCode ?? string.Empty).Trim().ToLowerInvariant();

        private async Task<decimal> GetAvailableExchangeCreditAsync(int customerId, CancellationToken cancellationToken)
        {
            var snapshot = await GetExchangeCreditSnapshotAsync(customerId, cancellationToken);
            return snapshot.AvailableCredit;
        }

        private async Task<ExchangeCreditSnapshot> GetExchangeCreditSnapshotAsync(int customerId, CancellationToken cancellationToken)
        {
            var transactions = await _context.Transactions
                .AsNoTracking()
                .Where(t => t.CustomerId == customerId && t.MetadataJson != null)
                .ToListAsync(cancellationToken);

            decimal used = 0m;
            var earnedEntries = new List<(Guid TransactionUuid, string TransactionCode, decimal OriginalAmount, DateTime ApprovedAt)>();

            foreach (var transaction in transactions)
            {
                var metadata = TryParseMetadata(transaction.MetadataJson);
                if (metadata is null)
                    continue;

                var transactionCode = string.IsNullOrWhiteSpace(metadata.TransactionCode)
                    ? $"PEDIDO {transaction.Uuid.ToString("N")[..8].ToUpperInvariant()}"
                    : metadata.TransactionCode;

                var requests = (metadata.AfterSalesRequests ?? new List<AfterSalesRequestMetadata>())
                    .Where(request =>
                        request.Status == AfterSalesApproved &&
                        request.Type == "TROCA" &&
                        request.CompensationType == "CREDITO_TROCA" &&
                        request.CompensationAmount.HasValue)
                    .ToList();

                foreach (var request in requests)
                {
                    earnedEntries.Add((
                        transaction.Uuid,
                        transactionCode,
                        request.CompensationAmount!.Value,
                        request.ReviewedAt ?? request.RequestedAt));
                }

                used += metadata.AppliedExchangeCredit ?? 0m;
            }

            var orderedEntries = earnedEntries
                .OrderBy(entry => entry.ApprovedAt)
                .ToList();

            var remainingToAllocate = used;
            var resultEntries = new List<ExchangeCreditEntryDTO>();

            foreach (var entry in orderedEntries)
            {
                var consumed = Math.Min(entry.OriginalAmount, remainingToAllocate);
                var remaining = Math.Max(0m, entry.OriginalAmount - consumed);
                remainingToAllocate = Math.Max(0m, remainingToAllocate - consumed);

                if (remaining <= 0m)
                    continue;

                resultEntries.Add(new ExchangeCreditEntryDTO(
                    entry.TransactionUuid,
                    entry.TransactionCode,
                    decimal.Round(entry.OriginalAmount, 2),
                    decimal.Round(remaining, 2),
                    entry.ApprovedAt.ToLocalTime().ToString("dd/MM/yyyy HH:mm")));
            }

            var available = resultEntries.Sum(entry => entry.RemainingAmount);
            return new ExchangeCreditSnapshot(decimal.Round(available, 2), resultEntries);
        }

        private static void ValidatePaymentRules(CheckoutRequestDTO dto, decimal total, bool hasCoupon)
        {
            var payment = (dto.PaymentType ?? string.Empty).Trim().ToLowerInvariant();

            if (payment is not ("credito1" or "credito2" or "debito" or "pix"))
                throw new InvalidOperationException("Forma de pagamento inválida.");

            if (payment == "credito1" && string.IsNullOrWhiteSpace(dto.SingleCardLabel))
                throw new InvalidOperationException("Selecione um cartão para pagamento em crédito.");

            if (payment == "credito1" && !hasCoupon && total > 0m && total < 10m)
                throw new InvalidOperationException("Sem cupom, pagamento em 1 cartão exige mínimo de R$ 10,00.");

            if (payment != "credito2")
                return;

            var split = dto.SplitPayment
                ?? throw new InvalidOperationException("Informe a divisão de pagamento entre os cartões.");

            if (string.IsNullOrWhiteSpace(split.FirstCardLabel) || string.IsNullOrWhiteSpace(split.SecondCardLabel))
                throw new InvalidOperationException("Selecione os dois cartões para pagamento dividido.");

            if (split.FirstCardLabel == split.SecondCardLabel)
                throw new InvalidOperationException("Selecione cartões diferentes para pagamento dividido.");

            var first = split.FirstAmount ?? 0m;
            var second = split.SecondAmount ?? 0m;
            var minCardAmount = hasCoupon ? 0.01m : 10m;

            if (first < minCardAmount || second < minCardAmount)
                throw new InvalidOperationException("Valor mínimo por cartão não atendido.");

            if (Math.Abs((first + second) - total) > 0.01m)
                throw new InvalidOperationException("A soma dos cartões deve ser igual ao valor total do pedido.");
        }

        private static string ToPeriodLabel(string period)
        {
            if (!DateTime.TryParseExact(period + "-01", "yyyy-MM-dd", CultureInfo.InvariantCulture,
                    DateTimeStyles.None, out var parsed))
            {
                return period;
            }

            var month = parsed.ToString("MMM", new CultureInfo("pt-BR"));
            month = char.ToUpperInvariant(month[0]) + month[1..].TrimEnd('.').ToLowerInvariant();
            return $"{month}/{parsed:yyyy}";
        }

        private static string ToPrescriptionLabel(PrescriptionTypeEnum type)
            => type switch
            {
                PrescriptionTypeEnum.TarjaAmarela => "Tarja amarela",
                PrescriptionTypeEnum.TarjaVermelha => "Tarja vermelha",
                PrescriptionTypeEnum.TarjaPreta => "Tarja preta",
                _ => "Isento"
            };

        private static string ToSlug(string value)
        {
            var chars = value
                .Trim()
                .ToLowerInvariant()
                .Select(c => char.IsLetterOrDigit(c) ? c : '-')
                .ToArray();

            var slug = new string(chars);
            while (slug.Contains("--")) slug = slug.Replace("--", "-");
            return slug.Trim('-');
        }

        private static void ValidatePrescriptionPayload(
            string? fileName,
            string? contentType,
            string? fileBase64)
        {
            if (string.IsNullOrWhiteSpace(fileName))
                throw new InvalidOperationException("Este pedido exige envio de receita.");

            if (string.IsNullOrWhiteSpace(fileBase64))
                throw new InvalidOperationException("Arquivo da receita inválido.");

            if (string.IsNullOrWhiteSpace(contentType))
                throw new InvalidOperationException("Tipo de arquivo da receita inválido.");

            try
            {
                _ = Convert.FromBase64String(fileBase64.Trim());
            }
            catch
            {
                throw new InvalidOperationException("Arquivo da receita inválido.");
            }
        }

        private static string NormalizeAfterSalesType(string? type)
        {
            var normalized = (type ?? string.Empty).Trim().ToUpperInvariant();
            if (normalized is not ("TROCA" or "DEVOLUCAO"))
                throw new InvalidOperationException("Tipo da solicitação deve ser TROCA ou DEVOLUCAO.");

            return normalized;
        }

        private static AfterSalesRequestDTO MapAfterSalesRequest(
            AfterSalesRequestMetadata request,
            Guid transactionUuid,
            string transactionCode)
        {
            return new AfterSalesRequestDTO(
                request.RequestUuid,
                transactionUuid,
                transactionCode,
                request.Type,
                request.Status,
                request.Reason,
                request.ReviewNote,
                request.CompensationType,
                request.CompensationAmount,
                request.RequestedAt.ToLocalTime().ToString("dd/MM/yyyy HH:mm"),
                request.ReviewedAt?.ToLocalTime().ToString("dd/MM/yyyy HH:mm"),
                request.ReviewedBy,
                request.Items.Select(item => new AfterSalesRequestItemDTO(
                    item.ProductUuid,
                    item.ProductName,
                    item.Quantity)).ToList());
        }

        private async Task<int> GetCustomerIdByUserUuidAsync(Guid userUuid, CancellationToken cancellationToken)
        {
            var customerId = await _context.Users
                .AsNoTracking()
                .Include(u => u.Customer)
                .Where(u => u.Uuid == userUuid && u.IsActive)
                .Select(u => u.Customer != null ? (int?)u.Customer.Id : null)
                .FirstOrDefaultAsync(cancellationToken)
                ?? throw new KeyNotFoundException("Usuário não encontrado.");

            return customerId;
        }

        private static TransactionMetadata? TryParseMetadata(string? json)
        {
            if (string.IsNullOrWhiteSpace(json)) return null;

            try
            {
                return JsonSerializer.Deserialize<TransactionMetadata>(json, JsonOptions);
            }
            catch
            {
                return null;
            }
        }

        private sealed record TransactionMetadata(
            string TransactionCode,
            string PaymentType,
            string AddressLabel,
            string CouponCode,
            string? SingleCardLabel,
            CheckoutSplitPaymentDTO? SplitPayment,
            decimal Subtotal,
            decimal Shipping,
            decimal Discount,
            decimal Total,
            List<TransactionItemMetadata> Items,
            string? PrescriptionFileName,
            string PrescriptionStatus,
            string? PrescriptionNote,
            DateTime? PrescriptionReviewedAt,
            string? PrescriptionReviewedBy,
            string? PrescriptionFileContentType,
            string? PrescriptionFileBase64,
            string? PrescriptionStoredPath = null,
            List<AfterSalesRequestMetadata>? AfterSalesRequests = null,
            decimal? AppliedExchangeCredit = null);

        private sealed record AfterSalesRequestMetadata(
            Guid RequestUuid,
            string Type,
            string Status,
            string Reason,
            string? ReviewNote,
            DateTime RequestedAt,
            DateTime? ReviewedAt,
            string? ReviewedBy,
            List<AfterSalesRequestItemMetadata> Items,
            string? CompensationType = null,
            decimal? CompensationAmount = null,
            DateTime? StockUpdatedAt = null);

        private sealed record AfterSalesRequestItemMetadata(
            Guid ProductUuid,
            string ProductName,
            int Quantity);

        private sealed record TransactionItemMetadata(
            Guid ProductUuid,
            string ProductName,
            string CategoryName,
            int Quantity,
            decimal UnitPrice,
            PrescriptionTypeEnum PrescriptionType);

        private sealed record SalesFlatLine(
            string Period,
            string ProductName,
            string CategoryName,
            int Quantity,
            decimal Revenue);

        private sealed record ExchangeCreditSnapshot(
            decimal AvailableCredit,
            List<ExchangeCreditEntryDTO> Entries);
    }
}
