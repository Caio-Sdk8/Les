namespace ProjetoLES.Server.DTO_s.User
{
    public record UserCreateDTO(
        string Username,
        string Email,
        string Password,
        string PasswordConfirmation,
        Guid? CustomerUuid,
        IEnumerable<Guid>? RoleUuids);

    public record UserUpdateDTO(
        string Username,
        string Email);

    public record UserChangePasswordDTO(
        string CurrentPassword,
        string NewPassword,
        string NewPasswordConfirmation);

    public record UserResponseDTO(
        Guid Uuid,
        string Username,
        string Email,
        bool IsActive,
        DateTime CreatedAt,
        DateTime UpdatedAt,
        Guid? CustomerUuid,
        IEnumerable<string> Roles);

    public record UserSummaryDTO(
        Guid Uuid,
        string Username,
        string Email,
        bool IsActive,
        IEnumerable<string> Roles);
}
