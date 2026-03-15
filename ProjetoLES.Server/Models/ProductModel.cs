using ProjetoLES.Server.Enums;
using ProjetoLES.Server.Models.Base;

namespace ProjetoLES.Server.Models
{
    public class ProductModel : BaseEntity
    {
        public string ProductCode { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }

        public string? ActivePrinciple { get; set; }

        public string Barcode { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }

        public decimal? HeightCm { get; set; }
        public decimal? WidthCm { get; set; }
        public decimal? DepthCm { get; set; }
        public decimal? WeightGrams { get; set; }

        public PrescriptionTypeEnum PrescriptionType { get; set; } = PrescriptionTypeEnum.None;

        public int PricingGroupId { get; set; }
        public PricingGroupModel PricingGroup { get; set; } = null!;

        public decimal SalePrice { get; set; }

        public bool IsActive { get; set; } = true;
        public InactivationCategoryEnum? InactivationCategory { get; set; }
        public string? InactivationReason { get; set; }
        public string? ActivationReason { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<ProductCategoryModel> ProductCategories { get; set; } = new List<ProductCategoryModel>();
        public ICollection<StockEntryModel> StockEntries { get; set; } = new List<StockEntryModel>();
        public ProductStockModel? Stock { get; set; }

        public ICollection<DrugInteractionModel> InteractionsAsSource { get; set; } = new List<DrugInteractionModel>();

        public ICollection<DrugInteractionModel> InteractionsAsTarget { get; set; } = new List<DrugInteractionModel>();
    }
}
