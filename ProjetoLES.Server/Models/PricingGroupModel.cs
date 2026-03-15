using ProjetoLES.Server.Models.Base;

namespace ProjetoLES.Server.Models
{

    public class PricingGroupModel : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }

        public decimal ProfitMarginPercent { get; set; }

        public bool IsActive { get; set; } = true;

        public ICollection<ProductModel> Products { get; set; } = new List<ProductModel>();
    }
}
