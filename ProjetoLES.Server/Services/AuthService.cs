using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using ProjetoLES.Server.DTO_s.Auth;
using ProjetoLES.Server.Interfaces.Repositories;
using ProjetoLES.Server.Interfaces.Services;
using ProjetoLES.Server.Settings;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ProjetoLES.Server.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly JwtSettings _jwtSettings;

        public AuthService(IUserRepository userRepository, IOptions<JwtSettings> jwtSettings)
        {
            _userRepository = userRepository;
            _jwtSettings = jwtSettings.Value;
        }

        public async Task<LoginResponseDTO> LoginAsync(
            LoginRequestDTO dto, CancellationToken cancellationToken = default)
        {
            var user = await _userRepository.GetByEmailAsync(dto.Email, cancellationToken)
                ?? throw new UnauthorizedAccessException("E-mail ou senha inválidos.");

            if (!user.IsActive)
                throw new UnauthorizedAccessException("Usuário inativo.");

            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                throw new UnauthorizedAccessException("E-mail ou senha inválidos.");

            var roles = user.UserRoles
                .Where(ur => ur.Role.IsActive)
                .Select(ur => ur.Role.Name)
                .ToList();

            var expiresAt = DateTime.UtcNow.AddHours(_jwtSettings.ExpiresInHours);
            var token = GenerateToken(user.Id, user.Uuid, user.Email, roles, expiresAt);

            return new LoginResponseDTO(
                token,
                expiresAt,
                new AuthUserDTO(user.Uuid, user.Email, roles));
        }

        private string GenerateToken(
            int userId, Guid userUuid, string email,
            IEnumerable<string> roles, DateTime expiresAt)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new(JwtRegisteredClaimNames.Sub, userId.ToString()),
                new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new(JwtRegisteredClaimNames.Email, email),
                new("uuid", userUuid.ToString()),
            };

            foreach (var role in roles)
                claims.Add(new Claim(ClaimTypes.Role, role));

            var token = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                expires: expiresAt,
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
