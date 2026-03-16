using Microsoft.AspNetCore.Authorization;
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
    [Authorize]
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerService _customerService;

        public CustomerController(ICustomerService customerService)
            => _customerService = customerService;


        [HttpGet]
        [Authorize(Roles = "Admin,Employee")]
        public async Task<IActionResult> GetAll(
            [FromQuery] CustomerFilterDTO filter,
            CancellationToken cancellationToken)
        {
            var result = await _customerService.GetPagedAsync(filter, cancellationToken);
            return Ok(result);
        }


        [HttpGet("{uuid:guid}")]
        [Authorize(Roles = "Admin,Employee")]
        public async Task<IActionResult> GetById(Guid uuid, CancellationToken cancellationToken)
        {
            var customer = await _customerService.GetByUuidAsync(uuid, cancellationToken);
            return customer is null ? NotFound() : Ok(customer);
        }

        /// <summary>
        /// Cadastro público — não exige autenticação.
        /// Cria cliente + conta de usuário vinculada com role Customer.
        /// </summary>
        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register(
            [FromBody] CustomerRegisterDTO dto,
            CancellationToken cancellationToken)
        {
            try
            {
                var result = await _customerService.RegisterAsync(dto, cancellationToken);
                return CreatedAtAction(nameof(GetById), new { uuid = result.Uuid }, result);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }


        [HttpPost]
        [Authorize(Roles = "Admin,Employee")]
        public async Task<IActionResult> Create(
            [FromBody] CustomerCreateDTO dto,
            CancellationToken cancellationToken)
        {
            try
            {
                var result = await _customerService.CreateAsync(dto, cancellationToken);
                return CreatedAtAction(nameof(GetById), new { uuid = result.Uuid }, result);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }


        [HttpPut("{uuid:guid}")]
        [Authorize(Roles = "Admin,Employee")]
        public async Task<IActionResult> Update(
            Guid uuid,
            [FromBody] CustomerUpdateDTO dto,
            CancellationToken cancellationToken)
        {
            try
            {
                var result = await _customerService.UpdateAsync(uuid, dto, cancellationToken);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }


        [HttpPatch("{uuid:guid}/password")]
        public async Task<IActionResult> ChangePassword(
            Guid uuid,
            [FromBody] CustomerChangePasswordDTO dto,
            CancellationToken cancellationToken)
        {
            try
            {
                await _customerService.ChangePasswordAsync(uuid, dto, cancellationToken);
                return NoContent();
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }


        [HttpPatch("{uuid:guid}/toggle-active")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ToggleActive(Guid uuid, CancellationToken cancellationToken)
        {
            try
            {
                await _customerService.ToggleActiveAsync(uuid, cancellationToken);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
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
            try
            {
                var result = await _customerService.UpdateAddressAsync(uuid, addressUuid, dto, cancellationToken);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
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
