using ProjetoLES.Server.DTO_s.Role;

namespace ProjetoLES.Server.Interfaces.Services
{
    public interface IRoleService
    {
        Task<RoleResponseDTO> CreateAsync(RoleCreateDTO dto, CancellationToken cancellationToken = default);
        Task<IEnumerable<RoleResponseDTO>> GetAllAsync(CancellationToken cancellationToken = default);
        Task<RoleResponseDTO?> GetByUuidAsync(Guid uuid, CancellationToken cancellationToken = default);
        Task<RoleResponseDTO> UpdateAsync(Guid uuid, RoleCreateDTO dto, CancellationToken cancellationToken = default);
        Task DeleteAsync(Guid uuid, CancellationToken cancellationToken = default);
    }
}
