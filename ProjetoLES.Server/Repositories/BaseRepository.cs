using Microsoft.EntityFrameworkCore;
using ProjetoLES.Server.Data;
using ProjetoLES.Server.Interfaces.Repositories;
using ProjetoLES.Server.Models.Base;

namespace ProjetoLES.Server.Repositories
{
    public abstract class BaseRepository<TEntity> : IBaseRepository<TEntity>
        where TEntity : BaseEntity
    {
        protected readonly AppDbContext _context;
        protected readonly DbSet<TEntity> _dbSet;

        protected BaseRepository(AppDbContext context)
        {
            _context = context;
            _dbSet = context.Set<TEntity>();
        }

        public virtual async Task<TEntity?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
            => await _dbSet.AsNoTracking().FirstOrDefaultAsync(e => e.Id == id, cancellationToken);

        public virtual async Task<TEntity?> GetByUuidAsync(Guid uuid, CancellationToken cancellationToken = default)
            => await _dbSet.AsNoTracking().FirstOrDefaultAsync(e => e.Uuid == uuid, cancellationToken);

        public virtual async Task<IEnumerable<TEntity>> GetAllAsync(CancellationToken cancellationToken = default)
            => await _dbSet.AsNoTracking().ToListAsync(cancellationToken);

        public virtual async Task AddAsync(TEntity entity, CancellationToken cancellationToken = default)
            => await _dbSet.AddAsync(entity, cancellationToken);

        public virtual void Update(TEntity entity)
            => _dbSet.Update(entity);

        /// <summary>
        /// Soft-delete: marca a entidade como excluída sem remover do banco.
        /// </summary>
        public virtual void Remove(TEntity entity)
        {
            entity.IsDeleted = true;
            entity.DeletedAt = DateTime.UtcNow;
            _dbSet.Update(entity);
        }

        public virtual async Task<bool> ExistsAsync(Guid uuid, CancellationToken cancellationToken = default)
            => await _dbSet.AnyAsync(e => e.Uuid == uuid, cancellationToken);

        public virtual async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
            => await _context.SaveChangesAsync(cancellationToken);
    }
}
