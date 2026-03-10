using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using ProjetoLES.Server.Models;
using ProjetoLES.Server.Models.Base;

namespace ProjetoLES.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            // Suprime o aviso de validação de RelationShip com filtro de soft-delete
            // e o warning de pending changes do EF 10 que ocorre com HasQueryFilter
            optionsBuilder.ConfigureWarnings(w =>
            {
                w.Ignore(RelationalEventId.PendingModelChangesWarning);
                w.Ignore(CoreEventId.ManyServiceProvidersCreatedWarning);
            });
        }

        public DbSet<CustomerModel> Customers => Set<CustomerModel>();
        public DbSet<CustomerPhoneModel> CustomerPhones => Set<CustomerPhoneModel>();
        public DbSet<CustomerAddressModel> CustomerAddresses => Set<CustomerAddressModel>();
        public DbSet<CreditCardModel> CreditCards => Set<CreditCardModel>();
        public DbSet<CardBrandModel> CardBrands => Set<CardBrandModel>();
        public DbSet<TransactionModel> Transactions => Set<TransactionModel>();
        public DbSet<UserModel> Users => Set<UserModel>();
        public DbSet<RoleModel> Roles => Set<RoleModel>();
        public DbSet<UserRoleModel> UserRoles => Set<UserRoleModel>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ── BaseEntity: Id autoincrement + Uuid ───────────────────────────
            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                if (typeof(BaseEntity).IsAssignableFrom(entityType.ClrType))
                {
                    modelBuilder.Entity(entityType.ClrType)
                        .Property(nameof(BaseEntity.Id))
                        .ValueGeneratedOnAdd();

                    modelBuilder.Entity(entityType.ClrType)
                        .Property(nameof(BaseEntity.Uuid))
                        .HasDefaultValueSql("(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))");

                    modelBuilder.Entity(entityType.ClrType)
                        .HasIndex(nameof(BaseEntity.Uuid))
                        .IsUnique();
                }
            }

            // ── Soft-delete global query filters ─────────────────────────────
            modelBuilder.Entity<CustomerModel>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<CustomerPhoneModel>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<CustomerAddressModel>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<CreditCardModel>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<CardBrandModel>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<TransactionModel>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<UserModel>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<RoleModel>().HasQueryFilter(e => !e.IsDeleted);

            // ── Customer ───────────────────────────────────────────────────────
            modelBuilder.Entity<CustomerModel>(e =>
            {
                e.ToTable("Customers");
                e.HasIndex(c => c.CustomerCode).IsUnique();
                e.HasIndex(c => c.Cpf).IsUnique();
                e.HasIndex(c => c.Email).IsUnique();

                e.Property(c => c.CustomerCode).IsRequired().HasMaxLength(20);
                e.Property(c => c.Name).IsRequired().HasMaxLength(200);
                e.Property(c => c.Cpf).IsRequired().HasMaxLength(11);
                e.Property(c => c.Email).IsRequired().HasMaxLength(255);
                e.Property(c => c.PasswordHash).IsRequired();
                e.Property(c => c.Gender).HasConversion<int>();
            });

            // ── CustomerPhone ──────────────────────────────────────────────────
            modelBuilder.Entity<CustomerPhoneModel>(e =>
            {
                e.ToTable("CustomerPhones");
                e.Property(p => p.AreaCode).IsRequired().HasMaxLength(3);
                e.Property(p => p.Number).IsRequired().HasMaxLength(15);
                e.Property(p => p.PhoneType).HasConversion<int>();

                e.HasOne(p => p.Customer)
                 .WithMany(c => c.Phones)
                 .HasForeignKey(p => p.CustomerId)
                 .OnDelete(DeleteBehavior.Cascade);
            });

            // ── CustomerAddress ────────────────────────────────────────────────
            modelBuilder.Entity<CustomerAddressModel>(e =>
            {
                e.ToTable("CustomerAddresses");
                e.Property(a => a.Label).IsRequired().HasMaxLength(100);
                e.Property(a => a.StreetType).IsRequired().HasMaxLength(50);
                e.Property(a => a.Street).IsRequired().HasMaxLength(200);
                e.Property(a => a.Number).IsRequired().HasMaxLength(20);
                e.Property(a => a.Neighborhood).IsRequired().HasMaxLength(100);
                e.Property(a => a.ZipCode).IsRequired().HasMaxLength(10);
                e.Property(a => a.City).IsRequired().HasMaxLength(100);
                e.Property(a => a.State).IsRequired().HasMaxLength(50);
                e.Property(a => a.Country).IsRequired().HasMaxLength(50);
                e.Property(a => a.Observations).HasMaxLength(500);
                e.Property(a => a.ResidenceType).HasConversion<int>();
                e.Property(a => a.AddressType).HasConversion<int>();

                e.HasOne(a => a.Customer)
                 .WithMany(c => c.Addresses)
                 .HasForeignKey(a => a.CustomerId)
                 .OnDelete(DeleteBehavior.Cascade);
            });

            // ── CardBrand ──────────────────────────────────────────────────────
            modelBuilder.Entity<CardBrandModel>(e =>
            {
                e.ToTable("CardBrands");
                e.Property(b => b.Name).IsRequired().HasMaxLength(50);
                e.HasIndex(b => b.Name).IsUnique();
            });

            // ── CreditCard ─────────────────────────────────────────────────────
            modelBuilder.Entity<CreditCardModel>(e =>
            {
                e.ToTable("CreditCards");
                e.Property(c => c.CardNumber).IsRequired().HasMaxLength(20);
                e.Property(c => c.PrintedName).IsRequired().HasMaxLength(100);
                e.Property(c => c.SecurityCode).IsRequired().HasMaxLength(255);

                e.HasOne(c => c.Customer)
                 .WithMany(cu => cu.CreditCards)
                 .HasForeignKey(c => c.CustomerId)
                 .OnDelete(DeleteBehavior.Cascade);

                e.HasOne(c => c.CardBrand)
                 .WithMany(b => b.CreditCards)
                 .HasForeignKey(c => c.CardBrandId)
                 .OnDelete(DeleteBehavior.Restrict);
            });

            // ── Transaction ────────────────────────────────────────────────────
            modelBuilder.Entity<TransactionModel>(e =>
            {
                e.ToTable("Transactions");
                e.Property(t => t.Amount).HasColumnType("decimal(18,2)");
                e.Property(t => t.Description).HasMaxLength(500);
                e.Property(t => t.Status).IsRequired().HasMaxLength(50);

                e.HasOne(t => t.Customer)
                 .WithMany(c => c.Transactions)
                 .HasForeignKey(t => t.CustomerId)
                 .OnDelete(DeleteBehavior.Cascade);

                e.HasOne(t => t.CreditCard)
                 .WithMany()
                 .HasForeignKey(t => t.CreditCardId)
                 .OnDelete(DeleteBehavior.SetNull);
            });

            // ── Role ───────────────────────────────────────────────────────────
            modelBuilder.Entity<RoleModel>(e =>
            {
                e.ToTable("Roles");
                e.Property(r => r.Name).IsRequired().HasMaxLength(50);
                e.HasIndex(r => r.Name).IsUnique();
                e.Property(r => r.Description).HasMaxLength(200);

                e.HasData(
                    new RoleModel { Id = 1, Uuid = Guid.Parse("11111111-0000-4000-8000-000000000001"), Name = "Admin", Description = "Administrador do sistema", IsActive = true },
                    new RoleModel { Id = 2, Uuid = Guid.Parse("11111111-0000-4000-8000-000000000002"), Name = "Employee", Description = "Funcionário", IsActive = true },
                    new RoleModel { Id = 3, Uuid = Guid.Parse("11111111-0000-4000-8000-000000000003"), Name = "Customer", Description = "Cliente", IsActive = true }
                );
            });

            // ── User ───────────────────────────────────────────────────────────
            modelBuilder.Entity<UserModel>(e =>
            {
                e.ToTable("Users");
                e.HasIndex(u => u.Email).IsUnique();
                // Username é o nome de exibição do usuário, não um identificador único — login é sempre por Email
                e.Property(u => u.Username).IsRequired().HasMaxLength(200);
                e.Property(u => u.Email).IsRequired().HasMaxLength(255);
                e.Property(u => u.PasswordHash).IsRequired();

                e.HasOne(u => u.Customer)
                 .WithOne(c => c.User)
                 .HasForeignKey<UserModel>(u => u.CustomerId)
                 .OnDelete(DeleteBehavior.SetNull);
            });

            // ── UserRole (tabela de junção) ────────────────────────────────────
            modelBuilder.Entity<UserRoleModel>(e =>
            {
                e.ToTable("UserRoles");
                e.HasKey(ur => new { ur.UserId, ur.RoleId });

                e.HasOne(ur => ur.User)
                 .WithMany(u => u.UserRoles)
                 .HasForeignKey(ur => ur.UserId)
                 .OnDelete(DeleteBehavior.Cascade);

                e.HasOne(ur => ur.Role)
                 .WithMany(r => r.UserRoles)
                 .HasForeignKey(ur => ur.RoleId)
                 .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
