using Microsoft.EntityFrameworkCore;
using ProjetoLES.Server.Data;
using ProjetoLES.Server.DTO_s;
using ProjetoLES.Server.DTO_s.User;
using ProjetoLES.Server.Interfaces.Repositories;
using ProjetoLES.Server.Interfaces.Services;
using ProjetoLES.Server.Models;

namespace ProjetoLES.Server.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IRoleRepository _roleRepository;
        private readonly AppDbContext _context;

        public UserService(
            IUserRepository userRepository,
            IRoleRepository roleRepository,
            AppDbContext context)
        {
            _userRepository = userRepository;
            _roleRepository = roleRepository;
            _context = context;
        }

        public async Task<UserResponseDTO> CreateAsync(
            UserCreateDTO dto, CancellationToken cancellationToken = default)
        {
            if (dto.Password != dto.PasswordConfirmation)
                throw new InvalidOperationException("As senhas não conferem.");

            if (await _userRepository.ExistsByEmailAsync(dto.Email, cancellationToken))
                throw new InvalidOperationException("E-mail já cadastrado.");

            int? customerId = null;
            if (dto.CustomerUuid.HasValue)
            {
                var customer = await _context.Customers
                    .FirstOrDefaultAsync(c => c.Uuid == dto.CustomerUuid.Value, cancellationToken)
                    ?? throw new KeyNotFoundException("Cliente não encontrado.");
                customerId = customer.Id;
            }

            var user = new UserModel
            {
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                IsActive = true,
                CustomerId = customerId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _userRepository.AddAsync(user, cancellationToken);
            await _userRepository.SaveChangesAsync(cancellationToken);

            if (dto.RoleUuids is not null && dto.RoleUuids.Any())
            {
                foreach (var roleUuid in dto.RoleUuids)
                {
                    var role = await _roleRepository.GetByUuidAsync(roleUuid, cancellationToken)
                        ?? throw new KeyNotFoundException($"Role {roleUuid} não encontrada.");
                    _context.UserRoles.Add(new UserRoleModel { UserId = user.Id, RoleId = role.Id });
                }
                await _context.SaveChangesAsync(cancellationToken);
            }

            return await BuildResponseAsync(user.Uuid, cancellationToken);
        }

        public async Task<UserResponseDTO?> GetByUuidAsync(
            Guid uuid, CancellationToken cancellationToken = default)
        {
            var user = await _userRepository.GetByUuidWithRolesAsync(uuid, cancellationToken);
            return user is null ? null : MapToResponse(user);
        }

        public async Task<PagedResultDTO<UserSummaryDTO>> GetPagedAsync(
            string? search, bool? isActive, int page, int pageSize, CancellationToken cancellationToken = default)
        {
            var (items, totalCount) = await _userRepository.GetPagedAsync(search, isActive, page, pageSize, cancellationToken);
            var dtos = items.Select(u => new UserSummaryDTO(
                u.Uuid,
                u.Email,
                u.IsActive,
                u.Customer?.Name,
                u.UserRoles.Select(ur => ur.Role.Name)));
            return new PagedResultDTO<UserSummaryDTO>(dtos, totalCount, page, pageSize);
        }

        public async Task<UserResponseDTO> UpdateAsync(
            Guid uuid, UserUpdateDTO dto, CancellationToken cancellationToken = default)
        {
            var user = await GetTrackedAsync(uuid, cancellationToken);

            if (user.Email != dto.Email && await _userRepository.ExistsByEmailAsync(dto.Email, cancellationToken))
                throw new InvalidOperationException("E-mail já cadastrado.");

            user.Email = dto.Email;
            user.UpdatedAt = DateTime.UtcNow;
            _userRepository.Update(user);
            await _userRepository.SaveChangesAsync(cancellationToken);
            return await BuildResponseAsync(uuid, cancellationToken);
        }

        public async Task AssignRoleAsync(
            Guid userUuid, Guid roleUuid, CancellationToken cancellationToken = default)
        {
            var user = await GetTrackedAsync(userUuid, cancellationToken);
            var role = await _roleRepository.GetByUuidAsync(roleUuid, cancellationToken)
                ?? throw new KeyNotFoundException("Role não encontrada.");

            var alreadyHas = await _context.UserRoles
                .AnyAsync(ur => ur.UserId == user.Id && ur.RoleId == role.Id, cancellationToken);
            if (!alreadyHas)
            {
                _context.UserRoles.Add(new UserRoleModel { UserId = user.Id, RoleId = role.Id });
                await _context.SaveChangesAsync(cancellationToken);
            }
        }

        public async Task RemoveRoleAsync(
            Guid userUuid, Guid roleUuid, CancellationToken cancellationToken = default)
        {
            var user = await GetTrackedAsync(userUuid, cancellationToken);
            var role = await _roleRepository.GetByUuidAsync(roleUuid, cancellationToken)
                ?? throw new KeyNotFoundException("Role não encontrada.");

            var userRole = await _context.UserRoles
                .FirstOrDefaultAsync(ur => ur.UserId == user.Id && ur.RoleId == role.Id, cancellationToken);
            if (userRole is not null)
            {
                _context.UserRoles.Remove(userRole);
                await _context.SaveChangesAsync(cancellationToken);
            }
        }

        public async Task DeactivateAsync(Guid uuid, CancellationToken cancellationToken = default)
        {
            var user = await GetTrackedAsync(uuid, cancellationToken);
            user.IsActive = false;
            user.UpdatedAt = DateTime.UtcNow;
            _userRepository.Update(user);
            await _userRepository.SaveChangesAsync(cancellationToken);
        }

        public async Task ChangePasswordAsync(
            Guid uuid, string currentPassword, string newPassword, CancellationToken cancellationToken = default)
        {
            var user = await GetTrackedAsync(uuid, cancellationToken);
            if (!BCrypt.Net.BCrypt.Verify(currentPassword, user.PasswordHash))
                throw new UnauthorizedAccessException("Senha atual incorreta.");
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
            user.UpdatedAt = DateTime.UtcNow;
            _userRepository.Update(user);
            await _userRepository.SaveChangesAsync(cancellationToken);
        }

        // ── Helpers ──────────────────────────────────────────────────────────

        private async Task<UserModel> GetTrackedAsync(Guid uuid, CancellationToken ct)
            => await _context.Users.FirstOrDefaultAsync(u => u.Uuid == uuid, ct)
               ?? throw new KeyNotFoundException($"Usuário {uuid} não encontrado.");

        private async Task<UserResponseDTO> BuildResponseAsync(
            Guid uuid, CancellationToken ct)
        {
            var user = await _userRepository.GetByUuidWithRolesAsync(uuid, ct)
                ?? throw new KeyNotFoundException("Usuário não encontrado.");
            return MapToResponse(user);
        }

        private static UserResponseDTO MapToResponse(UserModel u) => new(
            u.Uuid,
            u.Email,
            u.IsActive,
            u.CreatedAt,
            u.UpdatedAt,
            u.Customer?.Uuid,
            u.Customer?.Name,
            u.UserRoles.Select(ur => ur.Role.Name));
    }
}
