using ProjetoLES.Server.Models.Base;

namespace ProjetoLES.Server.Models
{
    public class UserModel : BaseEntity
    {
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // ── Vínculo opcional com cliente ─────────────────────────────────────
        public int? CustomerId { get; set; }
        public CustomerModel? Customer { get; set; }

        public ICollection<UserRoleModel> UserRoles { get; set; } = new List<UserRoleModel>();
    }
}
