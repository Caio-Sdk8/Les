using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjetoLES.Server.DTO_s.User;
using ProjetoLES.Server.Interfaces.Services;

namespace ProjetoLES.Server.Controllers
{
    [ApiController]
    [Route("api/users")]
    [Produces("application/json")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
            => _userService = userService;

        [HttpGet]
        [Authorize(Roles = "Admin,Employee")]
        public async Task<IActionResult> GetAll(
            [FromQuery] string? search,
            [FromQuery] bool? isActive,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            CancellationToken cancellationToken = default)
        {
            var result = await _userService.GetPagedAsync(search, isActive, page, pageSize, cancellationToken);
            return Ok(result);
        }

        [HttpGet("{uuid:guid}")]
        [Authorize(Roles = "Admin,Employee")]
        public async Task<IActionResult> GetById(Guid uuid, CancellationToken cancellationToken)
        {
            var user = await _userService.GetByUuidAsync(uuid, cancellationToken);
            return user is null ? NotFound() : Ok(user);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create(
            [FromBody] UserCreateDTO dto,
            CancellationToken cancellationToken)
        {
            try
            {
                var result = await _userService.CreateAsync(dto, cancellationToken);
                return CreatedAtAction(nameof(GetById), new { uuid = result.Uuid }, result);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }

        [HttpPut("{uuid:guid}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(
            Guid uuid,
            [FromBody] UserUpdateDTO dto,
            CancellationToken cancellationToken)
        {
            try
            {
                var result = await _userService.UpdateAsync(uuid, dto, cancellationToken);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPatch("{uuid:guid}/password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword(
            Guid uuid,
            [FromBody] UserChangePasswordDTO dto,
            CancellationToken cancellationToken)
        {
            try
            {
                await _userService.ChangePasswordAsync(uuid, dto.CurrentPassword, dto.NewPassword, cancellationToken);
                return NoContent();
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }

        [HttpPatch("{uuid:guid}/deactivate")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Deactivate(Guid uuid, CancellationToken cancellationToken)
        {
            try
            {
                await _userService.DeactivateAsync(uuid, cancellationToken);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPost("{uuid:guid}/roles/{roleUuid:guid}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AssignRole(
            Guid uuid, Guid roleUuid, CancellationToken cancellationToken)
        {
            try
            {
                await _userService.AssignRoleAsync(uuid, roleUuid, cancellationToken);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpDelete("{uuid:guid}/roles/{roleUuid:guid}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RemoveRole(
            Guid uuid, Guid roleUuid, CancellationToken cancellationToken)
        {
            try
            {
                await _userService.RemoveRoleAsync(uuid, roleUuid, cancellationToken);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }
}
