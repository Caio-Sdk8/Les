namespace ProjetoLES.Server.Models
{
    public class ProductCategoryModel
    {
        public int ProductId { get; set; }
        public ProductModel Product { get; set; } = null!;

        public int CategoryId { get; set; }
        public CategoryModel Category { get; set; } = null!;
    }
}
