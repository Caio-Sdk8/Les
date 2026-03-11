using ProjetoLES.Server.Enums;

namespace ProjetoLES.Server.DTO_s.Customer
{
    // Criação pelo admin — apenas dados de perfil; credenciais ficam em UserModel
    public record CustomerCreateDTO(
        string Name,
        GenderEnum Gender,
        DateOnly BirthDate,
        string Cpf,
        int Ranking = 0
    );

    // Atualização de perfil — email e senha gerenciados via UserModel
    public record CustomerUpdateDTO(
        string Name,
        GenderEnum Gender,
        DateOnly BirthDate
    );

    public record CustomerChangePasswordDTO(
        string CurrentPassword,
        string NewPassword,
        string NewPasswordConfirmation
    );

    // Email é opcional: null quando o cliente ainda não tem conta de usuário vinculada
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
        DateTime UpdatedAt
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
