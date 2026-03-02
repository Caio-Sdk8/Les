using ProjetoLES.Server.Enums;
using System.Reflection;

namespace ProjetoLES.Server.DTO_s.Customer
{
    public record CustomerCreateDTO(
    string Name,
    GenderEnum Gender,
    DateOnly BirthDate,
    string Cpf,
    string Email,
    string Password,
    string PasswordConfirmation
);

    public record CustomerUpdateDTO(
        string Name,
        GenderEnum Gender,
        DateOnly BirthDate,
        string Email
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
        string Email,
        bool IsActive,
        int Ranking,
        DateTime CreatedAt,
        DateTime UpdatedAt
    );

    public record CustomerSummaryDTO(
        Guid Uuid,
        string CustomerCode,
        string Name,
        string Email,
        string Cpf,
        bool IsActive,
        int Ranking
    );

    public record CustomerFilterDTO(
        string? Name = null,
        string? Email = null,
        string? Cpf = null,
        string? CustomerCode = null,
        bool? IsActive = null,
        int Page = 1,
        int PageSize = 20
    );
}
