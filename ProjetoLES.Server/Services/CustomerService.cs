using Microsoft.EntityFrameworkCore;
using ProjetoLES.Server.Data;
using ProjetoLES.Server.DTO_s;
using ProjetoLES.Server.DTO_s.Address;
using ProjetoLES.Server.DTO_s.CreditCard;
using ProjetoLES.Server.DTO_s.Customer;
using ProjetoLES.Server.DTO_s.Phone;
using ProjetoLES.Server.Enums;
using ProjetoLES.Server.Interfaces.Repositories;
using ProjetoLES.Server.Interfaces.Services;
using ProjetoLES.Server.Models;

namespace ProjetoLES.Server.Services
{
    public class CustomerService : ICustomerService
    {
        private readonly ICustomerRepository _customerRepository;
        private readonly ICustomerAddressRepository _addressRepository;
        private readonly ICreditCardRepository _creditCardRepository;
        private readonly AppDbContext _context;

        public CustomerService(
            ICustomerRepository customerRepository,
            ICustomerAddressRepository addressRepository,
            ICreditCardRepository creditCardRepository,
            AppDbContext context)
        {
            _customerRepository = customerRepository;
            _addressRepository = addressRepository;
            _creditCardRepository = creditCardRepository;
            _context = context;
        }


        public async Task<CustomerRegisterResponseDTO> RegisterAsync(
        CustomerRegisterDTO DTO,
        CancellationToken cancellationToken = default)
        {

            if (DTO.Password != DTO.PasswordConfirmation)
                throw new InvalidOperationException("As senhas não conferem.");

            if (await _customerRepository.ExistsByCpfAsync(DTO.Cpf, cancellationToken))
                throw new InvalidOperationException("CPF já cadastrado.");

            if (await _customerRepository.ExistsByEmailAsync(DTO.Email, cancellationToken))
                throw new InvalidOperationException("E-mail já cadastrado.");

            var cards = DTO.CreditCards ?? new List<CreditCardRegisterDTO>();

            if (cards.Any())
            {
                var preferredCount = cards.Count(c => c.IsPreferred);
                if (preferredCount == 0)
                    throw new InvalidOperationException("Pelo menos um cartão deve ser definido como preferencial.");
                if (preferredCount > 1)
                    throw new InvalidOperationException("Apenas um cartão pode ser preferencial.");
            }

            await using var transaction = await _context.Database.BeginTransactionAsync(cancellationToken);

            try
            {

                var customer = new CustomerModel
                {
                    CustomerCode = GenerateCustomerCode(),
                    Name = DTO.Name,
                    Gender = DTO.Gender,
                    BirthDate = DTO.BirthDate,
                    Cpf = DTO.Cpf,
                    Email = DTO.Email,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(DTO.Password),
                    IsActive = true,
                    Ranking = 0,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                await _customerRepository.AddAsync(customer, cancellationToken);
                await _customerRepository.SaveChangesAsync(cancellationToken);

                var phone = new CustomerPhoneModel
                {
                    CustomerId = customer.Id,
                    PhoneType = DTO.PhoneType,
                    AreaCode = DTO.AreaCode,
                    Number = DTO.PhoneNumber,
                    IsMain = true
                };
                await _context.Set<CustomerPhoneModel>().AddAsync(phone, cancellationToken);

                var billingAddress = BuildAddress(
                    customer.Id, AddressTypeEnum.Billing, DTO.BillingAddress,
                    DTO.BillingAddress.Label ?? "Endereço de cobrança");

                var deliveryAddress = BuildAddress(
                    customer.Id, AddressTypeEnum.Delivery, DTO.DeliveryAddress,
                    DTO.DeliveryAddress.Label ?? "Endereço de entrega");

                await _context.Set<CustomerAddressModel>()
                    .AddRangeAsync(new[] { billingAddress, deliveryAddress }, cancellationToken);

                var createdCards = new List<CreditCardModel>();

                foreach (var cardDTO in cards)
                {
                    var brand = await _context.Set<CardBrandModel>()
                        .FirstOrDefaultAsync(b => b.Name == cardDTO.CardBrandName && b.IsActive, cancellationToken)
                        ?? throw new InvalidOperationException(
                            $"Bandeira '{cardDTO.CardBrandName}' não encontrada ou inativa no sistema.");

                    var card = new CreditCardModel
                    {
                        CustomerId = customer.Id,
                        CardBrandId = brand.Id,
                        CardNumber = cardDTO.CardNumber,
                        PrintedName = cardDTO.PrintedName,
                        SecurityCode = BCrypt.Net.BCrypt.HashPassword(cardDTO.SecurityCode),
                        ExpirationDate = cardDTO.ExpirationDate,
                        IsPreferred = cardDTO.IsPreferred,
                        IsActive = true
                    };

                    createdCards.Add(card);
                }

                if (createdCards.Any())
                    await _context.Set<CreditCardModel>().AddRangeAsync(createdCards, cancellationToken);

                await _context.SaveChangesAsync(cancellationToken);
                await transaction.CommitAsync(cancellationToken);

                var cardResponses = createdCards.Select(c => new CreditCardResponseDTO(
                    c.Uuid,
                    cards.First(d => d.CardNumber == c.CardNumber).CardBrandName,
                    MaskCardNumber(c.CardNumber),
                    c.PrintedName,
                    c.ExpirationDate,
                    c.IsPreferred,
                    c.IsActive));

                return new CustomerRegisterResponseDTO(
                    customer.Uuid,
                    customer.CustomerCode,
                    customer.Name,
                    customer.Email,
                    MapToAddressDTO(billingAddress),
                    MapToAddressDTO(deliveryAddress),
                    cardResponses);
            }
            catch
            {
                await transaction.RollbackAsync(cancellationToken);
                throw;
            }
        }

        public async Task<CustomerResponseDTO> CreateAsync(
            CustomerCreateDTO DTO, CancellationToken cancellationToken = default)
        {
            if (DTO.Password != DTO.PasswordConfirmation)
                throw new InvalidOperationException("As senhas não conferem.");
            if (await _customerRepository.ExistsByCpfAsync(DTO.Cpf, cancellationToken))
                throw new InvalidOperationException("CPF já cadastrado.");
            if (await _customerRepository.ExistsByEmailAsync(DTO.Email, cancellationToken))
                throw new InvalidOperationException("E-mail já cadastrado.");

            var customer = new CustomerModel
            {
                CustomerCode = GenerateCustomerCode(),
                Name = DTO.Name,
                Gender = DTO.Gender,
                BirthDate = DTO.BirthDate,
                Cpf = DTO.Cpf,
                Email = DTO.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(DTO.Password),
                IsActive = true,
                Ranking = 0,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            await _customerRepository.AddAsync(customer, cancellationToken);
            await _customerRepository.SaveChangesAsync(cancellationToken);
            return MapToResponseDTO(customer);
        }

        public async Task<CustomerResponseDTO> UpdateAsync(
            Guid uuid, CustomerUpdateDTO DTO, CancellationToken cancellationToken = default)
        {
            var customer = await GetTrackedAsync(uuid, cancellationToken);
            customer.Name = DTO.Name;
            customer.Gender = DTO.Gender;
            customer.BirthDate = DTO.BirthDate;
            customer.Email = DTO.Email;
            customer.UpdatedAt = DateTime.UtcNow;
            _customerRepository.Update(customer);
            await _customerRepository.SaveChangesAsync(cancellationToken);
            return MapToResponseDTO(customer);
        }

        public async Task ChangePasswordAsync(
            Guid uuid, CustomerChangePasswordDTO DTO, CancellationToken cancellationToken = default)
        {
            var customer = await GetTrackedAsync(uuid, cancellationToken);
            if (!BCrypt.Net.BCrypt.Verify(DTO.CurrentPassword, customer.PasswordHash))
                throw new UnauthorizedAccessException("Senha atual incorreta.");
            if (DTO.NewPassword != DTO.NewPasswordConfirmation)
                throw new InvalidOperationException("As senhas não conferem.");
            customer.PasswordHash = BCrypt.Net.BCrypt.HashPassword(DTO.NewPassword);
            customer.UpdatedAt = DateTime.UtcNow;
            _customerRepository.Update(customer);
            await _customerRepository.SaveChangesAsync(cancellationToken);
        }

        public async Task DeactivateAsync(Guid uuid, CancellationToken cancellationToken = default)
        {
            var customer = await GetTrackedAsync(uuid, cancellationToken);
            customer.IsActive = false;
            customer.UpdatedAt = DateTime.UtcNow;
            _customerRepository.Update(customer);
            await _customerRepository.SaveChangesAsync(cancellationToken);
        }

        public async Task<CustomerResponseDTO?> GetByUuidAsync(
            Guid uuid, CancellationToken cancellationToken = default)
        {
            var c = await _customerRepository.GetByUuidAsync(uuid, cancellationToken);
            return c is null ? null : MapToResponseDTO(c);
        }

        public async Task<PagedResultDTO<CustomerSummaryDTO>> GetPagedAsync(
            CustomerFilterDTO filter, CancellationToken cancellationToken = default)
        {
            var (items, totalCount) = await _customerRepository.GetPagedAsync(filter, cancellationToken);
            var DTOs = items.Select(c => new CustomerSummaryDTO(
                c.Uuid, c.CustomerCode, c.Name, c.Email, c.Cpf, c.IsActive, c.Ranking));
            return new PagedResultDTO<CustomerSummaryDTO>(DTOs, totalCount, filter.Page, filter.PageSize);
        }

        public async Task<AddressResponseDTO> AddAddressAsync(
            Guid customerUuid, AddressCreateDTO DTO, CancellationToken cancellationToken = default)
        {
            var customer = await GetTrackedAsync(customerUuid, cancellationToken);
            var address = new CustomerAddressModel
            {
                CustomerId = customer.Id,
                AddressType = DTO.AddressType,
                Label = DTO.Label,
                ResidenceType = DTO.ResidenceType,
                StreetType = DTO.StreetType,
                Street = DTO.Street,
                Number = DTO.Number,
                Neighborhood = DTO.Neighborhood,
                ZipCode = DTO.ZipCode,
                City = DTO.City,
                State = DTO.State,
                Country = DTO.Country,
                Observations = DTO.Observations,
                IsActive = true
            };
            await _addressRepository.AddAsync(address, cancellationToken);
            await _addressRepository.SaveChangesAsync(cancellationToken);
            return MapToAddressDTO(address);
        }

        public async Task<AddressResponseDTO> UpdateAddressAsync(
            Guid customerUuid, Guid addressUuid, AddressUpdateDTO DTO, CancellationToken cancellationToken = default)
        {
            var addresses = await _addressRepository.GetByCustomerAsync(customerUuid, cancellationToken);
            var match = addresses.FirstOrDefault(a => a.Uuid == addressUuid)
                ?? throw new KeyNotFoundException("Endereço não encontrado para este cliente.");
            var tracked = await _addressRepository.GetByIdAsync(match.Id, cancellationToken)
                ?? throw new KeyNotFoundException("Endereço não encontrado.");
            tracked.AddressType = DTO.AddressType;
            tracked.Label = DTO.Label;
            tracked.ResidenceType = DTO.ResidenceType;
            tracked.StreetType = DTO.StreetType;
            tracked.Street = DTO.Street;
            tracked.Number = DTO.Number;
            tracked.Neighborhood = DTO.Neighborhood;
            tracked.ZipCode = DTO.ZipCode;
            tracked.City = DTO.City;
            tracked.State = DTO.State;
            tracked.Country = DTO.Country;
            tracked.Observations = DTO.Observations;
            _addressRepository.Update(tracked);
            await _addressRepository.SaveChangesAsync(cancellationToken);
            return MapToAddressDTO(tracked);
        }

        public async Task<IEnumerable<AddressResponseDTO>> GetAddressesAsync(
            Guid customerUuid, CancellationToken cancellationToken = default)
        {
            var addresses = await _addressRepository.GetByCustomerAsync(customerUuid, cancellationToken);
            return addresses.Select(MapToAddressDTO);
        }

        public async Task<PhoneResponseDTO> AddPhoneAsync(
            Guid customerUuid, PhoneCreateDTO DTO, CancellationToken cancellationToken = default)
        {
            var customer = await GetTrackedAsync(customerUuid, cancellationToken);
            var phone = new CustomerPhoneModel
            {
                CustomerId = customer.Id,
                PhoneType = DTO.PhoneType,
                AreaCode = DTO.AreaCode,
                Number = DTO.Number,
                IsMain = DTO.IsMain
            };
            await _context.Set<CustomerPhoneModel>().AddAsync(phone, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
            return new PhoneResponseDTO(phone.Uuid, phone.PhoneType, phone.AreaCode, phone.Number, phone.IsMain);
        }

        public async Task<CreditCardResponseDTO> AddCreditCardAsync(
            Guid customerUuid, CreditCardCreateDTO DTO, CancellationToken cancellationToken = default)
        {
            var customer = await GetTrackedAsync(customerUuid, cancellationToken);

            var brand = await _context.Set<CardBrandModel>()
                .FirstOrDefaultAsync(b => b.Uuid == DTO.CardBrandUuid && b.IsActive, cancellationToken)
                ?? throw new InvalidOperationException("Bandeira não encontrada ou inativa.");

            if (DTO.IsPreferred)
                await _creditCardRepository.ClearPreferredAsync(customer.Id, cancellationToken);

            var card = new CreditCardModel
            {
                CustomerId = customer.Id,
                CardBrandId = brand.Id,
                CardNumber = DTO.CardNumber,
                PrintedName = DTO.PrintedName,
                SecurityCode = BCrypt.Net.BCrypt.HashPassword(DTO.SecurityCode),
                ExpirationDate = DTO.ExpirationDate,
                IsPreferred = DTO.IsPreferred,
                IsActive = true
            };
            await _creditCardRepository.AddAsync(card, cancellationToken);
            await _creditCardRepository.SaveChangesAsync(cancellationToken);
            return new CreditCardResponseDTO(card.Uuid, brand.Name, MaskCardNumber(card.CardNumber),
                card.PrintedName, card.ExpirationDate, card.IsPreferred, card.IsActive);
        }

        public async Task SetPreferredCreditCardAsync(
            Guid customerUuid, Guid creditCardUuid, CancellationToken cancellationToken = default)
        {
            var customer = await GetTrackedAsync(customerUuid, cancellationToken);
            await _creditCardRepository.ClearPreferredAsync(customer.Id, cancellationToken);
            var card = await _creditCardRepository.GetByUuidAsync(creditCardUuid, cancellationToken)
                ?? throw new KeyNotFoundException("Cartão não encontrado.");
            card.IsPreferred = true;
            _creditCardRepository.Update(card);
            await _creditCardRepository.SaveChangesAsync(cancellationToken);
        }

        public async Task<IEnumerable<CreditCardResponseDTO>> GetCreditCardsAsync(
            Guid customerUuid, CancellationToken cancellationToken = default)
        {
            var cards = await _creditCardRepository.GetByCustomerAsync(customerUuid, cancellationToken);
            return cards.Select(c => new CreditCardResponseDTO(c.Uuid, c.CardBrand?.Name ?? string.Empty,
                MaskCardNumber(c.CardNumber), c.PrintedName, c.ExpirationDate, c.IsPreferred, c.IsActive));
        }

        public async Task<PagedResultDTO<TransactionModel>> GetTransactionsAsync(
            Guid customerUuid, int page, int pageSize, CancellationToken cancellationToken = default)
        {
            var (items, totalCount) = await _customerRepository
                .GetTransactionsAsync(customerUuid, page, pageSize, cancellationToken);
            return new PagedResultDTO<TransactionModel>(items, totalCount, page, pageSize);
        }

        private async Task<CustomerModel> GetTrackedAsync(Guid uuid, CancellationToken ct)
            => await _customerRepository.GetByUuidAsync(uuid, ct)
               ?? throw new KeyNotFoundException($"Cliente {uuid} não encontrado.");

        private static CustomerAddressModel BuildAddress(
            int customerId, AddressTypeEnum type, AddressRegisterDTO DTO, string label) => new()
            {
                CustomerId = customerId,
                AddressType = type,
                Label = label,
                ResidenceType = DTO.ResidenceType,
                StreetType = DTO.StreetType,
                Street = DTO.Street,
                Number = DTO.Number,
                Neighborhood = DTO.Neighborhood,
                ZipCode = DTO.ZipCode,
                City = DTO.City,
                State = DTO.State,
                Country = DTO.Country,
                Observations = DTO.Observations,
                IsActive = true
            };

        private static CustomerResponseDTO MapToResponseDTO(CustomerModel c) => new(
            c.Uuid, c.CustomerCode, c.Name, c.Gender, c.BirthDate,
            c.Cpf, c.Email, c.IsActive, c.Ranking, c.CreatedAt, c.UpdatedAt);

        private static AddressResponseDTO MapToAddressDTO(CustomerAddressModel a) => new(
            a.Uuid, a.AddressType, a.Label, a.ResidenceType, a.StreetType,
            a.Street, a.Number, a.Neighborhood, a.ZipCode,
            a.City, a.State, a.Country, a.Observations, a.IsActive);

        private static string GenerateCustomerCode()
            => $"CLI-{Guid.NewGuid().ToString("N")[..8].ToUpper()}";

        private static string MaskCardNumber(string cardNumber)
            => cardNumber.Length >= 4 ? $"**** **** **** {cardNumber[^4..]}" : "****";
    }
}
