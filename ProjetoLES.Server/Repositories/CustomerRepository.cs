using Microsoft.EntityFrameworkCore;
using ProjetoLES.Server.Data;
using ProjetoLES.Server.DTO_s.Customer;
using ProjetoLES.Server.Interfaces.Repositories;
using ProjetoLES.Server.Models;

namespace ProjetoLES.Server.Repositories
{
    public class CustomerRepository : BaseRepository<CustomerModel>, ICustomerRepository
    {
        public CustomerRepository(AppDbContext context) : base(context) { }

        public async Task<CustomerModel?> GetFullProfileAsync(Guid uuid, CancellationToken cancellationToken = default)
            => await _dbSet
                .AsNoTracking()
                .Include(c => c.User)
                .Include(c => c.Phones)
                .Include(c => c.Addresses)
                .Include(c => c.CreditCards)
                    .ThenInclude(cc => cc.CardBrand)
                .FirstOrDefaultAsync(c => c.Uuid == uuid, cancellationToken);

        public async Task<(IEnumerable<CustomerModel> Items, int TotalCount)> GetPagedAsync(
            CustomerFilterDTO filter,
            CancellationToken cancellationToken = default)
        {
            var query = _dbSet
                .AsNoTracking()
                .Include(c => c.User)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(filter.Search))
            {
                var term = filter.Search.Trim();
                query = query.Where(c =>
                    c.Name.Contains(term) ||
                    c.Cpf.Contains(term) ||
                    c.CustomerCode.Contains(term) ||
                    (c.User != null && c.User.Email.Contains(term)));
            }

            if (!string.IsNullOrWhiteSpace(filter.Name))
                query = query.Where(c => c.Name.Contains(filter.Name));

            // Email agora vive no UserModel vinculado
            if (!string.IsNullOrWhiteSpace(filter.Email))
                query = query.Where(c => c.User != null && c.User.Email == filter.Email);

            if (!string.IsNullOrWhiteSpace(filter.Cpf))
                query = query.Where(c => c.Cpf == filter.Cpf);

            if (!string.IsNullOrWhiteSpace(filter.CustomerCode))
                query = query.Where(c => c.CustomerCode == filter.CustomerCode);

            if (filter.IsActive.HasValue)
                query = query.Where(c => c.IsActive == filter.IsActive.Value);

            var totalCount = await query.CountAsync(cancellationToken);

            var items = await query
                .OrderBy(c => c.Name)
                .Skip((filter.Page - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync(cancellationToken);

            return (items, totalCount);
        }

        public async Task<bool> ExistsByCpfAsync(string cpf, CancellationToken cancellationToken = default)
            => await _dbSet.AnyAsync(c => c.Cpf == cpf, cancellationToken);

        public async Task<(IEnumerable<TransactionModel> Items, int TotalCount)> GetTransactionsAsync(
            Guid customerUuid,
            int page,
            int pageSize,
            CancellationToken cancellationToken = default)
        {
            var query = _context.Set<TransactionModel>()
                .AsNoTracking()
                .Where(t => t.Customer.Uuid == customerUuid)
                .OrderByDescending(t => t.CreatedAt);

            var totalCount = await query.CountAsync(cancellationToken);

            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(cancellationToken);

            return (items, totalCount);
        }
    }
}
