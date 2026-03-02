using ProjetoLES.Server.Models.Base;

namespace ProjetoLES.Server.Interfaces.Repositories
{
    public interface IBaseRepository<TEntity> where TEntity : BaseEntity
    {
        Task<TEntity?> GetByIdAsync(int id, CancellationToken cancellationToken = default);

        Task<TEntity?> GetByUuidAsync(Guid uuid, CancellationToken cancellationToken = default);

        Task<IEnumerable<TEntity>> GetAllAsync(CancellationToken cancellationToken = default);

        Task AddAsync(TEntity entity, CancellationToken cancellationToken = default);

        void Update(TEntity entity);

        void Remove(TEntity entity);

        Task<bool> ExistsAsync(Guid uuid, CancellationToken cancellationToken = default);

        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
