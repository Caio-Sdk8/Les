using Microsoft.EntityFrameworkCore;
using ProjetoLES.Server.Data;
using ProjetoLES.Server.DTO_s;
using ProjetoLES.Server.DTO_s.Stock;
using ProjetoLES.Server.Interfaces.Repositories;
using ProjetoLES.Server.Interfaces.Services;
using ProjetoLES.Server.Models;

namespace ProjetoLES.Server.Services
{
    public class StockService : IStockService
    {
        private readonly IStockRepository _stockRepository;
        private readonly AppDbContext _context;

        public StockService(IStockRepository stockRepository, AppDbContext context)
        {
            _stockRepository = stockRepository;
            _context = context;
        }

        public async Task<StockEntryResponseDTO> RegisterEntryAsync(
            StockEntryCreateDTO dto,
            CancellationToken cancellationToken = default)
        {
            if (dto.Quantity <= 0)
                throw new InvalidOperationException("A quantidade deve ser maior que zero.");

            if (dto.CostValue <= 0)
                throw new InvalidOperationException("O valor de custo deve ser maior que zero.");

            if (dto.EntryDate == default)
                throw new InvalidOperationException("A data de entrada é obrigatória.");

            var product = await _context.Set<ProductModel>()
                .Include(p => p.PricingGroup)
                .Include(p => p.Stock)
                .FirstOrDefaultAsync(p => p.Uuid == dto.ProductUuid, cancellationToken)
                ?? throw new InvalidOperationException("Produto não encontrado.");

            var supplier = await _context.Set<SupplierModel>()
                .FirstOrDefaultAsync(s => s.Uuid == dto.SupplierUuid && s.IsActive, cancellationToken)
                ?? throw new InvalidOperationException("Fornecedor não encontrado ou inativo.");

            await using var transaction = await _context.Database.BeginTransactionAsync(cancellationToken);
            try
            {
                var entry = new StockEntryModel
                {
                    ProductId = product.Id,
                    SupplierId = supplier.Id,
                    Quantity = dto.Quantity,
                    CostValue = dto.CostValue,
                    EntryDate = dto.EntryDate,
                    CreatedAt = DateTime.UtcNow
                };
                await _context.Set<StockEntryModel>().AddAsync(entry, cancellationToken);
                await _context.SaveChangesAsync(cancellationToken);

                var maxCost = await _context.Set<StockEntryModel>()
                    .Where(e => e.ProductId == product.Id)
                    .MaxAsync(e => e.CostValue, cancellationToken);

                product.SalePrice = maxCost * (1 + product.PricingGroup.ProfitMarginPercent / 100m);
                product.UpdatedAt = DateTime.UtcNow;
                _context.Set<ProductModel>().Update(product);

                var stock = product.Stock;
                if (stock is null)
                {
                    stock = new ProductStockModel
                    {
                        ProductId = product.Id,
                        AvailableQuantity = dto.Quantity,
                        BlockedQuantity = 0,
                        LastUpdated = DateTime.UtcNow
                    };
                    await _context.Set<ProductStockModel>().AddAsync(stock, cancellationToken);
                }
                else
                {
                    stock.AvailableQuantity += dto.Quantity;
                    stock.LastUpdated = DateTime.UtcNow;
                    _context.Set<ProductStockModel>().Update(stock);
                }

                await _context.SaveChangesAsync(cancellationToken);
                await transaction.CommitAsync(cancellationToken);

                return new StockEntryResponseDTO(
                    entry.Uuid,
                    product.Uuid,
                    product.Name,
                    supplier.Uuid,
                    supplier.Name,
                    entry.Quantity,
                    entry.CostValue,
                    entry.EntryDate,
                    entry.CreatedAt
                );
            }
            catch
            {
                await transaction.RollbackAsync(cancellationToken);
                throw;
            }
        }

        public async Task<ProductStockResponseDTO?> GetStockByProductAsync(
            Guid productUuid,
            CancellationToken cancellationToken = default)
        {
            var product = await _context.Set<ProductModel>()
                .AsNoTracking()
                .Include(p => p.Stock)
                .FirstOrDefaultAsync(p => p.Uuid == productUuid, cancellationToken);

            if (product is null) return null;

            var stock = product.Stock;
            return new ProductStockResponseDTO(
                product.Uuid,
                product.Name,
                stock?.AvailableQuantity ?? 0,
                stock?.BlockedQuantity ?? 0,
                (stock?.AvailableQuantity ?? 0) + (stock?.BlockedQuantity ?? 0),
                stock?.LastUpdated ?? DateTime.MinValue
            );
        }

        public async Task<PagedResultDTO<StockSummaryDTO>> GetStockPagedAsync(
            StockFilterDTO filter,
            CancellationToken cancellationToken = default)
        {
            var (items, total) = await _stockRepository.GetStockPagedAsync(filter, cancellationToken);

            var dtos = items.Select(s => new StockSummaryDTO(
                s.Product.Uuid,
                s.Product.ProductCode,
                s.Product.Name,
                s.Product.SalePrice,
                s.AvailableQuantity,
                s.BlockedQuantity
            )).ToList();

            return new PagedResultDTO<StockSummaryDTO>(dtos, total, filter.Page, filter.PageSize);
        }

        public async Task<IEnumerable<StockEntryResponseDTO>> GetEntriesByProductAsync(
            Guid productUuid,
            CancellationToken cancellationToken = default)
        {
            var entries = await _stockRepository.GetEntriesByProductAsync(productUuid, cancellationToken);

            return entries.Select(e => new StockEntryResponseDTO(
                e.Uuid,
                e.Product.Uuid,
                e.Product.Name,
                e.Supplier.Uuid,
                e.Supplier.Name,
                e.Quantity,
                e.CostValue,
                e.EntryDate,
                e.CreatedAt
            ));
        }
    }
}
