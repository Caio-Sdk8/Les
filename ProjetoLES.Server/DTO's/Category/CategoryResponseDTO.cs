namespace ProjetoLES.Server.DTO_s.Category
{
    public record CategoryResponseDTO(
        Guid Uuid,
        string Name,
        string? Description,
        bool IsActive
    );
}
