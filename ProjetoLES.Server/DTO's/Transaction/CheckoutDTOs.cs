namespace ProjetoLES.Server.DTO_s.Transaction
{
    public record CheckoutItemDTO(
        Guid ProductUuid,
        int Quantity);

    public record CheckoutSplitPaymentDTO(
        string? FirstCardLabel,
        string? SecondCardLabel,
        decimal? FirstAmount,
        decimal? SecondAmount,
        Guid? FirstCardUuid,
        Guid? SecondCardUuid);

    public record CheckoutRequestDTO(
        IList<CheckoutItemDTO> Items,
        string PaymentType,
        string AddressLabel,
        Guid? AddressUuid,
        string CouponCode,
        string? SingleCardLabel,
        Guid? SingleCardUuid,
        CheckoutSplitPaymentDTO? SplitPayment,
        string? PrescriptionFileName,
        string? PrescriptionFileContentType,
        string? PrescriptionFileBase64);

    public record CheckoutResponseDTO(
        Guid TransactionUuid,
        string TransactionCode,
        string Status,
        decimal Subtotal,
        decimal Shipping,
        decimal Discount,
        decimal Total);
}
