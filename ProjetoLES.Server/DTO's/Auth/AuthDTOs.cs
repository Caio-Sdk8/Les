namespace ProjetoLES.Server.DTO_s.Auth
{
    public record LoginRequestDTO(
        string Email,
        string Password);

    public record LoginResponseDTO(
        string Token,
        DateTime ExpiresAt,
        AuthUserDTO User);

    public record AuthUserDTO(
        Guid Uuid,
        string Username,
        string Email,
        IEnumerable<string> Roles);
}
