using Microsoft.EntityFrameworkCore;
using ProjetoLES.Server.Data;
using ProjetoLES.Server.DTO_s;
using ProjetoLES.Server.DTO_s.Product;
using ProjetoLES.Server.Interfaces.Repositories;
using ProjetoLES.Server.Interfaces.Services;
using ProjetoLES.Server.Models;

namespace ProjetoLES.Server.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;
        private readonly AppDbContext _context;

        public ProductService(IProductRepository productRepository, AppDbContext context)
        {
            _productRepository = productRepository;
            _context = context;
        }

        public async Task<ProductResponseDTO?> GetByUuidAsync(
            Guid uuid,
            CancellationToken cancellationToken = default)
        {
            var product = await _productRepository.GetFullAsync(uuid, cancellationToken);
            return product is null ? null : MapToResponse(product);
        }

        public async Task<PagedResultDTO<ProductSummaryDTO>> GetPagedAsync(
            ProductFilterDTO filter,
            CancellationToken cancellationToken = default)
        {
            var (items, total) = await _productRepository.GetPagedAsync(filter, cancellationToken);

            var dtos = items.Select(MapToSummary).ToList();

            return new PagedResultDTO<ProductSummaryDTO>(dtos, total, filter.Page, filter.PageSize);
        }

        public async Task<IEnumerable<ProductSummaryDTO>> GetSubstitutesAsync(
            Guid productUuid,
            CancellationToken cancellationToken = default)
        {
            var product = await _productRepository.GetByUuidAsync(productUuid, cancellationToken);
            if (product is null || string.IsNullOrWhiteSpace(product.ActivePrinciple))
                return Enumerable.Empty<ProductSummaryDTO>();

            var substitutes = await _productRepository.GetByActivePrincipleAsync(
                product.ActivePrinciple, cancellationToken);

            return substitutes
                .Where(p => p.Uuid != productUuid)
                .Select(MapToSummary);
        }


        public async Task<IEnumerable<DrugInteractionAlertDTO>> CheckDrugInteractionsAsync(
            IEnumerable<Guid> productUuids,
            CancellationToken cancellationToken = default)
        {
            var uuidList = productUuids.Distinct().ToList();
            if (uuidList.Count < 2)
                return Enumerable.Empty<DrugInteractionAlertDTO>();

            var productIds = await _context.Set<ProductModel>()
                .Where(p => uuidList.Contains(p.Uuid))
                .Select(p => new { p.Id, p.Uuid, p.Name })
                .ToListAsync(cancellationToken);

            var idList = productIds.Select(p => p.Id).ToList();

            var interactions = await _context.Set<DrugInteractionModel>()
                .AsNoTracking()
                .Include(d => d.ProductA)
                .Include(d => d.ProductB)
                .Where(d =>
                    idList.Contains(d.ProductAId) &&
                    idList.Contains(d.ProductBId) &&
                    d.SeverityLevel >= 2)
                .ToListAsync(cancellationToken);

            return interactions.Select(d => new DrugInteractionAlertDTO(
                d.ProductA.Uuid,
                d.ProductA.Name,
                d.ProductB.Uuid,
                d.ProductB.Name,
                d.Description,
                d.SeverityLevel
            ));
        }

        private static ProductResponseDTO MapToResponse(ProductModel p)
            => new(
                p.Uuid,
                p.ProductCode,
                p.Name,
                p.Description,
                p.ActivePrinciple,
                p.Barcode,
                p.ImageUrl,
                p.HeightCm,
                p.WidthCm,
                p.DepthCm,
                p.WeightGrams,
                p.PrescriptionType,
                p.SalePrice,
                p.IsActive,
                p.PricingGroup?.Name ?? string.Empty,
                p.ProductCategories.Select(pc => pc.Category.Name),
                p.Stock?.AvailableQuantity ?? 0,
                p.Stock?.BlockedQuantity ?? 0
            );

        private static ProductSummaryDTO MapToSummary(ProductModel p)
            => new(
                p.Uuid,
                p.ProductCode,
                p.Name,
                p.ActivePrinciple,
                p.ImageUrl,
                p.SalePrice,
                p.PrescriptionType,
                p.IsActive,
                p.ProductCategories.Select(pc => pc.Category.Name),
                p.Stock?.AvailableQuantity ?? 0
            );
    }
}
