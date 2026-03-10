using ProjetoLES.Server.DTO_s.Role;
using ProjetoLES.Server.Interfaces.Repositories;
using ProjetoLES.Server.Interfaces.Services;
using ProjetoLES.Server.Models;

namespace ProjetoLES.Server.Services
{
    public class RoleService : IRoleService
    {
        private readonly IRoleRepository _roleRepository;

        public RoleService(IRoleRepository roleRepository)
            => _roleRepository = roleRepository;

        public async Task<RoleResponseDTO> CreateAsync(
            RoleCreateDTO dto, CancellationToken cancellationToken = default)
        {
            var existing = await _roleRepository.GetByNameAsync(dto.Name, cancellationToken);
            if (existing is not null)
                throw new InvalidOperationException($"Role '{dto.Name}' já existe.");

            var role = new RoleModel
            {
                Name = dto.Name,
                Description = dto.Description,
                IsActive = true
            };
            await _roleRepository.AddAsync(role, cancellationToken);
            await _roleRepository.SaveChangesAsync(cancellationToken);
            return Map(role);
        }

        public async Task<IEnumerable<RoleResponseDTO>> GetAllAsync(
            CancellationToken cancellationToken = default)
        {
            var roles = await _roleRepository.GetActiveRolesAsync(cancellationToken);
            return roles.Select(Map);
        }

        public async Task<RoleResponseDTO?> GetByUuidAsync(
            Guid uuid, CancellationToken cancellationToken = default)
        {
            var role = await _roleRepository.GetByUuidAsync(uuid, cancellationToken);
            return role is null ? null : Map(role);
        }

        public async Task<RoleResponseDTO> UpdateAsync(
            Guid uuid, RoleCreateDTO dto, CancellationToken cancellationToken = default)
        {
            var role = await _roleRepository.GetByUuidAsync(uuid, cancellationToken)
                ?? throw new KeyNotFoundException("Role não encontrada.");

            var existing = await _roleRepository.GetByNameAsync(dto.Name, cancellationToken);
            if (existing is not null && existing.Uuid != uuid)
                throw new InvalidOperationException($"Role '{dto.Name}' já existe.");

            role.Name = dto.Name;
            role.Description = dto.Description;
            _roleRepository.Update(role);
            await _roleRepository.SaveChangesAsync(cancellationToken);
            return Map(role);
        }

        public async Task DeleteAsync(Guid uuid, CancellationToken cancellationToken = default)
        {
            var role = await _roleRepository.GetByUuidAsync(uuid, cancellationToken)
                ?? throw new KeyNotFoundException("Role não encontrada.");
            _roleRepository.Remove(role);
            await _roleRepository.SaveChangesAsync(cancellationToken);
        }

        private static RoleResponseDTO Map(RoleModel r) => new(r.Uuid, r.Name, r.Description, r.IsActive);
    }
}
