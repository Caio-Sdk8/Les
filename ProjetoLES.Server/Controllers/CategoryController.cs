using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjetoLES.Server.Data;
using ProjetoLES.Server.DTO_s.Category;
using ProjetoLES.Server.Interfaces.Repositories;

namespace ProjetoLES.Server.Controllers
{
    [ApiController]
    [Route("api/categories")]
    [Produces("application/json")]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryRepository _categoryRepository;

        public CategoryController(ICategoryRepository categoryRepository)
            => _categoryRepository = categoryRepository;

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
        {
            var categories = await _categoryRepository.GetAllActiveAsync(cancellationToken);
            var dtos = categories.Select(c => new CategoryResponseDTO(c.Uuid, c.Name, c.Description, c.IsActive));
            return Ok(dtos);
        }

        [HttpGet("{uuid:guid}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById(Guid uuid, CancellationToken cancellationToken)
        {
            var category = await _categoryRepository.GetByUuidAsync(uuid, cancellationToken);
            if (category is null) return NotFound();
            return Ok(new CategoryResponseDTO(category.Uuid, category.Name, category.Description, category.IsActive));
        }
    }
}
