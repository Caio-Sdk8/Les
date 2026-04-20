namespace ProjetoLES.Server.DTO_s.Transaction
{
    public record ExchangeCreditEntryDTO(
        Guid TransactionUuid,
        string TransactionCode,
        decimal OriginalAmount,
        decimal RemainingAmount,
        string ApprovedAt);

    public record ExchangeCreditBalanceDTO(
        decimal AvailableCredit,
        IEnumerable<ExchangeCreditEntryDTO> Entries);
}
