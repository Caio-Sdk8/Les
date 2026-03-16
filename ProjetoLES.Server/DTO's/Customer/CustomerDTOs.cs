using ProjetoLES.Server.DTO_s.Phone;
using ProjetoLES.Server.Enums;

namespace ProjetoLES.Server.DTO_s.Customer
{
    public record CustomerCreateDTO(
        string Name,
        GenderEnum Gender,
        DateOnly BirthDate,
        string Cpf,
        int Ranking = 0
    );

    public record CustomerUpdateDTO(
        string Name,
        GenderEnum Gender,
        DateOnly BirthDate,
        string Email,
        IEnumerable<PhoneCreateDTO> Phones
    );

    public record CustomerChangePasswordDTO(
        string CurrentPassword,
        string NewPassword,
        string NewPasswordConfirmation
    );

    public record CustomerResponseDTO(
        Guid Uuid,
        string CustomerCode,
        string Name,
        GenderEnum Gender,
        DateOnly BirthDate,
        string Cpf,
        string? Email,
        bool IsActive,
        int Ranking,
        DateTime CreatedAt,
        DateTime UpdatedAt,
        IEnumerable<PhoneResponseDTO> Phones
    );

    public record CustomerSummaryDTO(
        Guid Uuid,
        string CustomerCode,
        string Name,
        string? Email,
        string Cpf,
        bool IsActive,
        int Ranking
    );

    public record CustomerFilterDTO(
        string? Search = null,
        string? Name = null,
        string? Email = null,
        string? Cpf = null,
        string? CustomerCode = null,
        bool? IsActive = null,
        int Page = 1,
        int PageSize = 20
    );
}
