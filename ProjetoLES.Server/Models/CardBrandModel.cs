using ProjetoLES.Server.Models.Base;

namespace ProjetoLES.Server.Models
{
    public class CardBrandModel : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;

        public ICollection<CreditCardModel> CreditCards { get; set; } = new List<CreditCardModel>();
    }
}
