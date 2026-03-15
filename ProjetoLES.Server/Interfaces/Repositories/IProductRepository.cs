using ProjetoLES.Server.DTO_s.Product;
using ProjetoLES.Server.Models;

namespace ProjetoLES.Server.Interfaces.Repositories
{
    public interface IProductRepository : IBaseRepository<ProductModel>
    {
        Task<ProductModel?> GetFullAsync(Guid uuid, CancellationToken cancellationToken = default);

        Task<(IEnumerable<ProductModel> Items, int TotalCount)> GetPagedAsync(
            ProductFilterDTO filter,
            CancellationToken cancellationToken = default);

        Task<bool> ExistsByBarcodeAsync(string barcode, CancellationToken cancellationToken = default);
        Task<bool> ExistsByProductCodeAsync(string productCode, CancellationToken cancellationToken = default);

        Task<IEnumerable<ProductModel>> GetByActivePrincipleAsync(
            string activePrinciple,
            CancellationToken cancellationToken = default);
    }
}
