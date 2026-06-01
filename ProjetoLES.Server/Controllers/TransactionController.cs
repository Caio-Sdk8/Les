using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjetoLES.Server.DTO_s.Transaction;
using ProjetoLES.Server.Interfaces.Services;

namespace ProjetoLES.Server.Controllers
{
    [ApiController]
    [Route("api/transactions")]
    [Produces("application/json")]
    [Authorize]
    public class TransactionController : ControllerBase
    {
        private readonly ITransactionService _transactionService;

        public TransactionController(ITransactionService transactionService)
        {
            _transactionService = transactionService;
        }

        [HttpGet("my")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> GetMyTransactions(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            [FromQuery] string? status = null,
            CancellationToken cancellationToken = default)
        {
            var userUuidClaim = User.FindFirst("uuid")?.Value;
            if (!Guid.TryParse(userUuidClaim, out var userUuid))
                return Unauthorized(new { message = "Token inválido para consulta de pedidos." });

            var result = await _transactionService.GetMyTransactionsAsync(
                userUuid,
                page,
                pageSize,
                status,
                cancellationToken);

            return Ok(result);
        }

        [HttpGet]
        [Authorize(Roles = "Admin,Employee")]
        public async Task<IActionResult> GetTransactions(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            [FromQuery] string? status = null,
            [FromQuery] Guid? customerUuid = null,
            CancellationToken cancellationToken = default)
        {
            var result = await _transactionService.GetTransactionsAsync(
                page,
                pageSize,
                status,
                customerUuid,
                cancellationToken);

            return Ok(result);
        }

        [HttpPost("{transactionUuid:guid}/after-sales-requests")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> CreateAfterSalesRequest(
            Guid transactionUuid,
            [FromBody] AfterSalesRequestCreateDTO dto,
            CancellationToken cancellationToken = default)
        {
            try
            {
                var userUuidClaim = User.FindFirst("uuid")?.Value;
                if (!Guid.TryParse(userUuidClaim, out var userUuid))
                    return Unauthorized(new { message = "Token inválido para solicitação de troca/devolução." });

                var result = await _transactionService.CreateAfterSalesRequestAsync(
                    transactionUuid,
                    userUuid,
                    dto,
                    cancellationToken);

                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, new { message = ex.Message });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpGet("after-sales-requests")]
        [Authorize(Roles = "Admin,Employee")]
        public async Task<IActionResult> GetAfterSalesRequests(
            [FromQuery] string? status = null,
            [FromQuery] string? type = null,
            [FromQuery] DateTime? requestedFrom = null,
            [FromQuery] DateTime? requestedTo = null,
            CancellationToken cancellationToken = default)
        {
            var result = await _transactionService.GetAfterSalesRequestsAsync(
                status,
                type,
                requestedFrom,
                requestedTo,
                cancellationToken);
            return Ok(result);
        }

        [HttpPatch("{transactionUuid:guid}/after-sales-requests/{requestUuid:guid}/approve")]
        [Authorize(Roles = "Admin,Employee")]
        public async Task<IActionResult> ApproveAfterSalesRequest(
            Guid transactionUuid,
            Guid requestUuid,
            [FromBody] AfterSalesReviewDecisionDTO dto,
            CancellationToken cancellationToken = default)
        {
            try
            {
                var reviewedBy = User.Identity?.Name ?? User.FindFirst("email")?.Value ?? "Staff";
                await _transactionService.ReviewAfterSalesRequestAsync(
                    transactionUuid,
                    requestUuid,
                    approve: true,
                    dto.Note,
                    reviewedBy,
                    cancellationToken);

                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPatch("{transactionUuid:guid}/after-sales-requests/{requestUuid:guid}/reject")]
        [Authorize(Roles = "Admin,Employee")]
        public async Task<IActionResult> RejectAfterSalesRequest(
            Guid transactionUuid,
            Guid requestUuid,
            [FromBody] AfterSalesReviewDecisionDTO dto,
            CancellationToken cancellationToken = default)
        {
            try
            {
                var reviewedBy = User.Identity?.Name ?? User.FindFirst("email")?.Value ?? "Staff";
                await _transactionService.ReviewAfterSalesRequestAsync(
                    transactionUuid,
                    requestUuid,
                    approve: false,
                    dto.Note,
                    reviewedBy,
                    cancellationToken);

                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpGet("{transactionUuid:guid}")]
        public async Task<IActionResult> GetTransactionDetail(
            Guid transactionUuid,
            CancellationToken cancellationToken = default)
        {
            try
            {
                var isStaff = User.IsInRole("Admin") || User.IsInRole("Employee");

                Guid? userUuid = null;
                if (!isStaff)
                {
                    var userUuidClaim = User.FindFirst("uuid")?.Value;
                    if (!Guid.TryParse(userUuidClaim, out var parsedUserUuid))
                        return Unauthorized(new { message = "Token inválido para consulta de pedido." });

                    userUuid = parsedUserUuid;
                }

                var result = await _transactionService.GetTransactionDetailAsync(
                    transactionUuid,
                    userUuid,
                    isStaff,
                    cancellationToken);

                return Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, new { message = ex.Message });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpGet("{transactionUuid:guid}/prescription-file")]
        public async Task<IActionResult> GetPrescriptionFile(
            Guid transactionUuid,
            CancellationToken cancellationToken = default)
        {
            try
            {
                var isStaff = User.IsInRole("Admin") || User.IsInRole("Employee");

                Guid? userUuid = null;
                if (!isStaff)
                {
                    var userUuidClaim = User.FindFirst("uuid")?.Value;
                    if (!Guid.TryParse(userUuidClaim, out var parsedUserUuid))
                        return Unauthorized(new { message = "Token inválido para consulta de receita." });

                    userUuid = parsedUserUuid;
                }

                var file = await _transactionService.GetPrescriptionFileAsync(
                    transactionUuid,
                    userUuid,
                    isStaff,
                    cancellationToken);

                return Ok(file);
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, new { message = ex.Message });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("checkout")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> Checkout(
            [FromBody] CheckoutRequestDTO dto,
            CancellationToken cancellationToken)
        {
            try
            {
                var userUuidClaim = User.FindFirst("uuid")?.Value;
                if (!Guid.TryParse(userUuidClaim, out var userUuid))
                    return Unauthorized(new { message = "Token inválido para checkout." });

                var result = await _transactionService.CheckoutAsync(userUuid, dto, cancellationToken);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpGet("my/exchange-credit")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> GetMyExchangeCredit(CancellationToken cancellationToken)
        {
            var userUuidClaim = User.FindFirst("uuid")?.Value;
            if (!Guid.TryParse(userUuidClaim, out var userUuid))
                return Unauthorized(new { message = "Token inválido para consulta de crédito de troca." });

            var result = await _transactionService.GetMyExchangeCreditBalanceAsync(userUuid, cancellationToken);
            return Ok(result);
        }

        [HttpGet("prescriptions")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetPrescriptionReviews(
            [FromQuery] string? status,
            CancellationToken cancellationToken)
        {
            var reviews = await _transactionService.GetPrescriptionReviewsAsync(status, cancellationToken);
            return Ok(reviews);
        }

        [HttpPatch("prescriptions/{transactionUuid:guid}/approve")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ApprovePrescription(
            Guid transactionUuid,
            [FromBody] PrescriptionReviewDecisionDTO dto,
            CancellationToken cancellationToken)
        {
            try
            {
                var reviewedBy = User.Identity?.Name ?? User.FindFirst("email")?.Value ?? "Admin";
                await _transactionService.ApprovePrescriptionAsync(
                    transactionUuid,
                    dto.Note,
                    reviewedBy,
                    cancellationToken);

                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPatch("prescriptions/{transactionUuid:guid}/reject")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RejectPrescription(
            Guid transactionUuid,
            [FromBody] PrescriptionReviewDecisionDTO dto,
            CancellationToken cancellationToken)
        {
            try
            {
                var reviewedBy = User.Identity?.Name ?? User.FindFirst("email")?.Value ?? "Admin";
                await _transactionService.RejectPrescriptionAsync(
                    transactionUuid,
                    dto.Note,
                    reviewedBy,
                    cancellationToken);

                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPatch("prescriptions/{transactionUuid:guid}/request-resubmission")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RequestPrescriptionResubmission(
            Guid transactionUuid,
            [FromBody] PrescriptionRequestResubmissionDTO dto,
            CancellationToken cancellationToken)
        {
            try
            {
                var reviewedBy = User.Identity?.Name ?? User.FindFirst("email")?.Value ?? "Admin";
                await _transactionService.RequestPrescriptionResubmissionAsync(
                    transactionUuid,
                    dto.Note,
                    reviewedBy,
                    cancellationToken);

                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPatch("{transactionUuid:guid}/prescription-resubmission")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> ResubmitPrescription(
            Guid transactionUuid,
            [FromBody] PrescriptionResubmissionRequestDTO dto,
            CancellationToken cancellationToken)
        {
            try
            {
                var userUuidClaim = User.FindFirst("uuid")?.Value;
                if (!Guid.TryParse(userUuidClaim, out var userUuid))
                    return Unauthorized(new { message = "Token inválido para reenvio de receita." });

                await _transactionService.ResubmitPrescriptionAsync(
                    transactionUuid,
                    userUuid,
                    dto,
                    cancellationToken);

                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, new { message = ex.Message });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpGet("sales-catalog")]
        [Authorize(Roles = "Admin,Employee")]
        public async Task<IActionResult> GetSalesCatalog(CancellationToken cancellationToken)
        {
            var result = await _transactionService.GetSalesCatalogAsync(cancellationToken);
            return Ok(result);
        }
        
        [HttpPost("seed-sales")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> SeedSales([FromQuery] int months = 12, CancellationToken cancellationToken = default)
        {
            await _transactionService.GenerateSampleSalesDataAsync(months, cancellationToken);
            return NoContent();
        }
    }
}
