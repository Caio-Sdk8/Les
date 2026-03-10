namespace ProjetoLES.Server.DTO_s.Role
{
    public record RoleCreateDTO(
        string Name,
        string Description);

    public record RoleResponseDTO(
        Guid Uuid,
        string Name,
        string Description,
        bool IsActive);
}
