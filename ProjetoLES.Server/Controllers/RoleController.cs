using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjetoLES.Server.DTO_s.Role;
using ProjetoLES.Server.Interfaces.Services;

namespace ProjetoLES.Server.Controllers
{
    [ApiController]
    [Route("api/roles")]
    [Produces("application/json")]
    [Authorize(Roles = "Admin")]
    public class RoleController : ControllerBase
    {
        private readonly IRoleService _roleService;

        public RoleController(IRoleService roleService)
            => _roleService = roleService;

        [HttpGet]
        [Authorize(Roles = "Admin,Employee")]
        public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
        {
            var result = await _roleService.GetAllAsync(cancellationToken);
            return Ok(result);
        }

        [HttpGet("{uuid:guid}")]
        [Authorize(Roles = "Admin,Employee")]
        public async Task<IActionResult> GetById(Guid uuid, CancellationToken cancellationToken)
        {
            var result = await _roleService.GetByUuidAsync(uuid, cancellationToken);
            return result is null ? NotFound() : Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create(
            [FromBody] RoleCreateDTO dto,
            CancellationToken cancellationToken)
        {
            try
            {
                var result = await _roleService.CreateAsync(dto, cancellationToken);
                return CreatedAtAction(nameof(GetById), new { uuid = result.Uuid }, result);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }

        [HttpPut("{uuid:guid}")]
        public async Task<IActionResult> Update(
            Guid uuid,
            [FromBody] RoleCreateDTO dto,
            CancellationToken cancellationToken)
        {
            try
            {
                var result = await _roleService.UpdateAsync(uuid, dto, cancellationToken);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpDelete("{uuid:guid}")]
        public async Task<IActionResult> Delete(Guid uuid, CancellationToken cancellationToken)
        {
            try
            {
                await _roleService.DeleteAsync(uuid, cancellationToken);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }
}
