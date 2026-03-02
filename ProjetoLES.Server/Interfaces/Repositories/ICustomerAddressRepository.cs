using ProjetoLES.Server.Enums;
using ProjetoLES.Server.Models;

namespace ProjetoLES.Server.Interfaces.Repositories
{
    public interface ICustomerAddressRepository : IBaseRepository<CustomerAddressModel>
    {
        Task<IEnumerable<CustomerAddressModel>> GetByCustomerAsync(
            Guid customerUuid,
            CancellationToken cancellationToken = default);

        Task<IEnumerable<CustomerAddressModel>> GetByCustomerAndTypeAsync(
            Guid customerUuid,
            AddressTypeEnum type,
            CancellationToken cancellationToken = default);

        Task<bool> HasAddressOfTypeAsync(
            int customerId,
            AddressTypeEnum type,
            CancellationToken cancellationToken = default);
    }
}
