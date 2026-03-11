namespace ProjetoLES.Server.DTO_s.User
{
    // Usuário criado pelo admin — login é sempre por email
    public record UserCreateDTO(
        string Email,
        string Password,
        string PasswordConfirmation,
        Guid? CustomerUuid,
        IEnumerable<Guid>? RoleUuids);

    public record UserUpdateDTO(
        string Email);

    public record UserChangePasswordDTO(
        string CurrentPassword,
        string NewPassword,
        string NewPasswordConfirmation);

    public record UserResponseDTO(
        Guid Uuid,
        string Email,
        bool IsActive,
        DateTime CreatedAt,
        DateTime UpdatedAt,
        Guid? CustomerUuid,
        string? CustomerName,
        IEnumerable<string> Roles);

    public record UserSummaryDTO(
        Guid Uuid,
        string Email,
        bool IsActive,
        string? CustomerName,
        IEnumerable<string> Roles);
}
