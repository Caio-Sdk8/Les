using ProjetoLES.Server.DTO_s;
using ProjetoLES.Server.DTO_s.Product;

namespace ProjetoLES.Server.Interfaces.Services
{
    public interface IProductService
    {
        Task<ProductResponseDTO?> GetByUuidAsync(Guid uuid, CancellationToken cancellationToken = default);

        Task<PagedResultDTO<ProductSummaryDTO>> GetPagedAsync(
            ProductFilterDTO filter,
            CancellationToken cancellationToken = default);

        Task<IEnumerable<ProductSummaryDTO>> GetSubstitutesAsync(
            Guid productUuid,
            CancellationToken cancellationToken = default);

        Task<IEnumerable<DrugInteractionAlertDTO>> CheckDrugInteractionsAsync(
            IEnumerable<Guid> productUuids,
            CancellationToken cancellationToken = default);
    }
}
