using ProjetoLES.Server.DTO_s.Address;
using ProjetoLES.Server.DTO_s.CreditCard;

namespace ProjetoLES.Server.DTO_s.Customer
{
    public record CustomerRegisterResponseDTO(
        Guid Uuid,
        string CustomerCode,
        string Name,
        string Email,
        IEnumerable<AddressResponseDTO> BillingAddresses,
        IEnumerable<AddressResponseDTO> DeliveryAddresses,
        IEnumerable<CreditCardResponseDTO> CreditCards
    );
}
