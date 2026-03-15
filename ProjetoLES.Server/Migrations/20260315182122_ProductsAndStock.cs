using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ProjetoLES.Server.Migrations
{
    /// <inheritdoc />
    public partial class ProductsAndStock : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false),
                    Uuid = table.Column<Guid>(type: "TEXT", nullable: false, defaultValueSql: "(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))"),
                    IsDeleted = table.Column<bool>(type: "INTEGER", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PricingGroups",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    ProfitMarginPercent = table.Column<decimal>(type: "decimal(6,2)", nullable: false),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false),
                    Uuid = table.Column<Guid>(type: "TEXT", nullable: false, defaultValueSql: "(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))"),
                    IsDeleted = table.Column<bool>(type: "INTEGER", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PricingGroups", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Suppliers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    Cnpj = table.Column<string>(type: "TEXT", maxLength: 18, nullable: false),
                    ContactEmail = table.Column<string>(type: "TEXT", maxLength: 255, nullable: true),
                    ContactPhone = table.Column<string>(type: "TEXT", maxLength: 20, nullable: true),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false),
                    Uuid = table.Column<Guid>(type: "TEXT", nullable: false, defaultValueSql: "(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))"),
                    IsDeleted = table.Column<bool>(type: "INTEGER", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Suppliers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ProductCode = table.Column<string>(type: "TEXT", maxLength: 30, nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "TEXT", maxLength: 1000, nullable: true),
                    ActivePrinciple = table.Column<string>(type: "TEXT", maxLength: 300, nullable: true),
                    Barcode = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    ImageUrl = table.Column<string>(type: "TEXT", maxLength: 1000, nullable: true),
                    HeightCm = table.Column<decimal>(type: "decimal(8,2)", nullable: true),
                    WidthCm = table.Column<decimal>(type: "decimal(8,2)", nullable: true),
                    DepthCm = table.Column<decimal>(type: "decimal(8,2)", nullable: true),
                    WeightGrams = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    PrescriptionType = table.Column<int>(type: "INTEGER", nullable: false),
                    PricingGroupId = table.Column<int>(type: "INTEGER", nullable: false),
                    SalePrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false),
                    InactivationCategory = table.Column<int>(type: "INTEGER", nullable: true),
                    InactivationReason = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    ActivationReason = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Uuid = table.Column<Guid>(type: "TEXT", nullable: false, defaultValueSql: "(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))"),
                    IsDeleted = table.Column<bool>(type: "INTEGER", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Products_PricingGroups_PricingGroupId",
                        column: x => x.PricingGroupId,
                        principalTable: "PricingGroups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "DrugInteractions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ProductAId = table.Column<int>(type: "INTEGER", nullable: false),
                    ProductBId = table.Column<int>(type: "INTEGER", nullable: false),
                    Description = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false),
                    SeverityLevel = table.Column<int>(type: "INTEGER", nullable: false),
                    Uuid = table.Column<Guid>(type: "TEXT", nullable: false, defaultValueSql: "(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))"),
                    IsDeleted = table.Column<bool>(type: "INTEGER", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DrugInteractions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DrugInteractions_Products_ProductAId",
                        column: x => x.ProductAId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DrugInteractions_Products_ProductBId",
                        column: x => x.ProductBId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ProductCategories",
                columns: table => new
                {
                    ProductId = table.Column<int>(type: "INTEGER", nullable: false),
                    CategoryId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductCategories", x => new { x.ProductId, x.CategoryId });
                    table.ForeignKey(
                        name: "FK_ProductCategories_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProductCategories_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProductStocks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ProductId = table.Column<int>(type: "INTEGER", nullable: false),
                    AvailableQuantity = table.Column<int>(type: "INTEGER", nullable: false),
                    BlockedQuantity = table.Column<int>(type: "INTEGER", nullable: false),
                    LastUpdated = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Uuid = table.Column<Guid>(type: "TEXT", nullable: false, defaultValueSql: "(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))"),
                    IsDeleted = table.Column<bool>(type: "INTEGER", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductStocks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductStocks_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "StockEntries",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ProductId = table.Column<int>(type: "INTEGER", nullable: false),
                    SupplierId = table.Column<int>(type: "INTEGER", nullable: false),
                    Quantity = table.Column<int>(type: "INTEGER", nullable: false),
                    CostValue = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    EntryDate = table.Column<DateOnly>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Uuid = table.Column<Guid>(type: "TEXT", nullable: false, defaultValueSql: "(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))"),
                    IsDeleted = table.Column<bool>(type: "INTEGER", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StockEntries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StockEntries_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StockEntries_Suppliers_SupplierId",
                        column: x => x.SupplierId,
                        principalTable: "Suppliers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "DeletedAt", "Description", "IsActive", "IsDeleted", "Name", "Uuid" },
                values: new object[,]
                {
                    { 1, null, "Medicamentos em geral", true, false, "Medicamentos", new Guid("33333333-0000-4000-8000-000000000001") },
                    { 2, null, "Analgésicos e antitérmicos", true, false, "Dor e Febre", new Guid("33333333-0000-4000-8000-000000000002") },
                    { 3, null, "Saúde e bem-estar", true, false, "Bem-estar", new Guid("33333333-0000-4000-8000-000000000003") },
                    { 4, null, "Antialérgicos", true, false, "Alergia", new Guid("33333333-0000-4000-8000-000000000004") },
                    { 5, null, "Saúde digestiva", true, false, "Digestivo", new Guid("33333333-0000-4000-8000-000000000005") },
                    { 6, null, "Vitaminas e suplementos", true, false, "Vitaminas", new Guid("33333333-0000-4000-8000-000000000006") },
                    { 7, null, "Higiene pessoal", true, false, "Higiene", new Guid("33333333-0000-4000-8000-000000000007") },
                    { 8, null, "Cosméticos e cuidados com a pele", true, false, "Dermocosméticos", new Guid("33333333-0000-4000-8000-000000000008") },
                    { 9, null, "Antibióticos e antimicrobianos", true, false, "Antibióticos", new Guid("33333333-0000-4000-8000-000000000009") },
                    { 10, null, "Medicamentos sob prescrição médica", true, false, "Tarja Vermelha", new Guid("33333333-0000-4000-8000-000000000010") }
                });

            migrationBuilder.InsertData(
                table: "PricingGroups",
                columns: new[] { "Id", "DeletedAt", "Description", "IsActive", "IsDeleted", "Name", "ProfitMarginPercent", "Uuid" },
                values: new object[,]
                {
                    { 1, null, "Margem padrão de 30%", true, false, "Padrão", 30m, new Guid("44444444-0000-4000-8000-000000000001") },
                    { 2, null, "Margem de 50% para produtos premium", true, false, "Premium", 50m, new Guid("44444444-0000-4000-8000-000000000002") },
                    { 3, null, "Margem reduzida de 20% para genéricos", true, false, "Genérico", 20m, new Guid("44444444-0000-4000-8000-000000000003") },
                    { 4, null, "Margem de 40% para suplementos e vitaminas", true, false, "Suplemento", 40m, new Guid("44444444-0000-4000-8000-000000000004") }
                });

            migrationBuilder.InsertData(
                table: "Suppliers",
                columns: new[] { "Id", "Cnpj", "ContactEmail", "ContactPhone", "DeletedAt", "IsActive", "IsDeleted", "Name", "Uuid" },
                values: new object[,]
                {
                    { 1, "57.507.378/0001-41", "comercial@ems.com.br", "11999990001", null, true, false, "EMS Sigma Pharma", new Guid("55555555-0000-4000-8000-000000000001") },
                    { 2, "61.190.096/0001-92", "vendas@eurofarma.com.br", "11999990002", null, true, false, "Eurofarma", new Guid("55555555-0000-4000-8000-000000000002") },
                    { 3, "02.932.074/0001-91", "pedidos@hypermarcas.com.br", "11999990003", null, true, false, "Hypermarcas", new Guid("55555555-0000-4000-8000-000000000003") }
                });

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "ActivationReason", "ActivePrinciple", "Barcode", "CreatedAt", "DeletedAt", "DepthCm", "Description", "HeightCm", "ImageUrl", "InactivationCategory", "InactivationReason", "IsActive", "IsDeleted", "Name", "PrescriptionType", "PricingGroupId", "ProductCode", "SalePrice", "UpdatedAt", "Uuid", "WeightGrams", "WidthCm" },
                values: new object[,]
                {
                    { 1, null, "Paracetamol 750mg", "7891234000001", new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, "Indicado para alívio de dores leves a moderadas e redução da febre.", null, "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop&q=80", null, null, true, false, "Paracetamol 750mg", 0, 3, "PROD0001", 18.90m, new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), new Guid("66666666-0000-4000-8000-000000000001"), null, null },
                    { 2, null, "Ibuprofeno 600mg", "7891234000002", new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, "Anti-inflamatório não esteroidal para dores musculares e febre.", null, "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop&q=80", null, null, true, false, "Ibuprofeno 600mg", 0, 3, "PROD0002", 22.50m, new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), new Guid("66666666-0000-4000-8000-000000000002"), null, null },
                    { 3, null, "Amoxicilina Tri-hidratada 500mg", "7891234000003", new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, "Antibiótico indicado para tratamento de infecções bacterianas.", null, "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=400&fit=crop&q=80", null, null, true, false, "Amoxicilina 500mg", 2, 1, "PROD0003", 35.00m, new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), new Guid("66666666-0000-4000-8000-000000000003"), null, null },
                    { 4, null, "Dipirona Sódica 1g", "7891234000004", new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, "Analgésico e antitérmico indicado para dores e febre.", null, "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&h=400&fit=crop&q=80", null, null, true, false, "Dipirona 1g", 0, 3, "PROD0004", 15.75m, new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), new Guid("66666666-0000-4000-8000-000000000004"), null, null },
                    { 5, null, "Loratadina 10mg", "7891234000005", new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, "Antialérgico indicado para rinite, urticária e outras alergias.", null, "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400&h=400&fit=crop&q=80", null, null, true, false, "Loratadina 10mg", 0, 3, "PROD0005", 27.30m, new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), new Guid("66666666-0000-4000-8000-000000000005"), null, null },
                    { 6, null, "Omeprazol 20mg", "7891234000006", new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, "Reduz a produção de ácido no estômago, indicado para gastrite e refluxo.", null, "https://images.unsplash.com/photo-1550572017-4fade5817617?w=400&h=400&fit=crop&q=80", null, null, true, false, "Omeprazol 20mg", 0, 3, "PROD0006", 19.90m, new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), new Guid("66666666-0000-4000-8000-000000000006"), null, null }
                });

            migrationBuilder.InsertData(
                table: "ProductCategories",
                columns: new[] { "CategoryId", "ProductId" },
                values: new object[,]
                {
                    { 1, 1 },
                    { 2, 1 },
                    { 1, 2 },
                    { 2, 2 },
                    { 9, 3 },
                    { 10, 3 },
                    { 1, 4 },
                    { 2, 4 },
                    { 4, 5 },
                    { 5, 6 }
                });

            migrationBuilder.InsertData(
                table: "ProductStocks",
                columns: new[] { "Id", "AvailableQuantity", "BlockedQuantity", "DeletedAt", "IsDeleted", "LastUpdated", "ProductId", "Uuid" },
                values: new object[,]
                {
                    { 1, 0, 0, null, false, new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, new Guid("77777777-0000-4000-8000-000000000001") },
                    { 2, 0, 0, null, false, new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), 2, new Guid("77777777-0000-4000-8000-000000000002") },
                    { 3, 0, 0, null, false, new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), 3, new Guid("77777777-0000-4000-8000-000000000003") },
                    { 4, 0, 0, null, false, new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), 4, new Guid("77777777-0000-4000-8000-000000000004") },
                    { 5, 0, 0, null, false, new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), 5, new Guid("77777777-0000-4000-8000-000000000005") },
                    { 6, 0, 0, null, false, new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), 6, new Guid("77777777-0000-4000-8000-000000000006") }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Categories_Name",
                table: "Categories",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Categories_Uuid",
                table: "Categories",
                column: "Uuid",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DrugInteractions_ProductAId_ProductBId",
                table: "DrugInteractions",
                columns: new[] { "ProductAId", "ProductBId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DrugInteractions_ProductBId",
                table: "DrugInteractions",
                column: "ProductBId");

            migrationBuilder.CreateIndex(
                name: "IX_DrugInteractions_Uuid",
                table: "DrugInteractions",
                column: "Uuid",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PricingGroups_Name",
                table: "PricingGroups",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PricingGroups_Uuid",
                table: "PricingGroups",
                column: "Uuid",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProductCategories_CategoryId",
                table: "ProductCategories",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Products_Barcode",
                table: "Products",
                column: "Barcode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Products_PricingGroupId",
                table: "Products",
                column: "PricingGroupId");

            migrationBuilder.CreateIndex(
                name: "IX_Products_ProductCode",
                table: "Products",
                column: "ProductCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Products_Uuid",
                table: "Products",
                column: "Uuid",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProductStocks_ProductId",
                table: "ProductStocks",
                column: "ProductId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProductStocks_Uuid",
                table: "ProductStocks",
                column: "Uuid",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_StockEntries_ProductId",
                table: "StockEntries",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_StockEntries_SupplierId",
                table: "StockEntries",
                column: "SupplierId");

            migrationBuilder.CreateIndex(
                name: "IX_StockEntries_Uuid",
                table: "StockEntries",
                column: "Uuid",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Suppliers_Cnpj",
                table: "Suppliers",
                column: "Cnpj",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Suppliers_Uuid",
                table: "Suppliers",
                column: "Uuid",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DrugInteractions");

            migrationBuilder.DropTable(
                name: "ProductCategories");

            migrationBuilder.DropTable(
                name: "ProductStocks");

            migrationBuilder.DropTable(
                name: "StockEntries");

            migrationBuilder.DropTable(
                name: "Categories");

            migrationBuilder.DropTable(
                name: "Products");

            migrationBuilder.DropTable(
                name: "Suppliers");

            migrationBuilder.DropTable(
                name: "PricingGroups");
        }
    }
}
