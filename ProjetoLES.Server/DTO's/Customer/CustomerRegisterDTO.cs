using ProjetoLES.Server.Enums;
using System.Reflection;

namespace ProjetoLES.Server.DTO_s.Customer
{
    public record CustomerRegisterDTO(

        string Name,
        GenderEnum Gender,
        DateOnly BirthDate,
        string Cpf,
        string Email,

        PhoneTypeEnum PhoneType,
        string AreaCode,
        string PhoneNumber,

        string Password,
        string PasswordConfirmation,

        AddressRegisterDTO BillingAddress,

        AddressRegisterDTO DeliveryAddress,

        IList<CreditCardRegisterDTO>? CreditCards = null
    );
}