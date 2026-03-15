using ProjetoLES.Server.Models.Base;

namespace ProjetoLES.Server.Models
{

    public class StockEntryModel : BaseEntity
    {
        public int ProductId { get; set; }
        public ProductModel Product { get; set; } = null!;

        public int SupplierId { get; set; }
        public SupplierModel Supplier { get; set; } = null!;

        public int Quantity { get; set; }

        public decimal CostValue { get; set; }

        public DateOnly EntryDate { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
