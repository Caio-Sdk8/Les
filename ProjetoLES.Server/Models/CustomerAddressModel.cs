using ProjetoLES.Server.Enums;
using ProjetoLES.Server.Models.Base;

namespace ProjetoLES.Server.Models
{
    public class CustomerAddressModel : BaseEntity
    {
        public int CustomerId { get; set; }

        public AddressTypeEnum AddressType { get; set; }

        public string Label { get; set; } = string.Empty;

        public ResidenceTypeEnum ResidenceType { get; set; }

        public string StreetType { get; set; } = string.Empty;

        public string Street { get; set; } = string.Empty;
        public string Number { get; set; } = string.Empty;
        public string Neighborhood { get; set; } = string.Empty;
        public string ZipCode { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;

        public string? Observations { get; set; }

        public bool IsActive { get; set; } = true;

        public CustomerModel Customer { get; set; } = null!;
    }
}
