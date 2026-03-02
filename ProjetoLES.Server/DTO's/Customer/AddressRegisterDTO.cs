using ProjetoLES.Server.Enums;

namespace ProjetoLES.Server.DTO_s.Customer
{
    public record AddressRegisterDTO
    (
        ResidenceTypeEnum ResidenceType,
        string StreetType,
        string Street,
        string Number,
        string Neighborhood,
        string ZipCode,
        string City,
        string State,
        string Country,
        string? Label = null,
        string? Observations = null
    );
}
