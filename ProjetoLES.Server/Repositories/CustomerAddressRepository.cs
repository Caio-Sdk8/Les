using Microsoft.EntityFrameworkCore;
using ProjetoLES.Server.Data;
using ProjetoLES.Server.Enums;
using ProjetoLES.Server.Interfaces.Repositories;
using ProjetoLES.Server.Models;

namespace ProjetoLES.Server.Repositories
{
    public class CustomerAddressRepository : BaseRepository<CustomerAddressModel>, ICustomerAddressRepository
    {
        public CustomerAddressRepository(AppDbContext context) : base(context) { }

        public async Task<IEnumerable<CustomerAddressModel>> GetByCustomerAsync(
            Guid customerUuid, CancellationToken cancellationToken = default)
            => await _dbSet
                .AsNoTracking()
                .Where(a => a.Customer.Uuid == customerUuid)
                .ToListAsync(cancellationToken);

        public async Task<IEnumerable<CustomerAddressModel>> GetByCustomerAndTypeAsync(
            Guid customerUuid, AddressTypeEnum type, CancellationToken cancellationToken = default)
            => await _dbSet
                .AsNoTracking()
                .Where(a => a.Customer.Uuid == customerUuid && a.AddressType == type)
                .ToListAsync(cancellationToken);

        public async Task<bool> HasAddressOfTypeAsync(
            int customerId, AddressTypeEnum type, CancellationToken cancellationToken = default)
            => await _dbSet.AnyAsync(a => a.CustomerId == customerId && a.AddressType == type, cancellationToken);
    }
}
