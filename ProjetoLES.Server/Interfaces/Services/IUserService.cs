using ProjetoLES.Server.DTO_s.User;
using ProjetoLES.Server.DTO_s;

namespace ProjetoLES.Server.Interfaces.Services
{
    public interface IUserService
    {
        Task<UserResponseDTO> CreateAsync(UserCreateDTO dto, CancellationToken cancellationToken = default);
        Task<UserResponseDTO?> GetByUuidAsync(Guid uuid, CancellationToken cancellationToken = default);
        Task<PagedResultDTO<UserSummaryDTO>> GetPagedAsync(string? search, bool? isActive, int page, int pageSize, CancellationToken cancellationToken = default);
        Task<UserResponseDTO> UpdateAsync(Guid uuid, UserUpdateDTO dto, CancellationToken cancellationToken = default);
        Task AssignRoleAsync(Guid userUuid, Guid roleUuid, CancellationToken cancellationToken = default);
        Task RemoveRoleAsync(Guid userUuid, Guid roleUuid, CancellationToken cancellationToken = default);
        Task DeactivateAsync(Guid uuid, CancellationToken cancellationToken = default);
        Task ChangePasswordAsync(Guid uuid, string currentPassword, string newPassword, CancellationToken cancellationToken = default);
    }
}
