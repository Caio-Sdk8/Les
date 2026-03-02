using Microsoft.AspNetCore.Mvc;
using ProjetoLES.Server.DTO_s.Address;
using ProjetoLES.Server.DTO_s.CreditCard;
using ProjetoLES.Server.DTO_s.Customer;
using ProjetoLES.Server.DTO_s.Phone;
using ProjetoLES.Server.Interfaces.Services;

namespace ProjetoLES.Server.Controllers
{
    [ApiController]
    [Route("api/customers")]
    [Produces("application/json")]
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerService _customerService;

        public CustomerController(ICustomerService customerService)
            => _customerService = customerService;


        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] CustomerFilterDTO filter,
            CancellationToken cancellationToken)
        {
            var result = await _customerService.GetPagedAsync(filter, cancellationToken);
            return Ok(result);
        }


        [HttpGet("{uuid:guid}")]
        public async Task<IActionResult> GetById(Guid uuid, CancellationToken cancellationToken)
        {
            var customer = await _customerService.GetByUuidAsync(uuid, cancellationToken);
            return customer is null ? NotFound() : Ok(customer);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(
            [FromBody] CustomerRegisterDTO dto,
            CancellationToken cancellationToken)
        {
            var result = await _customerService.RegisterAsync(dto, cancellationToken);
            return CreatedAtAction(nameof(GetById), new { uuid = result.Uuid }, result);
        }


        [HttpPost]
        public async Task<IActionResult> Create(
            [FromBody] CustomerCreateDTO dto,
            CancellationToken cancellationToken)
        {
            var result = await _customerService.CreateAsync(dto, cancellationToken);
            return CreatedAtAction(nameof(GetById), new { uuid = result.Uuid }, result);
        }


        [HttpPut("{uuid:guid}")]
        public async Task<IActionResult> Update(
            Guid uuid,
            [FromBody] CustomerUpdateDTO dto,
            CancellationToken cancellationToken)
        {
            var result = await _customerService.UpdateAsync(uuid, dto, cancellationToken);
            return Ok(result);
        }


        [HttpPatch("{uuid:guid}/password")]
        public async Task<IActionResult> ChangePassword(
            Guid uuid,
            [FromBody] CustomerChangePasswordDTO dto,
            CancellationToken cancellationToken)
        {
            await _customerService.ChangePasswordAsync(uuid, dto, cancellationToken);
            return NoContent();
        }


        [HttpPatch("{uuid:guid}/deactivate")]
        public async Task<IActionResult> Deactivate(Guid uuid, CancellationToken cancellationToken)
        {
            await _customerService.DeactivateAsync(uuid, cancellationToken);
            return NoContent();
        }


        [HttpGet("{uuid:guid}/addresses")]
        public async Task<IActionResult> GetAddresses(Guid uuid, CancellationToken cancellationToken)
        {
            var result = await _customerService.GetAddressesAsync(uuid, cancellationToken);
            return Ok(result);
        }

        [HttpPost("{uuid:guid}/addresses")]
        public async Task<IActionResult> AddAddress(
            Guid uuid,
            [FromBody] AddressCreateDTO dto,
            CancellationToken cancellationToken)
        {
            var result = await _customerService.AddAddressAsync(uuid, dto, cancellationToken);
            return CreatedAtAction(nameof(GetAddresses), new { uuid }, result);
        }

        [HttpPut("{uuid:guid}/addresses/{addressUuid:guid}")]
        public async Task<IActionResult> UpdateAddress(
            Guid uuid,
            Guid addressUuid,
            [FromBody] AddressUpdateDTO dto,
            CancellationToken cancellationToken)
        {
            var result = await _customerService.UpdateAddressAsync(uuid, addressUuid, dto, cancellationToken);
            return Ok(result);
        }


        [HttpPost("{uuid:guid}/phones")]
        public async Task<IActionResult> AddPhone(
            Guid uuid,
            [FromBody] PhoneCreateDTO dto,
            CancellationToken cancellationToken)
        {
            var result = await _customerService.AddPhoneAsync(uuid, dto, cancellationToken);
            return CreatedAtAction(nameof(GetById), new { uuid }, result);
        }


        [HttpGet("{uuid:guid}/credit-cards")]
        public async Task<IActionResult> GetCreditCards(Guid uuid, CancellationToken cancellationToken)
        {
            var result = await _customerService.GetCreditCardsAsync(uuid, cancellationToken);
            return Ok(result);
        }

        [HttpPost("{uuid:guid}/credit-cards")]
        public async Task<IActionResult> AddCreditCard(
            Guid uuid,
            [FromBody] CreditCardCreateDTO dto,
            CancellationToken cancellationToken)
        {
            var result = await _customerService.AddCreditCardAsync(uuid, dto, cancellationToken);
            return CreatedAtAction(nameof(GetCreditCards), new { uuid }, result);
        }

        [HttpPatch("{uuid:guid}/credit-cards/{cardUuid:guid}/set-preferred")]
        public async Task<IActionResult> SetPreferred(
            Guid uuid,
            Guid cardUuid,
            CancellationToken cancellationToken)
        {
            await _customerService.SetPreferredCreditCardAsync(uuid, cardUuid, cancellationToken);
            return NoContent();
        }


        [HttpGet("{uuid:guid}/transactions")]
        public async Task<IActionResult> GetTransactions(
            Guid uuid,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            CancellationToken cancellationToken = default)
        {
            var result = await _customerService.GetTransactionsAsync(uuid, page, pageSize, cancellationToken);
            return Ok(result);
        }
    }
}
