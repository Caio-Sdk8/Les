using ProjetoLES.Server.Enums;

namespace ProjetoLES.Server.DTO_s.Phone
{
    public record PhoneCreateDTO(
        PhoneTypeEnum PhoneType,
        string AreaCode,
        string Number,
        bool IsMain
    );

    public record PhoneResponseDTO(
        Guid Uuid,
        PhoneTypeEnum PhoneType,
        string AreaCode,
        string Number,
        bool IsMain
    );
}
