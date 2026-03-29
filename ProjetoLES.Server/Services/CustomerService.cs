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

            if (await _context.Set<UserModel>().AnyAsync(u => u.Email == DTO.Email, cancellationToken))
                throw new InvalidOperationException("E-mail já cadastrado.");

            var billingAddressDTOs = NormalizeAddresses(DTO.BillingAddresses, DTO.BillingAddress);
            var deliveryAddressDTOs = NormalizeAddresses(DTO.DeliveryAddresses, DTO.DeliveryAddress);

            if (!billingAddressDTOs.Any())
                throw new InvalidOperationException("Informe ao menos um endereço de cobrança.");

            if (!deliveryAddressDTOs.Any())
                throw new InvalidOperationException("Informe ao menos um endereço de entrega.");

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

                var billingAddresses = billingAddressDTOs
                    .Select((addressDTO, index) => BuildAddress(
                        customer.Id,
                        AddressTypeEnum.Billing,
                        addressDTO,
                        addressDTO.Label ?? $"Endereço de cobrança {index + 1}"))
                    .ToList();

                var deliveryAddresses = deliveryAddressDTOs
                    .Select((addressDTO, index) => BuildAddress(
                        customer.Id,
                        AddressTypeEnum.Delivery,
                        addressDTO,
                        addressDTO.Label ?? $"Endereço de entrega {index + 1}"))
                    .ToList();

                await _context.Set<CustomerAddressModel>()
                    .AddRangeAsync(billingAddresses.Concat(deliveryAddresses), cancellationToken);

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

                // ── Criar conta de usuário vinculada ao cliente ───────────────
                var customerRole = await _context.Set<RoleModel>()
                    .FirstOrDefaultAsync(r => r.Name == "Customer", cancellationToken);

                var userAccount = new UserModel
                {
                    Email = DTO.Email,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(DTO.Password),
                    IsActive = true,
                    CustomerId = customer.Id,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                await _context.Set<UserModel>().AddAsync(userAccount, cancellationToken);
                await _context.SaveChangesAsync(cancellationToken);

                if (customerRole is not null)
                {
                    _context.Set<UserRoleModel>().Add(
                        new UserRoleModel { UserId = userAccount.Id, RoleId = customerRole.Id });
                    await _context.SaveChangesAsync(cancellationToken);
                }

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
                    DTO.Email,
                    billingAddresses.Select(MapToAddressDTO),
                    deliveryAddresses.Select(MapToAddressDTO),
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
            if (await _customerRepository.ExistsByCpfAsync(DTO.Cpf, cancellationToken))
                throw new InvalidOperationException("CPF já cadastrado.");

            var customer = new CustomerModel
            {
                CustomerCode = GenerateCustomerCode(),
                Name = DTO.Name,
                Gender = DTO.Gender,
                BirthDate = DTO.BirthDate,
                Cpf = DTO.Cpf,
                IsActive = true,
                Ranking = DTO.Ranking,
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
            if (DTO.Phones is null || !DTO.Phones.Any())
                throw new InvalidOperationException("Informe ao menos um telefone.");

            if (DTO.Phones.Count(p => p.IsMain) > 1)
                throw new InvalidOperationException("Apenas um telefone pode ser principal.");

            var customer = await GetTrackedAsync(uuid, cancellationToken);
            EnsureCustomerIsActiveForMutation(customer);
            var userAccount = await _context.Set<UserModel>()
                .FirstOrDefaultAsync(u => u.CustomerId == customer.Id, cancellationToken)
                ?? throw new KeyNotFoundException("Conta de usuário não encontrada para este cliente.");

            var emailInUse = await _context.Set<UserModel>()
                .AnyAsync(u => u.Email == DTO.Email && u.Id != userAccount.Id, cancellationToken);

            if (emailInUse)
                throw new InvalidOperationException("E-mail já cadastrado.");

            await using var transaction = await _context.Database.BeginTransactionAsync(cancellationToken);

            try
            {
            customer.Name = DTO.Name;
            customer.Gender = DTO.Gender;
            customer.BirthDate = DTO.BirthDate;
            customer.UpdatedAt = DateTime.UtcNow;

            userAccount.Email = DTO.Email;
            userAccount.UpdatedAt = DateTime.UtcNow;

            var existingPhones = await _context.Set<CustomerPhoneModel>()
                .Where(p => p.CustomerId == customer.Id)
                .ToListAsync(cancellationToken);

            _context.Set<CustomerPhoneModel>().RemoveRange(existingPhones);

            var phones = DTO.Phones
                .Select((p, index) => new CustomerPhoneModel
                {
                    CustomerId = customer.Id,
                    PhoneType = p.PhoneType,
                    AreaCode = p.AreaCode,
                    Number = p.Number,
                    IsMain = DTO.Phones.Any(x => x.IsMain) ? p.IsMain : index == 0
                })
                .ToList();

            await _context.Set<CustomerPhoneModel>().AddRangeAsync(phones, cancellationToken);

            _customerRepository.Update(customer);
            await _customerRepository.SaveChangesAsync(cancellationToken);

            await transaction.CommitAsync(cancellationToken);
            }
            catch
            {
                await transaction.RollbackAsync(cancellationToken);
                throw;
            }

            var full = await _customerRepository.GetFullProfileAsync(uuid, cancellationToken);
            return MapToResponseDTO(full!);
        }

        public async Task ChangePasswordAsync(
            Guid uuid, CustomerChangePasswordDTO DTO, CancellationToken cancellationToken = default)
        {
            var customer = await GetTrackedAsync(uuid, cancellationToken);
            EnsureCustomerIsActiveForMutation(customer);
            var userAccount = await _context.Set<UserModel>()
                .FirstOrDefaultAsync(u => u.CustomerId == customer.Id, cancellationToken)
                ?? throw new KeyNotFoundException("Conta de usuário não encontrada para este cliente.");
            if (!BCrypt.Net.BCrypt.Verify(DTO.CurrentPassword, userAccount.PasswordHash))
                throw new UnauthorizedAccessException("Senha atual incorreta.");
            if (DTO.NewPassword != DTO.NewPasswordConfirmation)
                throw new InvalidOperationException("As senhas não conferem.");
            userAccount.PasswordHash = BCrypt.Net.BCrypt.HashPassword(DTO.NewPassword);
            userAccount.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task ToggleActiveAsync(Guid uuid, CancellationToken cancellationToken = default)
        {
            var customer = await _context.Set<CustomerModel>()
                .Include(c => c.User)
                .FirstOrDefaultAsync(c => c.Uuid == uuid, cancellationToken)
                ?? throw new KeyNotFoundException($"Cliente {uuid} não encontrado.");

            customer.IsActive = !customer.IsActive;

            if (customer.User is not null)
            {
                customer.User.IsActive = customer.IsActive;
                customer.User.UpdatedAt = DateTime.UtcNow;
            }

            customer.UpdatedAt = DateTime.UtcNow;
            _customerRepository.Update(customer);
            await _customerRepository.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteAsync(Guid uuid, CancellationToken cancellationToken = default)
        {
            var customer = await _context.Set<CustomerModel>()
                .Include(c => c.User)
                .FirstOrDefaultAsync(c => c.Uuid == uuid, cancellationToken)
                ?? throw new KeyNotFoundException($"Cliente {uuid} não encontrado.");

            customer.IsActive = false;
            customer.UpdatedAt = DateTime.UtcNow;

            _customerRepository.Remove(customer);

            if (customer.User is not null)
            {
                customer.User.IsActive = false;
                customer.User.UpdatedAt = DateTime.UtcNow;
                customer.User.IsDeleted = true;
                customer.User.DeletedAt = DateTime.UtcNow;
            }

            await _customerRepository.SaveChangesAsync(cancellationToken);
        }

        public async Task<CustomerResponseDTO?> GetByUuidAsync(
            Guid uuid, CancellationToken cancellationToken = default)
        {
            var c = await _customerRepository.GetFullProfileAsync(uuid, cancellationToken);
            return c is null ? null : MapToResponseDTO(c);
        }

        public async Task<PagedResultDTO<CustomerSummaryDTO>> GetPagedAsync(
            CustomerFilterDTO filter, CancellationToken cancellationToken = default)
        {
            var (items, totalCount) = await _customerRepository.GetPagedAsync(filter, cancellationToken);
            var DTOs = items.Select(c => new CustomerSummaryDTO(
                c.Uuid, c.CustomerCode, c.Name, c.User?.Email, c.Cpf, c.IsActive, c.Ranking));
            return new PagedResultDTO<CustomerSummaryDTO>(DTOs, totalCount, filter.Page, filter.PageSize);
        }

        public async Task<AddressResponseDTO> AddAddressAsync(
            Guid customerUuid, AddressCreateDTO DTO, CancellationToken cancellationToken = default)
        {
            var customer = await GetTrackedAsync(customerUuid, cancellationToken);
            EnsureCustomerIsActiveForMutation(customer);
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
            var customer = await GetTrackedAsync(customerUuid, cancellationToken);
            EnsureCustomerIsActiveForMutation(customer);

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

        public async Task<IEnumerable<AddressResponseDTO>> GetMyAddressesAsync(
            Guid userUuid,
            CancellationToken cancellationToken = default)
        {
            var customerUuid = await GetCustomerUuidByUserUuidAsync(userUuid, cancellationToken);
            return await GetAddressesAsync(customerUuid, cancellationToken);
        }

        public async Task<PhoneResponseDTO> AddPhoneAsync(
            Guid customerUuid, PhoneCreateDTO DTO, CancellationToken cancellationToken = default)
        {
            var customer = await GetTrackedAsync(customerUuid, cancellationToken);
            EnsureCustomerIsActiveForMutation(customer);
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
            EnsureCustomerIsActiveForMutation(customer);

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
            EnsureCustomerIsActiveForMutation(customer);
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

        public async Task<IEnumerable<CreditCardResponseDTO>> GetMyCreditCardsAsync(
            Guid userUuid,
            CancellationToken cancellationToken = default)
        {
            var customerUuid = await GetCustomerUuidByUserUuidAsync(userUuid, cancellationToken);
            return await GetCreditCardsAsync(customerUuid, cancellationToken);
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

        private async Task<Guid> GetCustomerUuidByUserUuidAsync(Guid userUuid, CancellationToken ct)
            => await _context.Set<UserModel>()
                .AsNoTracking()
                .Where(u => u.Uuid == userUuid && u.IsActive && u.Customer != null)
                .Select(u => (Guid?)u.Customer!.Uuid)
                .FirstOrDefaultAsync(ct)
               ?? throw new KeyNotFoundException("Cliente vinculado ao usuário não encontrado.");

        private static void EnsureCustomerIsActiveForMutation(CustomerModel customer)
        {
            if (!customer.IsActive)
            {
                throw new InvalidOperationException("Não é permitido editar cliente desativado.");
            }
        }

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

        private static List<AddressRegisterDTO> NormalizeAddresses(
            IList<AddressRegisterDTO>? addresses,
            AddressRegisterDTO? singleAddress)
        {
            var normalized = addresses?.ToList() ?? new List<AddressRegisterDTO>();

            if (singleAddress is not null)
                normalized.Add(singleAddress);

            return normalized;
        }

        private static CustomerResponseDTO MapToResponseDTO(CustomerModel c) => new(
            c.Uuid, c.CustomerCode, c.Name, c.Gender, c.BirthDate,
            c.Cpf, c.User?.Email, c.IsActive, c.Ranking, c.CreatedAt, c.UpdatedAt,
            c.Phones.Select(p => new PhoneResponseDTO(p.Uuid, p.PhoneType, p.AreaCode, p.Number, p.IsMain)));

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
