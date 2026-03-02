using ProjetoLES.Server.Enums;
using ProjetoLES.Server.Models.Base;
using System.Reflection;

namespace ProjetoLES.Server.Models
{
    public class CustomerModel : BaseEntity
    {
        public string CustomerCode { get; set; } = string.Empty;

        public string Name { get; set; } = string.Empty;
        public GenderEnum Gender { get; set; }
        public DateOnly BirthDate { get; set; }

        public string Cpf { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string PasswordHash { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;

        public int Ranking { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<CustomerPhoneModel> Phones { get; set; } = new List<CustomerPhoneModel>();
        public ICollection<CustomerAddressModel> Addresses { get; set; } = new List<CustomerAddressModel>();
        public ICollection<CreditCardModel> CreditCards { get; set; } = new List<CreditCardModel>();
        public ICollection<TransactionModel> Transactions { get; set; } = new List<TransactionModel>();
    }
}
