using ProjetoLES.Server.Models;

namespace ProjetoLES.Server.Interfaces.Repositories
{
    public interface IRoleRepository : IBaseRepository<RoleModel>
    {
        Task<RoleModel?> GetByNameAsync(string name, CancellationToken cancellationToken = default);
        Task<IEnumerable<RoleModel>> GetActiveRolesAsync(CancellationToken cancellationToken = default);
    }
}
