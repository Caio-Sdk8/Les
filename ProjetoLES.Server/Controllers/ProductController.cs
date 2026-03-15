using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjetoLES.Server.DTO_s.Product;
using ProjetoLES.Server.Interfaces.Services;

namespace ProjetoLES.Server.Controllers
{
    [ApiController]
    [Route("api/products")]
    [Produces("application/json")]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductController(IProductService productService)
            => _productService = productService;

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll(
            [FromQuery] ProductFilterDTO filter,
            CancellationToken cancellationToken)
        {
            var result = await _productService.GetPagedAsync(filter, cancellationToken);
            return Ok(result);
        }

        [HttpGet("{uuid:guid}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById(Guid uuid, CancellationToken cancellationToken)
        {
            var product = await _productService.GetByUuidAsync(uuid, cancellationToken);
            return product is null ? NotFound() : Ok(product);
        }


        [HttpGet("{uuid:guid}/substitutes")]
        [AllowAnonymous]
        public async Task<IActionResult> GetSubstitutes(Guid uuid, CancellationToken cancellationToken)
        {
            var substitutes = await _productService.GetSubstitutesAsync(uuid, cancellationToken);
            return Ok(substitutes);
        }


        [HttpPost("drug-interactions")]
        [AllowAnonymous]
        public async Task<IActionResult> CheckDrugInteractions(
            [FromBody] IEnumerable<Guid> productUuids,
            CancellationToken cancellationToken)
        {
            if (productUuids is null || !productUuids.Any())
                return BadRequest(new { message = "Informe ao menos dois UUIDs de produtos." });

            var alerts = await _productService.CheckDrugInteractionsAsync(productUuids, cancellationToken);
            return Ok(alerts);
        }
    }
}
