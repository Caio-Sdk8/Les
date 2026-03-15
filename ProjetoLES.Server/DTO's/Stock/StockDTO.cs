namespace ProjetoLES.Server.DTO_s.Stock
{
    public record StockEntryCreateDTO(
        Guid ProductUuid,
        Guid SupplierUuid,

        int Quantity,

        decimal CostValue,

        DateOnly EntryDate
    );

    public record StockEntryResponseDTO(
        Guid Uuid,
        Guid ProductUuid,
        string ProductName,
        Guid SupplierUuid,
        string SupplierName,
        int Quantity,
        decimal CostValue,
        DateOnly EntryDate,
        DateTime CreatedAt
    );

    public record ProductStockResponseDTO(
        Guid ProductUuid,
        string ProductName,
        int AvailableQuantity,
        int BlockedQuantity,
        int TotalQuantity,
        DateTime LastUpdated
    );

    public record StockSummaryDTO(
        Guid ProductUuid,
        string ProductCode,
        string ProductName,
        decimal SalePrice,
        int AvailableQuantity,
        int BlockedQuantity
    );

    public record StockFilterDTO(
        string? Search = null,
        string? ProductCode = null,
        bool? InStock = null,
        Guid? CategoryUuid = null,
        int Page = 1,
        int PageSize = 20
    );
}
