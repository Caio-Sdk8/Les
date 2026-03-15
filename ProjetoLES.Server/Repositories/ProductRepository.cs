using Microsoft.EntityFrameworkCore;
using ProjetoLES.Server.Data;
using ProjetoLES.Server.DTO_s.Product;
using ProjetoLES.Server.Interfaces.Repositories;
using ProjetoLES.Server.Models;

namespace ProjetoLES.Server.Repositories
{
    public class ProductRepository : BaseRepository<ProductModel>, IProductRepository
    {
        public ProductRepository(AppDbContext context) : base(context) { }

        public async Task<ProductModel?> GetFullAsync(Guid uuid, CancellationToken cancellationToken = default)
            => await _dbSet
                .AsNoTracking()
                .Include(p => p.PricingGroup)
                .Include(p => p.Stock)
                .Include(p => p.ProductCategories)
                    .ThenInclude(pc => pc.Category)
                .FirstOrDefaultAsync(p => p.Uuid == uuid, cancellationToken);

        public async Task<(IEnumerable<ProductModel> Items, int TotalCount)> GetPagedAsync(
            ProductFilterDTO filter,
            CancellationToken cancellationToken = default)
        {
            var query = _dbSet
                .AsNoTracking()
                .Include(p => p.Stock)
                .Include(p => p.ProductCategories)
                    .ThenInclude(pc => pc.Category)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(filter.Search))
            {
                var term = filter.Search.Trim();
                query = query.Where(p =>
                    p.Name.Contains(term) ||
                    p.ProductCode.Contains(term) ||
                    (p.ActivePrinciple != null && p.ActivePrinciple.Contains(term)) ||
                    p.Barcode.Contains(term));
            }

            if (!string.IsNullOrWhiteSpace(filter.Name))
                query = query.Where(p => p.Name.Contains(filter.Name));

            if (!string.IsNullOrWhiteSpace(filter.ActivePrinciple))
                query = query.Where(p => p.ActivePrinciple != null && p.ActivePrinciple.Contains(filter.ActivePrinciple));

            if (!string.IsNullOrWhiteSpace(filter.Barcode))
                query = query.Where(p => p.Barcode == filter.Barcode);

            if (!string.IsNullOrWhiteSpace(filter.ProductCode))
                query = query.Where(p => p.ProductCode == filter.ProductCode);

            if (filter.CategoryUuid.HasValue)
                query = query.Where(p => p.ProductCategories
                    .Any(pc => pc.Category.Uuid == filter.CategoryUuid.Value));

            if (filter.PrescriptionType.HasValue)
                query = query.Where(p => p.PrescriptionType == filter.PrescriptionType.Value);

            if (filter.IsActive.HasValue)
                query = query.Where(p => p.IsActive == filter.IsActive.Value);

            if (filter.InStock == true)
                query = query.Where(p => p.Stock != null && p.Stock.AvailableQuantity > 0);
            else if (filter.InStock == false)
                query = query.Where(p => p.Stock == null || p.Stock.AvailableQuantity == 0);

            var totalCount = await query.CountAsync(cancellationToken);
            var items = await query
                .OrderBy(p => p.Name)
                .Skip((filter.Page - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync(cancellationToken);

            return (items, totalCount);
        }

        public async Task<bool> ExistsByBarcodeAsync(string barcode, CancellationToken cancellationToken = default)
            => await _dbSet.AnyAsync(p => p.Barcode == barcode, cancellationToken);

        public async Task<bool> ExistsByProductCodeAsync(string productCode, CancellationToken cancellationToken = default)
            => await _dbSet.AnyAsync(p => p.ProductCode == productCode, cancellationToken);

        public async Task<IEnumerable<ProductModel>> GetByActivePrincipleAsync(
            string activePrinciple,
            CancellationToken cancellationToken = default)
            => await _dbSet
                .AsNoTracking()
                .Include(p => p.Stock)
                .Include(p => p.ProductCategories)
                    .ThenInclude(pc => pc.Category)
                .Where(p => p.ActivePrinciple != null
                            && p.ActivePrinciple == activePrinciple
                            && p.IsActive
                            && p.Stock != null
                            && p.Stock.AvailableQuantity > 0)
                .ToListAsync(cancellationToken);
    }
}
