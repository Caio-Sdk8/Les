using ProjetoLES.Server.DTO_s.Stock;
using ProjetoLES.Server.Models;

namespace ProjetoLES.Server.Interfaces.Repositories
{
    public interface IStockRepository : IBaseRepository<StockEntryModel>
    {
        Task<ProductStockModel?> GetStockByProductIdAsync(int productId, CancellationToken cancellationToken = default);

        Task<(IEnumerable<ProductStockModel> Items, int TotalCount)> GetStockPagedAsync(
            StockFilterDTO filter,
            CancellationToken cancellationToken = default);

        Task<IEnumerable<StockEntryModel>> GetEntriesByProductAsync(
            Guid productUuid,
            CancellationToken cancellationToken = default);
    }
}
