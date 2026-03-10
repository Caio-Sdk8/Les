using Microsoft.EntityFrameworkCore;
using ProjetoLES.Server.Data;
using ProjetoLES.Server.Interfaces.Repositories;
using ProjetoLES.Server.Models;

namespace ProjetoLES.Server.Repositories
{
    public class RoleRepository : BaseRepository<RoleModel>, IRoleRepository
    {
        public RoleRepository(AppDbContext context) : base(context) { }

        public async Task<RoleModel?> GetByNameAsync(string name, CancellationToken cancellationToken = default)
            => await _dbSet.AsNoTracking().FirstOrDefaultAsync(r => r.Name == name, cancellationToken);

        public async Task<IEnumerable<RoleModel>> GetActiveRolesAsync(CancellationToken cancellationToken = default)
            => await _dbSet.AsNoTracking().Where(r => r.IsActive).OrderBy(r => r.Name).ToListAsync(cancellationToken);
    }
}
