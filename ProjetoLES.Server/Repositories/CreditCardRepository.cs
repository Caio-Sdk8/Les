using Microsoft.EntityFrameworkCore;
using ProjetoLES.Server.Data;
using ProjetoLES.Server.Interfaces.Repositories;
using ProjetoLES.Server.Models;

namespace ProjetoLES.Server.Repositories
{
    public class CreditCardRepository : BaseRepository<CreditCardModel>, ICreditCardRepository
    {
        public CreditCardRepository(AppDbContext context) : base(context) { }

        public async Task<IEnumerable<CreditCardModel>> GetByCustomerAsync(
            Guid customerUuid, CancellationToken cancellationToken = default)
            => await _dbSet
                .AsNoTracking()
                .Include(c => c.CardBrand)
                .Where(c => c.Customer.Uuid == customerUuid && c.IsActive)
                .ToListAsync(cancellationToken);

        public async Task<CreditCardModel?> GetPreferredAsync(
            Guid customerUuid, CancellationToken cancellationToken = default)
            => await _dbSet
                .AsNoTracking()
                .Include(c => c.CardBrand)
                .FirstOrDefaultAsync(c => c.Customer.Uuid == customerUuid && c.IsPreferred && c.IsActive, cancellationToken);

        public async Task ClearPreferredAsync(
            int customerId, CancellationToken cancellationToken = default)
        {
            var cards = await _dbSet
                .Where(c => c.CustomerId == customerId && c.IsPreferred)
                .ToListAsync(cancellationToken);

            foreach (var card in cards)
                card.IsPreferred = false;

            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
