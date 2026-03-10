namespace ProjetoLES.Server.Models.Base
{
    public abstract class BaseEntity
    {
        public int Id { get; set; }
        public Guid Uuid { get; set; } = Guid.NewGuid();

        // ── Soft-delete ─────────────────────────────────────────────────────
        public bool IsDeleted { get; set; } = false;
        public DateTime? DeletedAt { get; set; }
    }
}
