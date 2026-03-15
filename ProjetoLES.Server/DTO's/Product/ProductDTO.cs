using ProjetoLES.Server.Enums;

namespace ProjetoLES.Server.DTO_s.Product
{
    public record ProductResponseDTO(
        Guid Uuid,
        string ProductCode,
        string Name,
        string? Description,
        string? ActivePrinciple,
        string Barcode,
        string? ImageUrl,
        decimal? HeightCm,
        decimal? WidthCm,
        decimal? DepthCm,
        decimal? WeightGrams,
        PrescriptionTypeEnum PrescriptionType,
        decimal SalePrice,
        bool IsActive,
        string PricingGroupName,
        IEnumerable<string> Categories,
        int AvailableStock,
        int BlockedStock
    );

    public record ProductSummaryDTO(
        Guid Uuid,
        string ProductCode,
        string Name,
        string? ActivePrinciple,
        string? ImageUrl,
        decimal SalePrice,
        PrescriptionTypeEnum PrescriptionType,
        bool IsActive,
        IEnumerable<string> Categories,
        int AvailableStock
    );

    public record ProductFilterDTO(
        string? Search = null,
        string? Name = null,
        string? ActivePrinciple = null,
        string? Barcode = null,
        string? ProductCode = null,
        Guid? CategoryUuid = null,
        PrescriptionTypeEnum? PrescriptionType = null,
        bool? IsActive = null,
        bool? InStock = null,
        int Page = 1,
        int PageSize = 20
    );
}
