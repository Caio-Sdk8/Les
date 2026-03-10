using ProjetoLES.Server.Models.Base;

namespace ProjetoLES.Server.Models
{
    public class RoleModel : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;

        public ICollection<UserRoleModel> UserRoles { get; set; } = new List<UserRoleModel>();
    }
}
