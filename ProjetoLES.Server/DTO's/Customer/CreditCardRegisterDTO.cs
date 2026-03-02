namespace ProjetoLES.Server.DTO_s.Customer
{
    public record CreditCardRegisterDTO
     (
        string CardBrandName,
        string CardNumber,
        string PrintedName,
        string SecurityCode,
        DateOnly ExpirationDate,
        bool IsPreferred
    );
}
