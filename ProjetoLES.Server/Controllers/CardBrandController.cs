using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjetoLES.Server.Data;

namespace ProjetoLES.Server.Controllers
{
    [ApiController]
    [Route("api/card-brands")]
    [Produces("application/json")]
    public class CardBrandController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CardBrandController(AppDbContext context)
            => _context = context;

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
        {
            var brands = await _context.CardBrands
                .AsNoTracking()
                .Where(b => b.IsActive)
                .OrderBy(b => b.Name)
                .Select(b => new { b.Uuid, b.Name })
                .ToListAsync(cancellationToken);

            return Ok(brands);
        }
    }
}
