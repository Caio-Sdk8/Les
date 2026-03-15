using ProjetoLES.Server.Models.Base;

namespace ProjetoLES.Server.Models
{
    public class CategoryModel : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsActive { get; set; } = true;

        public ICollection<ProductCategoryModel> ProductCategories { get; set; } = new List<ProductCategoryModel>();
    }
}
