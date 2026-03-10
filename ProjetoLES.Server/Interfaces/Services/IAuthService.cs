using ProjetoLES.Server.DTO_s.Auth;

namespace ProjetoLES.Server.Interfaces.Services
{
    public interface IAuthService
    {
        Task<LoginResponseDTO> LoginAsync(LoginRequestDTO dto, CancellationToken cancellationToken = default);
    }
}
