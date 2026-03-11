using ProjetoLES.Server.DTO_s.Customer;
using ProjetoLES.Server.Models;

namespace ProjetoLES.Server.Interfaces.Repositories
{
    public interface ICustomerRepository : IBaseRepository<CustomerModel>
    {
        Task<CustomerModel?> GetFullProfileAsync(Guid uuid, CancellationToken cancellationToken = default);

        Task<(IEnumerable<CustomerModel> Items, int TotalCount)> GetPagedAsync(
            CustomerFilterDTO filter,
            CancellationToken cancellationToken = default);

        Task<bool> ExistsByCpfAsync(string cpf, CancellationToken cancellationToken = default);

        Task<(IEnumerable<TransactionModel> Items, int TotalCount)> GetTransactionsAsync(
            Guid customerUuid,
            int page,
            int pageSize,
            CancellationToken cancellationToken = default);
    }
}
