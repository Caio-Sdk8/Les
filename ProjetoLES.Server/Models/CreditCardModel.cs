using ProjetoLES.Server.Models.Base;

namespace ProjetoLES.Server.Models
{
    public class CreditCardModel : BaseEntity
    {
        public int CustomerId { get; set; }
        public int CardBrandId { get; set; }

        public string CardNumber { get; set; } = string.Empty;

        public string PrintedName { get; set; } = string.Empty;

        public string SecurityCode { get; set; } = string.Empty;

        public DateOnly ExpirationDate { get; set; }

        public bool IsPreferred { get; set; } = false;

        public bool IsActive { get; set; } = true;

        public CustomerModel Customer { get; set; } = null!;
        public CardBrandModel CardBrand { get; set; } = null!;
    }
}
