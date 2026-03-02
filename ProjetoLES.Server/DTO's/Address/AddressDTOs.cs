using ProjetoLES.Server.Enums;

namespace ProjetoLES.Server.DTO_s.Address
{
    public record AddressCreateDTO(
        AddressTypeEnum AddressType,
        string Label,
        ResidenceTypeEnum ResidenceType,
        string StreetType,
        string Street,
        string Number,
        string Neighborhood,
        string ZipCode,
        string City,
        string State,
        string Country,
        string? Observations
    );

    public record AddressUpdateDTO(
        AddressTypeEnum AddressType,
        string Label,
        ResidenceTypeEnum ResidenceType,
        string StreetType,
        string Street,
        string Number,
        string Neighborhood,
        string ZipCode,
        string City,
        string State,
        string Country,
        string? Observations
    );

    public record AddressResponseDTO(
        Guid Uuid,
        AddressTypeEnum AddressType,
        string Label,
        ResidenceTypeEnum ResidenceType,
        string StreetType,
        string Street,
        string Number,
        string Neighborhood,
        string ZipCode,
        string City,
        string State,
        string Country,
        string? Observations,
        bool IsActive
    );
}
