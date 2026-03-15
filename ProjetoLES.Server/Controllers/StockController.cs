using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjetoLES.Server.DTO_s.Stock;
using ProjetoLES.Server.Interfaces.Services;

namespace ProjetoLES.Server.Controllers
{
    [ApiController]
    [Route("api/stock")]
    [Produces("application/json")]
    [Authorize]
    public class StockController : ControllerBase
    {
        private readonly IStockService _stockService;

        public StockController(IStockService stockService)
            => _stockService = stockService;


        [HttpGet]
        [Authorize(Roles = "Admin,Employee")]
        public async Task<IActionResult> GetAll(
            [FromQuery] StockFilterDTO filter,
            CancellationToken cancellationToken)
        {
            var result = await _stockService.GetStockPagedAsync(filter, cancellationToken);
            return Ok(result);
        }

        [HttpGet("product/{productUuid:guid}")]
        [Authorize(Roles = "Admin,Employee")]
        public async Task<IActionResult> GetByProduct(Guid productUuid, CancellationToken cancellationToken)
        {
            var stock = await _stockService.GetStockByProductAsync(productUuid, cancellationToken);
            return stock is null ? NotFound() : Ok(stock);
        }

        [HttpGet("product/{productUuid:guid}/entries")]
        [Authorize(Roles = "Admin,Employee")]
        public async Task<IActionResult> GetEntries(Guid productUuid, CancellationToken cancellationToken)
        {
            var entries = await _stockService.GetEntriesByProductAsync(productUuid, cancellationToken);
            return Ok(entries);
        }

        [HttpPost("entries")]
        [Authorize(Roles = "Admin,Employee")]
        public async Task<IActionResult> RegisterEntry(
            [FromBody] StockEntryCreateDTO dto,
            CancellationToken cancellationToken)
        {
            try
            {
                var result = await _stockService.RegisterEntryAsync(dto, cancellationToken);
                return CreatedAtAction(
                    nameof(GetByProduct),
                    new { productUuid = result.ProductUuid },
                    result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
