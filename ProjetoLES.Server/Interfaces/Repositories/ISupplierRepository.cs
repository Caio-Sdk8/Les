using ProjetoLES.Server.Models;

namespace ProjetoLES.Server.Interfaces.Repositories
{
    public interface ISupplierRepository : IBaseRepository<SupplierModel>
    {
        Task<IEnumerable<SupplierModel>> GetAllActiveAsync(CancellationToken cancellationToken = default);
    }
}
