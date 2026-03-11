using ProjetoLES.Server.Models;

namespace ProjetoLES.Server.Interfaces.Repositories
{
    public interface IUserRepository : IBaseRepository<UserModel>
    {
        Task<UserModel?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);
        Task<UserModel?> GetByUuidWithRolesAsync(Guid uuid, CancellationToken cancellationToken = default);
        Task<bool> ExistsByEmailAsync(string email, CancellationToken cancellationToken = default);
        Task<(IEnumerable<UserModel> Items, int TotalCount)> GetPagedAsync(string? search, bool? isActive, int page, int pageSize, CancellationToken cancellationToken = default);
    }
}
