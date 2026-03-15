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

        // ── Produtos / Estoque ────────────────────────────────────────────────
        public DbSet<CategoryModel> Categories => Set<CategoryModel>();
        public DbSet<PricingGroupModel> PricingGroups => Set<PricingGroupModel>();
        public DbSet<SupplierModel> Suppliers => Set<SupplierModel>();
        public DbSet<ProductModel> Products => Set<ProductModel>();
        public DbSet<ProductCategoryModel> ProductCategories => Set<ProductCategoryModel>();
        public DbSet<StockEntryModel> StockEntries => Set<StockEntryModel>();
        public DbSet<ProductStockModel> ProductStocks => Set<ProductStockModel>();
        public DbSet<DrugInteractionModel> DrugInteractions => Set<DrugInteractionModel>();

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
            modelBuilder.Entity<ProductModel>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<CategoryModel>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<PricingGroupModel>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<SupplierModel>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<StockEntryModel>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<ProductStockModel>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<DrugInteractionModel>().HasQueryFilter(e => !e.IsDeleted);

            // ── Customer ───────────────────────────────────────────────────────
            modelBuilder.Entity<CustomerModel>(e =>
            {
                e.ToTable("Customers");
                e.HasIndex(c => c.CustomerCode).IsUnique();
                e.HasIndex(c => c.Cpf).IsUnique();

                e.Property(c => c.CustomerCode).IsRequired().HasMaxLength(20);
                e.Property(c => c.Name).IsRequired().HasMaxLength(200);
                e.Property(c => c.Cpf).IsRequired().HasMaxLength(11);
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

                e.HasData(
                    new CardBrandModel { Id = 1, Uuid = Guid.Parse("22222222-0000-4000-8000-000000000001"), Name = "Visa", IsActive = true },
                    new CardBrandModel { Id = 2, Uuid = Guid.Parse("22222222-0000-4000-8000-000000000002"), Name = "Mastercard", IsActive = true },
                    new CardBrandModel { Id = 3, Uuid = Guid.Parse("22222222-0000-4000-8000-000000000003"), Name = "Elo", IsActive = true },
                    new CardBrandModel { Id = 4, Uuid = Guid.Parse("22222222-0000-4000-8000-000000000004"), Name = "American Express", IsActive = true },
                    new CardBrandModel { Id = 5, Uuid = Guid.Parse("22222222-0000-4000-8000-000000000005"), Name = "Hipercard", IsActive = true },
                    new CardBrandModel { Id = 6, Uuid = Guid.Parse("22222222-0000-4000-8000-000000000006"), Name = "Hiper", IsActive = true },
                    new CardBrandModel { Id = 7, Uuid = Guid.Parse("22222222-0000-4000-8000-000000000007"), Name = "Diners Club", IsActive = true },
                    new CardBrandModel { Id = 8, Uuid = Guid.Parse("22222222-0000-4000-8000-000000000008"), Name = "Cabal", IsActive = true }
                );
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

            // ── Category ───────────────────────────────────────────────────────
            modelBuilder.Entity<CategoryModel>(e =>
            {
                e.ToTable("Categories");
                e.Property(c => c.Name).IsRequired().HasMaxLength(100);
                e.HasIndex(c => c.Name).IsUnique();
                e.Property(c => c.Description).HasMaxLength(500);

                e.HasData(
                    new CategoryModel { Id = 1, Uuid = Guid.Parse("33333333-0000-4000-8000-000000000001"), Name = "Medicamentos", Description = "Medicamentos em geral", IsActive = true },
                    new CategoryModel { Id = 2, Uuid = Guid.Parse("33333333-0000-4000-8000-000000000002"), Name = "Dor e Febre", Description = "Analgésicos e antitérmicos", IsActive = true },
                    new CategoryModel { Id = 3, Uuid = Guid.Parse("33333333-0000-4000-8000-000000000003"), Name = "Bem-estar", Description = "Saúde e bem-estar", IsActive = true },
                    new CategoryModel { Id = 4, Uuid = Guid.Parse("33333333-0000-4000-8000-000000000004"), Name = "Alergia", Description = "Antialérgicos", IsActive = true },
                    new CategoryModel { Id = 5, Uuid = Guid.Parse("33333333-0000-4000-8000-000000000005"), Name = "Digestivo", Description = "Saúde digestiva", IsActive = true },
                    new CategoryModel { Id = 6, Uuid = Guid.Parse("33333333-0000-4000-8000-000000000006"), Name = "Vitaminas", Description = "Vitaminas e suplementos", IsActive = true },
                    new CategoryModel { Id = 7, Uuid = Guid.Parse("33333333-0000-4000-8000-000000000007"), Name = "Higiene", Description = "Higiene pessoal", IsActive = true },
                    new CategoryModel { Id = 8, Uuid = Guid.Parse("33333333-0000-4000-8000-000000000008"), Name = "Dermocosméticos", Description = "Cosméticos e cuidados com a pele", IsActive = true },
                    new CategoryModel { Id = 9, Uuid = Guid.Parse("33333333-0000-4000-8000-000000000009"), Name = "Antibióticos", Description = "Antibióticos e antimicrobianos", IsActive = true },
                    new CategoryModel { Id = 10, Uuid = Guid.Parse("33333333-0000-4000-8000-000000000010"), Name = "Tarja Vermelha", Description = "Medicamentos sob prescrição médica", IsActive = true }
                );
            });

            // ── PricingGroup ────────────────────────────────────────────────────
            modelBuilder.Entity<PricingGroupModel>(e =>
            {
                e.ToTable("PricingGroups");
                e.Property(pg => pg.Name).IsRequired().HasMaxLength(100);
                e.HasIndex(pg => pg.Name).IsUnique();
                e.Property(pg => pg.Description).HasMaxLength(500);
                e.Property(pg => pg.ProfitMarginPercent).HasColumnType("decimal(6,2)");

                e.HasData(
                    new PricingGroupModel { Id = 1, Uuid = Guid.Parse("44444444-0000-4000-8000-000000000001"), Name = "Padrão", Description = "Margem padrão de 30%", ProfitMarginPercent = 30m, IsActive = true },
                    new PricingGroupModel { Id = 2, Uuid = Guid.Parse("44444444-0000-4000-8000-000000000002"), Name = "Premium", Description = "Margem de 50% para produtos premium", ProfitMarginPercent = 50m, IsActive = true },
                    new PricingGroupModel { Id = 3, Uuid = Guid.Parse("44444444-0000-4000-8000-000000000003"), Name = "Genérico", Description = "Margem reduzida de 20% para genéricos", ProfitMarginPercent = 20m, IsActive = true },
                    new PricingGroupModel { Id = 4, Uuid = Guid.Parse("44444444-0000-4000-8000-000000000004"), Name = "Suplemento", Description = "Margem de 40% para suplementos e vitaminas", ProfitMarginPercent = 40m, IsActive = true }
                );
            });

            // ── Supplier ────────────────────────────────────────────────────────
            modelBuilder.Entity<SupplierModel>(e =>
            {
                e.ToTable("Suppliers");
                e.Property(s => s.Name).IsRequired().HasMaxLength(200);
                e.Property(s => s.Cnpj).IsRequired().HasMaxLength(18);
                e.HasIndex(s => s.Cnpj).IsUnique();
                e.Property(s => s.ContactEmail).HasMaxLength(255);
                e.Property(s => s.ContactPhone).HasMaxLength(20);

                e.HasData(
                    new SupplierModel { Id = 1, Uuid = Guid.Parse("55555555-0000-4000-8000-000000000001"), Name = "EMS Sigma Pharma", Cnpj = "57.507.378/0001-41", ContactEmail = "comercial@ems.com.br", ContactPhone = "11999990001", IsActive = true },
                    new SupplierModel { Id = 2, Uuid = Guid.Parse("55555555-0000-4000-8000-000000000002"), Name = "Eurofarma", Cnpj = "61.190.096/0001-92", ContactEmail = "vendas@eurofarma.com.br", ContactPhone = "11999990002", IsActive = true },
                    new SupplierModel { Id = 3, Uuid = Guid.Parse("55555555-0000-4000-8000-000000000003"), Name = "Hypera Pharma", Cnpj = "02.932.074/0001-91", ContactEmail = "pedidos@hypera.com.br", ContactPhone = "11999990003", IsActive = true },
                    new SupplierModel { Id = 4, Uuid = Guid.Parse("55555555-0000-4000-8000-000000000004"), Name = "Aché Laboratórios", Cnpj = "60.659.463/0001-91", ContactEmail = "vendas@ache.com.br", ContactPhone = "11999990004", IsActive = true },
                    new SupplierModel { Id = 5, Uuid = Guid.Parse("55555555-0000-4000-8000-000000000005"), Name = "Medley", Cnpj = "10.588.595/0001-03", ContactEmail = "comercial@medley.com.br", ContactPhone = "11999990005", IsActive = true },
                    new SupplierModel { Id = 6, Uuid = Guid.Parse("55555555-0000-4000-8000-000000000006"), Name = "Neo Química", Cnpj = "62.641.224/0001-01", ContactEmail = "atendimento@neoquimica.com.br", ContactPhone = "11999990006", IsActive = true }
                );
            });

            // ── Product ─────────────────────────────────────────────────────────
            modelBuilder.Entity<ProductModel>(e =>
            {
                e.ToTable("Products");
                e.HasIndex(p => p.ProductCode).IsUnique();
                e.HasIndex(p => p.Barcode).IsUnique();
                e.Property(p => p.ProductCode).IsRequired().HasMaxLength(30);
                e.Property(p => p.Name).IsRequired().HasMaxLength(200);
                e.Property(p => p.Description).HasMaxLength(1000);
                e.Property(p => p.ActivePrinciple).HasMaxLength(300);
                e.Property(p => p.Barcode).IsRequired().HasMaxLength(50);
                e.Property(p => p.ImageUrl).HasMaxLength(1000);
                e.Property(p => p.HeightCm).HasColumnType("decimal(8,2)");
                e.Property(p => p.WidthCm).HasColumnType("decimal(8,2)");
                e.Property(p => p.DepthCm).HasColumnType("decimal(8,2)");
                e.Property(p => p.WeightGrams).HasColumnType("decimal(10,2)");
                e.Property(p => p.SalePrice).HasColumnType("decimal(18,2)");
                e.Property(p => p.PrescriptionType).HasConversion<int>();
                e.Property(p => p.InactivationCategory).HasConversion<int?>();
                e.Property(p => p.InactivationReason).HasMaxLength(500);
                e.Property(p => p.ActivationReason).HasMaxLength(500);

                e.HasOne(p => p.PricingGroup)
                 .WithMany(pg => pg.Products)
                 .HasForeignKey(p => p.PricingGroupId)
                 .OnDelete(DeleteBehavior.Restrict);

                e.HasData(
                    new ProductModel { Id = 1, Uuid = Guid.Parse("66666666-0000-4000-8000-000000000001"), ProductCode = "PROD0001", Name = "Tylenol 750mg", ActivePrinciple = "Paracetamol 750mg", Barcode = "7891234500001", PrescriptionType = Enums.PrescriptionTypeEnum.None, PricingGroupId = 2, SalePrice = 24.90m, IsActive = true, Description = "Medicamento de referência para dor e febre.", ImageUrl = "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=420&h=420&fit=crop&q=80", CreatedAt = new DateTime(2026, 3, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 3, 1, 0, 0, 0, DateTimeKind.Utc) },
                    new ProductModel { Id = 2, Uuid = Guid.Parse("66666666-0000-4000-8000-000000000002"), ProductCode = "PROD0002", Name = "Paracetamol Genérico 750mg", ActivePrinciple = "Paracetamol 750mg", Barcode = "7891234500002", PrescriptionType = Enums.PrescriptionTypeEnum.None, PricingGroupId = 3, SalePrice = 13.90m, IsActive = true, Description = "Opção genérica para alívio de dor e febre.", ImageUrl = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=420&h=420&fit=crop&q=80", CreatedAt = new DateTime(2026, 3, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 3, 1, 0, 0, 0, DateTimeKind.Utc) },
                    new ProductModel { Id = 3, Uuid = Guid.Parse("66666666-0000-4000-8000-000000000003"), ProductCode = "PROD0003", Name = "Advil 400mg", ActivePrinciple = "Ibuprofeno 400mg", Barcode = "7891234500003", PrescriptionType = Enums.PrescriptionTypeEnum.None, PricingGroupId = 2, SalePrice = 28.90m, IsActive = true, Description = "Analgésico e anti-inflamatório de referência.", ImageUrl = "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=420&h=420&fit=crop&q=80", CreatedAt = new DateTime(2026, 3, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 3, 1, 0, 0, 0, DateTimeKind.Utc) },
                    new ProductModel { Id = 4, Uuid = Guid.Parse("66666666-0000-4000-8000-000000000004"), ProductCode = "PROD0004", Name = "Ibuprofeno Genérico 400mg", ActivePrinciple = "Ibuprofeno 400mg", Barcode = "7891234500004", PrescriptionType = Enums.PrescriptionTypeEnum.None, PricingGroupId = 3, SalePrice = 16.90m, IsActive = true, Description = "Alternativa genérica para dores e inflamações.", ImageUrl = "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=420&h=420&fit=crop&q=80", CreatedAt = new DateTime(2026, 3, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 3, 1, 0, 0, 0, DateTimeKind.Utc) },
                    new ProductModel { Id = 5, Uuid = Guid.Parse("66666666-0000-4000-8000-000000000005"), ProductCode = "PROD0005", Name = "Novalgina 1g", ActivePrinciple = "Dipirona Sódica 1g", Barcode = "7891234500005", PrescriptionType = Enums.PrescriptionTypeEnum.None, PricingGroupId = 2, SalePrice = 21.90m, IsActive = true, Description = "Referência em analgesia e antitérmico.", ImageUrl = "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=420&h=420&fit=crop&q=80", CreatedAt = new DateTime(2026, 3, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 3, 1, 0, 0, 0, DateTimeKind.Utc) },
                    new ProductModel { Id = 6, Uuid = Guid.Parse("66666666-0000-4000-8000-000000000006"), ProductCode = "PROD0006", Name = "Dipirona Genérica 1g", ActivePrinciple = "Dipirona Sódica 1g", Barcode = "7891234500006", PrescriptionType = Enums.PrescriptionTypeEnum.None, PricingGroupId = 3, SalePrice = 12.90m, IsActive = true, Description = "Genérico para dores e febre.", ImageUrl = "https://images.unsplash.com/photo-1550572017-4fade5817617?w=420&h=420&fit=crop&q=80", CreatedAt = new DateTime(2026, 3, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 3, 1, 0, 0, 0, DateTimeKind.Utc) },
                    new ProductModel { Id = 7, Uuid = Guid.Parse("66666666-0000-4000-8000-000000000007"), ProductCode = "PROD0007", Name = "Allegra 120mg", ActivePrinciple = "Fexofenadina 120mg", Barcode = "7891234500007", PrescriptionType = Enums.PrescriptionTypeEnum.None, PricingGroupId = 2, SalePrice = 42.90m, IsActive = true, Description = "Antialérgico de referência para rinite.", ImageUrl = "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=420&h=420&fit=crop&q=80", CreatedAt = new DateTime(2026, 3, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 3, 1, 0, 0, 0, DateTimeKind.Utc) },
                    new ProductModel { Id = 8, Uuid = Guid.Parse("66666666-0000-4000-8000-000000000008"), ProductCode = "PROD0008", Name = "Fexofenadina Genérica 120mg", ActivePrinciple = "Fexofenadina 120mg", Barcode = "7891234500008", PrescriptionType = Enums.PrescriptionTypeEnum.None, PricingGroupId = 3, SalePrice = 24.90m, IsActive = true, Description = "Genérico antialérgico para uso diário.", ImageUrl = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=420&h=420&fit=crop&q=80", CreatedAt = new DateTime(2026, 3, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 3, 1, 0, 0, 0, DateTimeKind.Utc) },
                    new ProductModel { Id = 9, Uuid = Guid.Parse("66666666-0000-4000-8000-000000000009"), ProductCode = "PROD0009", Name = "Claritin 10mg", ActivePrinciple = "Loratadina 10mg", Barcode = "7891234500009", PrescriptionType = Enums.PrescriptionTypeEnum.None, PricingGroupId = 2, SalePrice = 32.90m, IsActive = true, Description = "Referência para alívio de sintomas alérgicos.", ImageUrl = "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=420&h=420&fit=crop&q=80", CreatedAt = new DateTime(2026, 3, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 3, 1, 0, 0, 0, DateTimeKind.Utc) },
                    new ProductModel { Id = 10, Uuid = Guid.Parse("66666666-0000-4000-8000-000000000010"), ProductCode = "PROD0010", Name = "Loratadina Genérica 10mg", ActivePrinciple = "Loratadina 10mg", Barcode = "7891234500010", PrescriptionType = Enums.PrescriptionTypeEnum.None, PricingGroupId = 3, SalePrice = 17.90m, IsActive = true, Description = "Genérico para rinite e urticária.", ImageUrl = "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=420&h=420&fit=crop&q=80", CreatedAt = new DateTime(2026, 3, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 3, 1, 0, 0, 0, DateTimeKind.Utc) },
                    new ProductModel { Id = 11, Uuid = Guid.Parse("66666666-0000-4000-8000-000000000011"), ProductCode = "PROD0011", Name = "Losec Mups 20mg", ActivePrinciple = "Omeprazol 20mg", Barcode = "7891234500011", PrescriptionType = Enums.PrescriptionTypeEnum.None, PricingGroupId = 2, SalePrice = 29.90m, IsActive = true, Description = "Referência para redução da acidez gástrica.", ImageUrl = "https://images.unsplash.com/photo-1550572017-4fade5817617?w=420&h=420&fit=crop&q=80", CreatedAt = new DateTime(2026, 3, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 3, 1, 0, 0, 0, DateTimeKind.Utc) },
                    new ProductModel { Id = 12, Uuid = Guid.Parse("66666666-0000-4000-8000-000000000012"), ProductCode = "PROD0012", Name = "Omeprazol Genérico 20mg", ActivePrinciple = "Omeprazol 20mg", Barcode = "7891234500012", PrescriptionType = Enums.PrescriptionTypeEnum.None, PricingGroupId = 3, SalePrice = 15.90m, IsActive = true, Description = "Genérico para gastrite e refluxo.", ImageUrl = "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=420&h=420&fit=crop&q=80", CreatedAt = new DateTime(2026, 3, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 3, 1, 0, 0, 0, DateTimeKind.Utc) },
                    new ProductModel { Id = 13, Uuid = Guid.Parse("66666666-0000-4000-8000-000000000013"), ProductCode = "PROD0013", Name = "Amoxil 500mg", ActivePrinciple = "Amoxicilina 500mg", Barcode = "7891234500013", PrescriptionType = Enums.PrescriptionTypeEnum.TarjaVermelha, PricingGroupId = 1, SalePrice = 44.90m, IsActive = true, Description = "Antibiótico de referência sob prescrição.", ImageUrl = "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=420&h=420&fit=crop&q=80", CreatedAt = new DateTime(2026, 3, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 3, 1, 0, 0, 0, DateTimeKind.Utc) },
                    new ProductModel { Id = 14, Uuid = Guid.Parse("66666666-0000-4000-8000-000000000014"), ProductCode = "PROD0014", Name = "Amoxicilina Genérica 500mg", ActivePrinciple = "Amoxicilina 500mg", Barcode = "7891234500014", PrescriptionType = Enums.PrescriptionTypeEnum.TarjaVermelha, PricingGroupId = 3, SalePrice = 29.90m, IsActive = true, Description = "Antibiótico genérico sob prescrição médica.", ImageUrl = "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=420&h=420&fit=crop&q=80", CreatedAt = new DateTime(2026, 3, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 3, 1, 0, 0, 0, DateTimeKind.Utc) },
                    new ProductModel { Id = 15, Uuid = Guid.Parse("66666666-0000-4000-8000-000000000015"), ProductCode = "PROD0015", Name = "Cataflam 50mg", ActivePrinciple = "Diclofenaco Potássico 50mg", Barcode = "7891234500015", PrescriptionType = Enums.PrescriptionTypeEnum.TarjaVermelha, PricingGroupId = 1, SalePrice = 31.90m, IsActive = true, Description = "Anti-inflamatório de referência para dor aguda.", ImageUrl = "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=420&h=420&fit=crop&q=80", CreatedAt = new DateTime(2026, 3, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 3, 1, 0, 0, 0, DateTimeKind.Utc) },
                    new ProductModel { Id = 16, Uuid = Guid.Parse("66666666-0000-4000-8000-000000000016"), ProductCode = "PROD0016", Name = "Diclofenaco Potássico Genérico 50mg", ActivePrinciple = "Diclofenaco Potássico 50mg", Barcode = "7891234500016", PrescriptionType = Enums.PrescriptionTypeEnum.TarjaVermelha, PricingGroupId = 3, SalePrice = 19.90m, IsActive = true, Description = "Genérico anti-inflamatório sob prescrição.", ImageUrl = "https://images.unsplash.com/photo-1550572017-4fade5817617?w=420&h=420&fit=crop&q=80", CreatedAt = new DateTime(2026, 3, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 3, 1, 0, 0, 0, DateTimeKind.Utc) },
                    new ProductModel { Id = 17, Uuid = Guid.Parse("66666666-0000-4000-8000-000000000017"), ProductCode = "PROD0017", Name = "Centrum A-Z", ActivePrinciple = "Multivitamínico A-Z", Barcode = "7891234500017", PrescriptionType = Enums.PrescriptionTypeEnum.None, PricingGroupId = 4, SalePrice = 64.90m, IsActive = true, Description = "Suplemento vitamínico completo.", ImageUrl = "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=420&h=420&fit=crop&q=80", CreatedAt = new DateTime(2026, 3, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 3, 1, 0, 0, 0, DateTimeKind.Utc) },
                    new ProductModel { Id = 18, Uuid = Guid.Parse("66666666-0000-4000-8000-000000000018"), ProductCode = "PROD0018", Name = "Multivitamínico Genérico A-Z", ActivePrinciple = "Multivitamínico A-Z", Barcode = "7891234500018", PrescriptionType = Enums.PrescriptionTypeEnum.None, PricingGroupId = 4, SalePrice = 38.90m, IsActive = true, Description = "Suplemento diário de vitaminas e minerais.", ImageUrl = "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=420&h=420&fit=crop&q=80", CreatedAt = new DateTime(2026, 3, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 3, 1, 0, 0, 0, DateTimeKind.Utc) },
                    new ProductModel { Id = 19, Uuid = Guid.Parse("66666666-0000-4000-8000-000000000019"), ProductCode = "PROD0019", Name = "Nimesulida 100mg", ActivePrinciple = "Nimesulida 100mg", Barcode = "7891234500019", PrescriptionType = Enums.PrescriptionTypeEnum.TarjaVermelha, PricingGroupId = 1, SalePrice = 27.90m, IsActive = true, Description = "Anti-inflamatório sob prescrição médica.", ImageUrl = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=420&h=420&fit=crop&q=80", CreatedAt = new DateTime(2026, 3, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 3, 1, 0, 0, 0, DateTimeKind.Utc) },
                    new ProductModel { Id = 20, Uuid = Guid.Parse("66666666-0000-4000-8000-000000000020"), ProductCode = "PROD0020", Name = "Nimesulida Genérica 100mg", ActivePrinciple = "Nimesulida 100mg", Barcode = "7891234500020", PrescriptionType = Enums.PrescriptionTypeEnum.TarjaVermelha, PricingGroupId = 3, SalePrice = 17.90m, IsActive = true, Description = "Genérico anti-inflamatório de uso controlado.", ImageUrl = "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=420&h=420&fit=crop&q=80", CreatedAt = new DateTime(2026, 3, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 3, 1, 0, 0, 0, DateTimeKind.Utc) }
                );
            });

            // ── ProductCategory (N:N join) ────────────────────────────────────
            modelBuilder.Entity<ProductCategoryModel>(e =>
            {
                e.ToTable("ProductCategories");
                e.HasKey(pc => new { pc.ProductId, pc.CategoryId });

                e.HasOne(pc => pc.Product)
                 .WithMany(p => p.ProductCategories)
                 .HasForeignKey(pc => pc.ProductId)
                 .OnDelete(DeleteBehavior.Cascade);

                e.HasOne(pc => pc.Category)
                 .WithMany(c => c.ProductCategories)
                 .HasForeignKey(pc => pc.CategoryId)
                 .OnDelete(DeleteBehavior.Cascade);

                // Seed: associação produto–categoria
                e.HasData(
                    new ProductCategoryModel { ProductId = 1, CategoryId = 1 },
                    new ProductCategoryModel { ProductId = 1, CategoryId = 2 },
                    new ProductCategoryModel { ProductId = 2, CategoryId = 1 },
                    new ProductCategoryModel { ProductId = 2, CategoryId = 2 },
                    new ProductCategoryModel { ProductId = 3, CategoryId = 1 },
                    new ProductCategoryModel { ProductId = 3, CategoryId = 2 },
                    new ProductCategoryModel { ProductId = 4, CategoryId = 1 },
                    new ProductCategoryModel { ProductId = 4, CategoryId = 2 },
                    new ProductCategoryModel { ProductId = 5, CategoryId = 1 },
                    new ProductCategoryModel { ProductId = 5, CategoryId = 2 },
                    new ProductCategoryModel { ProductId = 6, CategoryId = 1 },
                    new ProductCategoryModel { ProductId = 6, CategoryId = 2 },
                    new ProductCategoryModel { ProductId = 7, CategoryId = 4 },
                    new ProductCategoryModel { ProductId = 8, CategoryId = 4 },
                    new ProductCategoryModel { ProductId = 9, CategoryId = 4 },
                    new ProductCategoryModel { ProductId = 10, CategoryId = 4 },
                    new ProductCategoryModel { ProductId = 11, CategoryId = 5 },
                    new ProductCategoryModel { ProductId = 12, CategoryId = 5 },
                    new ProductCategoryModel { ProductId = 13, CategoryId = 9 },
                    new ProductCategoryModel { ProductId = 13, CategoryId = 10 },
                    new ProductCategoryModel { ProductId = 14, CategoryId = 9 },
                    new ProductCategoryModel { ProductId = 14, CategoryId = 10 },
                    new ProductCategoryModel { ProductId = 15, CategoryId = 2 },
                    new ProductCategoryModel { ProductId = 15, CategoryId = 10 },
                    new ProductCategoryModel { ProductId = 16, CategoryId = 2 },
                    new ProductCategoryModel { ProductId = 16, CategoryId = 10 },
                    new ProductCategoryModel { ProductId = 17, CategoryId = 6 },
                    new ProductCategoryModel { ProductId = 17, CategoryId = 3 },
                    new ProductCategoryModel { ProductId = 18, CategoryId = 6 },
                    new ProductCategoryModel { ProductId = 18, CategoryId = 3 },
                    new ProductCategoryModel { ProductId = 19, CategoryId = 2 },
                    new ProductCategoryModel { ProductId = 19, CategoryId = 10 },
                    new ProductCategoryModel { ProductId = 20, CategoryId = 2 },
                    new ProductCategoryModel { ProductId = 20, CategoryId = 10 }
                );
            });

            // ── StockEntry ──────────────────────────────────────────────────────
            modelBuilder.Entity<StockEntryModel>(e =>
            {
                e.ToTable("StockEntries");
                e.Property(se => se.CostValue).HasColumnType("decimal(18,2)");

                e.HasOne(se => se.Product)
                 .WithMany(p => p.StockEntries)
                 .HasForeignKey(se => se.ProductId)
                 .OnDelete(DeleteBehavior.Cascade);

                e.HasOne(se => se.Supplier)
                 .WithMany(s => s.StockEntries)
                 .HasForeignKey(se => se.SupplierId)
                 .OnDelete(DeleteBehavior.Restrict);

                e.HasData(
                    new StockEntryModel { Id = 1, Uuid = Guid.Parse("88888888-0000-4000-8000-000000000001"), ProductId = 1, SupplierId = 4, Quantity = 90, CostValue = 17.20m, EntryDate = new DateOnly(2026, 3, 5), CreatedAt = new DateTime(2026, 3, 5, 0, 0, 0, DateTimeKind.Utc) },
                    new StockEntryModel { Id = 2, Uuid = Guid.Parse("88888888-0000-4000-8000-000000000002"), ProductId = 2, SupplierId = 5, Quantity = 120, CostValue = 9.60m, EntryDate = new DateOnly(2026, 3, 5), CreatedAt = new DateTime(2026, 3, 5, 0, 0, 0, DateTimeKind.Utc) },
                    new StockEntryModel { Id = 3, Uuid = Guid.Parse("88888888-0000-4000-8000-000000000003"), ProductId = 3, SupplierId = 3, Quantity = 70, CostValue = 19.30m, EntryDate = new DateOnly(2026, 3, 6), CreatedAt = new DateTime(2026, 3, 6, 0, 0, 0, DateTimeKind.Utc) },
                    new StockEntryModel { Id = 4, Uuid = Guid.Parse("88888888-0000-4000-8000-000000000004"), ProductId = 4, SupplierId = 6, Quantity = 110, CostValue = 11.50m, EntryDate = new DateOnly(2026, 3, 6), CreatedAt = new DateTime(2026, 3, 6, 0, 0, 0, DateTimeKind.Utc) },
                    new StockEntryModel { Id = 5, Uuid = Guid.Parse("88888888-0000-4000-8000-000000000005"), ProductId = 5, SupplierId = 3, Quantity = 85, CostValue = 14.90m, EntryDate = new DateOnly(2026, 3, 7), CreatedAt = new DateTime(2026, 3, 7, 0, 0, 0, DateTimeKind.Utc) },
                    new StockEntryModel { Id = 6, Uuid = Guid.Parse("88888888-0000-4000-8000-000000000006"), ProductId = 6, SupplierId = 5, Quantity = 130, CostValue = 8.20m, EntryDate = new DateOnly(2026, 3, 7), CreatedAt = new DateTime(2026, 3, 7, 0, 0, 0, DateTimeKind.Utc) },
                    new StockEntryModel { Id = 7, Uuid = Guid.Parse("88888888-0000-4000-8000-000000000007"), ProductId = 7, SupplierId = 2, Quantity = 60, CostValue = 31.50m, EntryDate = new DateOnly(2026, 3, 8), CreatedAt = new DateTime(2026, 3, 8, 0, 0, 0, DateTimeKind.Utc) },
                    new StockEntryModel { Id = 8, Uuid = Guid.Parse("88888888-0000-4000-8000-000000000008"), ProductId = 8, SupplierId = 6, Quantity = 95, CostValue = 18.20m, EntryDate = new DateOnly(2026, 3, 8), CreatedAt = new DateTime(2026, 3, 8, 0, 0, 0, DateTimeKind.Utc) },
                    new StockEntryModel { Id = 9, Uuid = Guid.Parse("88888888-0000-4000-8000-000000000009"), ProductId = 9, SupplierId = 2, Quantity = 72, CostValue = 24.80m, EntryDate = new DateOnly(2026, 3, 9), CreatedAt = new DateTime(2026, 3, 9, 0, 0, 0, DateTimeKind.Utc) },
                    new StockEntryModel { Id = 10, Uuid = Guid.Parse("88888888-0000-4000-8000-000000000010"), ProductId = 10, SupplierId = 5, Quantity = 116, CostValue = 10.70m, EntryDate = new DateOnly(2026, 3, 9), CreatedAt = new DateTime(2026, 3, 9, 0, 0, 0, DateTimeKind.Utc) },
                    new StockEntryModel { Id = 11, Uuid = Guid.Parse("88888888-0000-4000-8000-000000000011"), ProductId = 11, SupplierId = 1, Quantity = 80, CostValue = 20.40m, EntryDate = new DateOnly(2026, 3, 10), CreatedAt = new DateTime(2026, 3, 10, 0, 0, 0, DateTimeKind.Utc) },
                    new StockEntryModel { Id = 12, Uuid = Guid.Parse("88888888-0000-4000-8000-000000000012"), ProductId = 12, SupplierId = 6, Quantity = 140, CostValue = 9.90m, EntryDate = new DateOnly(2026, 3, 10), CreatedAt = new DateTime(2026, 3, 10, 0, 0, 0, DateTimeKind.Utc) },
                    new StockEntryModel { Id = 13, Uuid = Guid.Parse("88888888-0000-4000-8000-000000000013"), ProductId = 13, SupplierId = 1, Quantity = 56, CostValue = 31.00m, EntryDate = new DateOnly(2026, 3, 11), CreatedAt = new DateTime(2026, 3, 11, 0, 0, 0, DateTimeKind.Utc) },
                    new StockEntryModel { Id = 14, Uuid = Guid.Parse("88888888-0000-4000-8000-000000000014"), ProductId = 14, SupplierId = 5, Quantity = 104, CostValue = 19.40m, EntryDate = new DateOnly(2026, 3, 11), CreatedAt = new DateTime(2026, 3, 11, 0, 0, 0, DateTimeKind.Utc) },
                    new StockEntryModel { Id = 15, Uuid = Guid.Parse("88888888-0000-4000-8000-000000000015"), ProductId = 15, SupplierId = 4, Quantity = 62, CostValue = 22.10m, EntryDate = new DateOnly(2026, 3, 12), CreatedAt = new DateTime(2026, 3, 12, 0, 0, 0, DateTimeKind.Utc) },
                    new StockEntryModel { Id = 16, Uuid = Guid.Parse("88888888-0000-4000-8000-000000000016"), ProductId = 16, SupplierId = 6, Quantity = 98, CostValue = 12.40m, EntryDate = new DateOnly(2026, 3, 12), CreatedAt = new DateTime(2026, 3, 12, 0, 0, 0, DateTimeKind.Utc) },
                    new StockEntryModel { Id = 17, Uuid = Guid.Parse("88888888-0000-4000-8000-000000000017"), ProductId = 17, SupplierId = 2, Quantity = 75, CostValue = 44.60m, EntryDate = new DateOnly(2026, 3, 13), CreatedAt = new DateTime(2026, 3, 13, 0, 0, 0, DateTimeKind.Utc) },
                    new StockEntryModel { Id = 18, Uuid = Guid.Parse("88888888-0000-4000-8000-000000000018"), ProductId = 18, SupplierId = 6, Quantity = 128, CostValue = 26.10m, EntryDate = new DateOnly(2026, 3, 13), CreatedAt = new DateTime(2026, 3, 13, 0, 0, 0, DateTimeKind.Utc) },
                    new StockEntryModel { Id = 19, Uuid = Guid.Parse("88888888-0000-4000-8000-000000000019"), ProductId = 19, SupplierId = 4, Quantity = 68, CostValue = 18.90m, EntryDate = new DateOnly(2026, 3, 14), CreatedAt = new DateTime(2026, 3, 14, 0, 0, 0, DateTimeKind.Utc) },
                    new StockEntryModel { Id = 20, Uuid = Guid.Parse("88888888-0000-4000-8000-000000000020"), ProductId = 20, SupplierId = 6, Quantity = 101, CostValue = 11.20m, EntryDate = new DateOnly(2026, 3, 14), CreatedAt = new DateTime(2026, 3, 14, 0, 0, 0, DateTimeKind.Utc) }
                );
            });

            // ── ProductStock ────────────────────────────────────────────────────
            modelBuilder.Entity<ProductStockModel>(e =>
            {
                e.ToTable("ProductStocks");
                e.HasIndex(ps => ps.ProductId).IsUnique();

                e.HasOne(ps => ps.Product)
                 .WithOne(p => p.Stock)
                 .HasForeignKey<ProductStockModel>(ps => ps.ProductId)
                 .OnDelete(DeleteBehavior.Cascade);

                // Seed: estoque inicial zerado para todos os produtos
                e.HasData(
                    new ProductStockModel { Id = 1, Uuid = Guid.Parse("77777777-0000-4000-8000-000000000001"), ProductId = 1, AvailableQuantity = 90, BlockedQuantity = 3, LastUpdated = new DateTime(2026, 3, 15, 0, 0, 0, DateTimeKind.Utc) },
                    new ProductStockModel { Id = 2, Uuid = Guid.Parse("77777777-0000-4000-8000-000000000002"), ProductId = 2, AvailableQuantity = 120, BlockedQuantity = 4, LastUpdated = new DateTime(2026, 3, 15, 0, 0, 0, DateTimeKind.Utc) },
                    new ProductStockModel { Id = 3, Uuid = Guid.Parse("77777777-0000-4000-8000-000000000003"), ProductId = 3, AvailableQuantity = 70, BlockedQuantity = 2, LastUpdated = new DateTime(2026, 3, 15, 0, 0, 0, DateTimeKind.Utc) },
                    new ProductStockModel { Id = 4, Uuid = Guid.Parse("77777777-0000-4000-8000-000000000004"), ProductId = 4, AvailableQuantity = 110, BlockedQuantity = 5, LastUpdated = new DateTime(2026, 3, 15, 0, 0, 0, DateTimeKind.Utc) },
                    new ProductStockModel { Id = 5, Uuid = Guid.Parse("77777777-0000-4000-8000-000000000005"), ProductId = 5, AvailableQuantity = 85, BlockedQuantity = 2, LastUpdated = new DateTime(2026, 3, 15, 0, 0, 0, DateTimeKind.Utc) },
                    new ProductStockModel { Id = 6, Uuid = Guid.Parse("77777777-0000-4000-8000-000000000006"), ProductId = 6, AvailableQuantity = 130, BlockedQuantity = 6, LastUpdated = new DateTime(2026, 3, 15, 0, 0, 0, DateTimeKind.Utc) },
                    new ProductStockModel { Id = 7, Uuid = Guid.Parse("77777777-0000-4000-8000-000000000007"), ProductId = 7, AvailableQuantity = 60, BlockedQuantity = 2, LastUpdated = new DateTime(2026, 3, 15, 0, 0, 0, DateTimeKind.Utc) },
                    new ProductStockModel { Id = 8, Uuid = Guid.Parse("77777777-0000-4000-8000-000000000008"), ProductId = 8, AvailableQuantity = 95, BlockedQuantity = 3, LastUpdated = new DateTime(2026, 3, 15, 0, 0, 0, DateTimeKind.Utc) },
                    new ProductStockModel { Id = 9, Uuid = Guid.Parse("77777777-0000-4000-8000-000000000009"), ProductId = 9, AvailableQuantity = 72, BlockedQuantity = 1, LastUpdated = new DateTime(2026, 3, 15, 0, 0, 0, DateTimeKind.Utc) },
                    new ProductStockModel { Id = 10, Uuid = Guid.Parse("77777777-0000-4000-8000-000000000010"), ProductId = 10, AvailableQuantity = 116, BlockedQuantity = 4, LastUpdated = new DateTime(2026, 3, 15, 0, 0, 0, DateTimeKind.Utc) },
                    new ProductStockModel { Id = 11, Uuid = Guid.Parse("77777777-0000-4000-8000-000000000011"), ProductId = 11, AvailableQuantity = 80, BlockedQuantity = 2, LastUpdated = new DateTime(2026, 3, 15, 0, 0, 0, DateTimeKind.Utc) },
                    new ProductStockModel { Id = 12, Uuid = Guid.Parse("77777777-0000-4000-8000-000000000012"), ProductId = 12, AvailableQuantity = 140, BlockedQuantity = 5, LastUpdated = new DateTime(2026, 3, 15, 0, 0, 0, DateTimeKind.Utc) },
                    new ProductStockModel { Id = 13, Uuid = Guid.Parse("77777777-0000-4000-8000-000000000013"), ProductId = 13, AvailableQuantity = 56, BlockedQuantity = 3, LastUpdated = new DateTime(2026, 3, 15, 0, 0, 0, DateTimeKind.Utc) },
                    new ProductStockModel { Id = 14, Uuid = Guid.Parse("77777777-0000-4000-8000-000000000014"), ProductId = 14, AvailableQuantity = 104, BlockedQuantity = 4, LastUpdated = new DateTime(2026, 3, 15, 0, 0, 0, DateTimeKind.Utc) },
                    new ProductStockModel { Id = 15, Uuid = Guid.Parse("77777777-0000-4000-8000-000000000015"), ProductId = 15, AvailableQuantity = 62, BlockedQuantity = 2, LastUpdated = new DateTime(2026, 3, 15, 0, 0, 0, DateTimeKind.Utc) },
                    new ProductStockModel { Id = 16, Uuid = Guid.Parse("77777777-0000-4000-8000-000000000016"), ProductId = 16, AvailableQuantity = 98, BlockedQuantity = 3, LastUpdated = new DateTime(2026, 3, 15, 0, 0, 0, DateTimeKind.Utc) },
                    new ProductStockModel { Id = 17, Uuid = Guid.Parse("77777777-0000-4000-8000-000000000017"), ProductId = 17, AvailableQuantity = 75, BlockedQuantity = 2, LastUpdated = new DateTime(2026, 3, 15, 0, 0, 0, DateTimeKind.Utc) },
                    new ProductStockModel { Id = 18, Uuid = Guid.Parse("77777777-0000-4000-8000-000000000018"), ProductId = 18, AvailableQuantity = 128, BlockedQuantity = 3, LastUpdated = new DateTime(2026, 3, 15, 0, 0, 0, DateTimeKind.Utc) },
                    new ProductStockModel { Id = 19, Uuid = Guid.Parse("77777777-0000-4000-8000-000000000019"), ProductId = 19, AvailableQuantity = 68, BlockedQuantity = 2, LastUpdated = new DateTime(2026, 3, 15, 0, 0, 0, DateTimeKind.Utc) },
                    new ProductStockModel { Id = 20, Uuid = Guid.Parse("77777777-0000-4000-8000-000000000020"), ProductId = 20, AvailableQuantity = 101, BlockedQuantity = 4, LastUpdated = new DateTime(2026, 3, 15, 0, 0, 0, DateTimeKind.Utc) }
                );
            });

            // ── DrugInteraction ─────────────────────────────────────────────────
            modelBuilder.Entity<DrugInteractionModel>(e =>
            {
                e.ToTable("DrugInteractions");
                e.HasIndex(d => new { d.ProductAId, d.ProductBId }).IsUnique();
                e.Property(d => d.Description).IsRequired().HasMaxLength(500);

                e.HasOne(d => d.ProductA)
                 .WithMany(p => p.InteractionsAsSource)
                 .HasForeignKey(d => d.ProductAId)
                 .OnDelete(DeleteBehavior.Cascade);

                e.HasOne(d => d.ProductB)
                 .WithMany(p => p.InteractionsAsTarget)
                 .HasForeignKey(d => d.ProductBId)
                 .OnDelete(DeleteBehavior.Restrict);

                e.HasData(
                    new DrugInteractionModel { Id = 1, Uuid = Guid.Parse("99999999-0000-4000-8000-000000000001"), ProductAId = 3, ProductBId = 15, Description = "Associação de dois anti-inflamatórios pode elevar risco gastrointestinal e renal.", SeverityLevel = 3 },
                    new DrugInteractionModel { Id = 2, Uuid = Guid.Parse("99999999-0000-4000-8000-000000000002"), ProductAId = 4, ProductBId = 16, Description = "Uso concomitante de AINEs aumenta chance de eventos adversos gastrointestinais.", SeverityLevel = 3 },
                    new DrugInteractionModel { Id = 3, Uuid = Guid.Parse("99999999-0000-4000-8000-000000000003"), ProductAId = 5, ProductBId = 19, Description = "Combinação pode elevar risco de reações adversas hematológicas e gastrintestinais.", SeverityLevel = 2 },
                    new DrugInteractionModel { Id = 4, Uuid = Guid.Parse("99999999-0000-4000-8000-000000000004"), ProductAId = 6, ProductBId = 20, Description = "Atenção ao uso conjunto por potencial aumento de eventos adversos.", SeverityLevel = 2 },
                    new DrugInteractionModel { Id = 5, Uuid = Guid.Parse("99999999-0000-4000-8000-000000000005"), ProductAId = 13, ProductBId = 11, Description = "Pode reduzir absorção ideal dependendo de horários de administração.", SeverityLevel = 2 },
                    new DrugInteractionModel { Id = 6, Uuid = Guid.Parse("99999999-0000-4000-8000-000000000006"), ProductAId = 14, ProductBId = 12, Description = "Recomenda-se orientação farmacêutica para ajuste de horários e monitoramento.", SeverityLevel = 2 }
                );
            });
        }
    }
}
