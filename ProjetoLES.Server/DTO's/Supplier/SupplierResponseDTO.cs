namespace ProjetoLES.Server.DTO_s.Supplier
{
    public record SupplierResponseDTO(
        Guid Uuid,
        string Name,
        string Cnpj,
        string? ContactEmail,
        string? ContactPhone,
        bool IsActive
    );
}
