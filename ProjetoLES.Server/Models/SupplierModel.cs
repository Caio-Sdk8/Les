using ProjetoLES.Server.Models.Base;

namespace ProjetoLES.Server.Models
{
    public class SupplierModel : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Cnpj { get; set; } = string.Empty;
        public string? ContactEmail { get; set; }
        public string? ContactPhone { get; set; }
        public bool IsActive { get; set; } = true;

        public ICollection<StockEntryModel> StockEntries { get; set; } = new List<StockEntryModel>();
    }
}
