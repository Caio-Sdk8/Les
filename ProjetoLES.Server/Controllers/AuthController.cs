using Microsoft.AspNetCore.Mvc;
using ProjetoLES.Server.DTO_s.Auth;
using ProjetoLES.Server.Interfaces.Services;

namespace ProjetoLES.Server.Controllers
{
    [ApiController]
    [Route("api/auth")]
    [Produces("application/json")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
            => _authService = authService;

        /// <summary>
        /// Realiza o login e retorna o token JWT.
        /// </summary>
        [HttpPost("login")]
        public async Task<IActionResult> Login(
            [FromBody] LoginRequestDTO dto,
            CancellationToken cancellationToken)
        {
            try
            {
                var result = await _authService.LoginAsync(dto, cancellationToken);
                return Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }
    }
}
