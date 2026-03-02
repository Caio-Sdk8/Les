namespace ProjetoLES.Server.DTO_s.CreditCard
{
    public record CreditCardCreateDTO(
        Guid CardBrandUuid,
        string CardNumber,
        string PrintedName,
        string SecurityCode,
        DateOnly ExpirationDate,
        bool IsPreferred
    );

    public record CreditCardResponseDTO(
        Guid Uuid,
        string CardBrandName,
        string MaskedCardNumber,
        string PrintedName,
        DateOnly ExpirationDate,
        bool IsPreferred,
        bool IsActive
    );
}
