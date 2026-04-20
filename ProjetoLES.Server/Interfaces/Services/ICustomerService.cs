using ProjetoLES.Server.DTO_s;
using ProjetoLES.Server.DTO_s.Address;
using ProjetoLES.Server.DTO_s.CreditCard;
using ProjetoLES.Server.DTO_s.Customer;
using ProjetoLES.Server.DTO_s.Phone;
using ProjetoLES.Server.Models;

namespace ProjetoLES.Server.Interfaces.Services
{
    public interface ICustomerService
    {
        Task<CustomerRegisterResponseDTO> RegisterAsync(
            CustomerRegisterDTO dto,
            CancellationToken cancellationToken = default);

        Task<CustomerResponseDTO> CreateAsync(
            CustomerCreateDTO dto,
            CancellationToken cancellationToken = default);

        Task<CustomerResponseDTO> UpdateAsync(
            Guid uuid,
            CustomerUpdateDTO dto,
            CancellationToken cancellationToken = default);

        Task<CustomerResponseDTO?> GetByUuidAsync(
            Guid uuid,
            CancellationToken cancellationToken = default);

        Task<PagedResultDTO<CustomerSummaryDTO>> GetPagedAsync(
            CustomerFilterDTO filter,
            CancellationToken cancellationToken = default);

        Task ToggleActiveAsync(Guid uuid, CancellationToken cancellationToken = default);

        Task DeleteAsync(Guid uuid, CancellationToken cancellationToken = default);

        Task ChangePasswordAsync(
            Guid uuid,
            CustomerChangePasswordDTO dto,
            CancellationToken cancellationToken = default);

        Task<AddressResponseDTO> AddAddressAsync(
            Guid customerUuid,
            AddressCreateDTO dto,
            CancellationToken cancellationToken = default);

        Task<AddressResponseDTO> UpdateAddressAsync(
            Guid customerUuid,
            Guid addressUuid,
            AddressUpdateDTO dto,
            CancellationToken cancellationToken = default);

        Task<IEnumerable<AddressResponseDTO>> GetAddressesAsync(
            Guid customerUuid,
            CancellationToken cancellationToken = default);

        Task<IEnumerable<AddressResponseDTO>> GetMyAddressesAsync(
            Guid userUuid,
            CancellationToken cancellationToken = default);

        Task<PhoneResponseDTO> AddPhoneAsync(
            Guid customerUuid,
            PhoneCreateDTO dto,
            CancellationToken cancellationToken = default);

        Task<CreditCardResponseDTO> AddCreditCardAsync(
            Guid customerUuid,
            CreditCardCreateDTO dto,
            CancellationToken cancellationToken = default);

        Task<CreditCardResponseDTO> AddMyCreditCardAsync(
            Guid userUuid,
            CreditCardCreateDTO dto,
            CancellationToken cancellationToken = default);

        Task SetPreferredCreditCardAsync(
            Guid customerUuid,
            Guid creditCardUuid,
            CancellationToken cancellationToken = default);

        Task<IEnumerable<CreditCardResponseDTO>> GetCreditCardsAsync(
            Guid customerUuid,
            CancellationToken cancellationToken = default);

        Task<IEnumerable<CreditCardResponseDTO>> GetMyCreditCardsAsync(
            Guid userUuid,
            CancellationToken cancellationToken = default);

        Task<PagedResultDTO<TransactionModel>> GetTransactionsAsync(
            Guid customerUuid,
            int page,
            int pageSize,
            CancellationToken cancellationToken = default);
    }

}
