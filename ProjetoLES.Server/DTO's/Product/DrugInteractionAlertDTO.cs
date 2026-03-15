namespace ProjetoLES.Server.DTO_s.Product
{
    public record DrugInteractionAlertDTO(
        Guid ProductAUuid,
        string ProductAName,
        Guid ProductBUuid,
        string ProductBName,
        string Description,
        int SeverityLevel
    );
}
