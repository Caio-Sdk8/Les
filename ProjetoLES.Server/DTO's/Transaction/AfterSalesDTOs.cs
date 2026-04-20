namespace ProjetoLES.Server.DTO_s.Transaction
{
    public record AfterSalesRequestItemDTO(
        Guid ProductUuid,
        string ProductName,
        int Quantity);

    public record AfterSalesRequestDTO(
        Guid RequestUuid,
        Guid TransactionUuid,
        string TransactionCode,
        string Type,
        string Status,
        string Reason,
        string? ReviewNote,
        string? CompensationType,
        decimal? CompensationAmount,
        string RequestedAt,
        string? ReviewedAt,
        string? ReviewedBy,
        IEnumerable<AfterSalesRequestItemDTO> Items);

    public record AfterSalesRequestCreateDTO(
        string Type,
        string Reason,
        IEnumerable<AfterSalesRequestCreateItemDTO> Items);

    public record AfterSalesRequestCreateItemDTO(
        Guid ProductUuid,
        int Quantity);

    public record AfterSalesReviewDecisionDTO(
        string? Note);
}
