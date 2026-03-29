using ProjetoLES.Server.Models.Base;

namespace ProjetoLES.Server.Models
{
    public class TransactionModel : BaseEntity
    {
        public int CustomerId { get; set; }
        public int? CreditCardId { get; set; }

        public decimal Amount { get; set; }
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string? MetadataJson { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public CustomerModel Customer { get; set; } = null!;
        public CreditCardModel? CreditCard { get; set; }
    }
}
