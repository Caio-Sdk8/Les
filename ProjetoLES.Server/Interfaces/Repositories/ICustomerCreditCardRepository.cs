using ProjetoLES.Server.Models;

namespace ProjetoLES.Server.Interfaces.Repositories
{
    public interface ICreditCardRepository : IBaseRepository<CreditCardModel>
    {
        Task<IEnumerable<CreditCardModel>> GetByCustomerAsync(
            Guid customerUuid,
            CancellationToken cancellationToken = default);

        Task<CreditCardModel?> GetPreferredAsync(
            Guid customerUuid,
            CancellationToken cancellationToken = default);

        Task ClearPreferredAsync(int customerId, CancellationToken cancellationToken = default);
    }
}
