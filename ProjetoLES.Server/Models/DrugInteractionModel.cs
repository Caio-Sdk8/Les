using ProjetoLES.Server.Models.Base;

namespace ProjetoLES.Server.Models
{

    public class DrugInteractionModel : BaseEntity
    {
        public int ProductAId { get; set; }
        public ProductModel ProductA { get; set; } = null!;

        public int ProductBId { get; set; }
        public ProductModel ProductB { get; set; } = null!;

        public string Description { get; set; } = string.Empty;

        public int SeverityLevel { get; set; } = 2;
    }
}
