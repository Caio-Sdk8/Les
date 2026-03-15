using ProjetoLES.Server.Models;

namespace ProjetoLES.Server.Interfaces.Repositories
{
    public interface ICategoryRepository : IBaseRepository<CategoryModel>
    {
        Task<IEnumerable<CategoryModel>> GetAllActiveAsync(CancellationToken cancellationToken = default);
    }
}
