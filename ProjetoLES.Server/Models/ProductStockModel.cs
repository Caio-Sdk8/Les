using ProjetoLES.Server.Models.Base;

namespace ProjetoLES.Server.Models
{

    public class ProductStockModel : BaseEntity
    {
        public int ProductId { get; set; }
        public ProductModel Product { get; set; } = null!;

        public int AvailableQuantity { get; set; }

        public int BlockedQuantity { get; set; }

        public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
    }
}
