using Microsoft.EntityFrameworkCore;
using ProjetoLES.Server.Data;
using ProjetoLES.Server.Interfaces.Repositories;
using ProjetoLES.Server.Models;

namespace ProjetoLES.Server.Repositories
{
    public class UserRepository : BaseRepository<UserModel>, IUserRepository
    {
        public UserRepository(AppDbContext context) : base(context) { }

        public async Task<UserModel?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
            => await _dbSet
                .Include(u => u.UserRoles).ThenInclude(ur => ur.Role)
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Email == email, cancellationToken);

        public async Task<UserModel?> GetByUuidWithRolesAsync(Guid uuid, CancellationToken cancellationToken = default)
            => await _dbSet
                .Include(u => u.UserRoles).ThenInclude(ur => ur.Role)
                .Include(u => u.Customer)
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Uuid == uuid, cancellationToken);

        public async Task<bool> ExistsByEmailAsync(string email, CancellationToken cancellationToken = default)
            => await _dbSet.AnyAsync(u => u.Email == email, cancellationToken);

        public async Task<(IEnumerable<UserModel> Items, int TotalCount)> GetPagedAsync(
            string? search, bool? isActive, int page, int pageSize, CancellationToken cancellationToken = default)
        {
            var query = _dbSet
                .Include(u => u.UserRoles).ThenInclude(ur => ur.Role)
                .AsNoTracking()
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
                query = query.Where(u => u.Email.Contains(search));

            if (isActive.HasValue)
                query = query.Where(u => u.IsActive == isActive.Value);

            var totalCount = await query.CountAsync(cancellationToken);
            var items = await query
                .OrderBy(u => u.Email)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(cancellationToken);

            return (items, totalCount);
        }
    }
}
