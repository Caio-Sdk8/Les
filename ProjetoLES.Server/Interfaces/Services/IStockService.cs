using ProjetoLES.Server.DTO_s;
using ProjetoLES.Server.DTO_s.Stock;

namespace ProjetoLES.Server.Interfaces.Services
{
    public interface IStockService
    {
        Task<StockEntryResponseDTO> RegisterEntryAsync(
            StockEntryCreateDTO dto,
            CancellationToken cancellationToken = default);

        Task<ProductStockResponseDTO?> GetStockByProductAsync(
            Guid productUuid,
            CancellationToken cancellationToken = default);

        Task<PagedResultDTO<StockSummaryDTO>> GetStockPagedAsync(
            StockFilterDTO filter,
            CancellationToken cancellationToken = default);

        Task<IEnumerable<StockEntryResponseDTO>> GetEntriesByProductAsync(
            Guid productUuid,
            CancellationToken cancellationToken = default);
    }
}
