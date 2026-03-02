using ProjetoLES.Server.DTO_s.Address;
using ProjetoLES.Server.DTO_s.CreditCard;

namespace ProjetoLES.Server.DTO_s.Customer
{
    public record CustomerRegisterResponseDTO(
        Guid Uuid,
        string CustomerCode,
        string Name,
        string Email,
        AddressResponseDTO BillingAddress,
        AddressResponseDTO DeliveryAddress,
        IEnumerable<CreditCardResponseDTO> CreditCards
    );
}
