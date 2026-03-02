using ProjetoLES.Server.Enums;
using ProjetoLES.Server.Models.Base;

namespace ProjetoLES.Server.Models
{
    public class CustomerPhoneModel : BaseEntity
    {
        public int CustomerId { get; set; }
        public PhoneTypeEnum PhoneType { get; set; }

        public string AreaCode { get; set; } = string.Empty;

        public string Number { get; set; } = string.Empty;

        public bool IsMain { get; set; } = false;

        public CustomerModel Customer { get; set; } = null!;
    }
}
