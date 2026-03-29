namespace ProjetoLES.Server.DTO_s.Transaction
{
    public record OrderDetailItemDTO(
        Guid ProductUuid,
        string ProductName,
        string CategoryName,
        int Quantity,
        decimal UnitPrice,
        decimal TotalPrice,
        string PrescriptionLabel);

    public record OrderDetailDTO(
        Guid TransactionUuid,
        string TransactionCode,
        string Status,
        string CreatedAt,
        string Description,
        string PaymentType,
        string AddressLabel,
        string CouponCode,
        decimal Subtotal,
        decimal Shipping,
        decimal Discount,
        decimal Total,
        string? PrescriptionFileName,
        string PrescriptionStatus,
        string? PrescriptionNote,
        IEnumerable<OrderDetailItemDTO> Items,
        IEnumerable<AfterSalesRequestDTO> AfterSalesRequests);
}
