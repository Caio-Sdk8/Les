using Microsoft.EntityFrameworkCore;
using ProjetoLES.Server.Data;
using ProjetoLES.Server.DTO_s.Stock;
using ProjetoLES.Server.Interfaces.Repositories;
using ProjetoLES.Server.Models;

namespace ProjetoLES.Server.Repositories
{
    public class StockRepository : BaseRepository<StockEntryModel>, IStockRepository
    {
        public StockRepository(AppDbContext context) : base(context) { }

        public async Task<ProductStockModel?> GetStockByProductIdAsync(
            int productId,
            CancellationToken cancellationToken = default)
            => await _context.Set<ProductStockModel>()
                .AsNoTracking()
                .Include(s => s.Product)
                .FirstOrDefaultAsync(s => s.ProductId == productId, cancellationToken);

        public async Task<(IEnumerable<ProductStockModel> Items, int TotalCount)> GetStockPagedAsync(
            StockFilterDTO filter,
            CancellationToken cancellationToken = default)
        {
            var query = _context.Set<ProductStockModel>()
                .AsNoTracking()
                .Include(s => s.Product)
                    .ThenInclude(p => p.ProductCategories)
                        .ThenInclude(pc => pc.Category)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(filter.Search))
            {
                var term = filter.Search.Trim();
                query = query.Where(s =>
                    s.Product.Name.Contains(term) ||
                    s.Product.ProductCode.Contains(term));
            }

            if (!string.IsNullOrWhiteSpace(filter.ProductCode))
                query = query.Where(s => s.Product.ProductCode == filter.ProductCode);

            if (filter.InStock == true)
                query = query.Where(s => s.AvailableQuantity > 0);
            else if (filter.InStock == false)
                query = query.Where(s => s.AvailableQuantity == 0);

            if (filter.CategoryUuid.HasValue)
                query = query.Where(s => s.Product.ProductCategories
                    .Any(pc => pc.Category.Uuid == filter.CategoryUuid.Value));

            var totalCount = await query.CountAsync(cancellationToken);
            var items = await query
                .OrderBy(s => s.Product.Name)
                .Skip((filter.Page - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync(cancellationToken);

            return (items, totalCount);
        }

        public async Task<IEnumerable<StockEntryModel>> GetEntriesByProductAsync(
            Guid productUuid,
            CancellationToken cancellationToken = default)
            => await _dbSet
                .AsNoTracking()
                .Include(e => e.Product)
                .Include(e => e.Supplier)
                .Where(e => e.Product.Uuid == productUuid)
                .OrderByDescending(e => e.EntryDate)
                .ToListAsync(cancellationToken);
    }
}
