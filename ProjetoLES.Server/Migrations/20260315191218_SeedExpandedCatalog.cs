using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ProjetoLES.Server.Migrations
{
    /// <inheritdoc />
    public partial class SeedExpandedCatalog : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "ProductCategories",
                keyColumns: new[] { "CategoryId", "ProductId" },
                keyValues: new object[] { 9, 3 });

            migrationBuilder.DeleteData(
                table: "ProductCategories",
                keyColumns: new[] { "CategoryId", "ProductId" },
                keyValues: new object[] { 10, 3 });

            migrationBuilder.DeleteData(
                table: "ProductCategories",
                keyColumns: new[] { "CategoryId", "ProductId" },
                keyValues: new object[] { 4, 5 });

            migrationBuilder.DeleteData(
                table: "ProductCategories",
                keyColumns: new[] { "CategoryId", "ProductId" },
                keyValues: new object[] { 5, 6 });

            migrationBuilder.InsertData(
                table: "ProductCategories",
                columns: new[] { "CategoryId", "ProductId" },
                values: new object[,]
                {
                    { 1, 3 },
                    { 2, 3 },
                    { 1, 5 },
                    { 2, 5 },
                    { 1, 6 },
                    { 2, 6 }
                });

            migrationBuilder.UpdateData(
                table: "ProductStocks",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "AvailableQuantity", "BlockedQuantity", "LastUpdated" },
                values: new object[] { 90, 3, new DateTime(2026, 3, 15, 0, 0, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.UpdateData(
                table: "ProductStocks",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "AvailableQuantity", "BlockedQuantity", "LastUpdated" },
                values: new object[] { 120, 4, new DateTime(2026, 3, 15, 0, 0, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.UpdateData(
                table: "ProductStocks",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "AvailableQuantity", "BlockedQuantity", "LastUpdated" },
                values: new object[] { 70, 2, new DateTime(2026, 3, 15, 0, 0, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.UpdateData(
                table: "ProductStocks",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "AvailableQuantity", "BlockedQuantity", "LastUpdated" },
                values: new object[] { 110, 5, new DateTime(2026, 3, 15, 0, 0, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.UpdateData(
                table: "ProductStocks",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "AvailableQuantity", "BlockedQuantity", "LastUpdated" },
                values: new object[] { 85, 2, new DateTime(2026, 3, 15, 0, 0, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.UpdateData(
                table: "ProductStocks",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "AvailableQuantity", "BlockedQuantity", "LastUpdated" },
                values: new object[] { 130, 6, new DateTime(2026, 3, 15, 0, 0, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Barcode", "Description", "ImageUrl", "Name", "PricingGroupId", "SalePrice" },
                values: new object[] { "7891234500001", "Medicamento de referência para dor e febre.", "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=420&h=420&fit=crop&q=80", "Tylenol 750mg", 2, 24.90m });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "ActivePrinciple", "Barcode", "Description", "ImageUrl", "Name", "SalePrice" },
                values: new object[] { "Paracetamol 750mg", "7891234500002", "Opção genérica para alívio de dor e febre.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=420&h=420&fit=crop&q=80", "Paracetamol Genérico 750mg", 13.90m });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "ActivePrinciple", "Barcode", "Description", "ImageUrl", "Name", "PrescriptionType", "PricingGroupId", "SalePrice" },
                values: new object[] { "Ibuprofeno 400mg", "7891234500003", "Analgésico e anti-inflamatório de referência.", "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=420&h=420&fit=crop&q=80", "Advil 400mg", 0, 2, 28.90m });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "ActivePrinciple", "Barcode", "Description", "ImageUrl", "Name", "SalePrice" },
                values: new object[] { "Ibuprofeno 400mg", "7891234500004", "Alternativa genérica para dores e inflamações.", "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=420&h=420&fit=crop&q=80", "Ibuprofeno Genérico 400mg", 16.90m });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "ActivePrinciple", "Barcode", "Description", "ImageUrl", "Name", "PricingGroupId", "SalePrice" },
                values: new object[] { "Dipirona Sódica 1g", "7891234500005", "Referência em analgesia e antitérmico.", "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=420&h=420&fit=crop&q=80", "Novalgina 1g", 2, 21.90m });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "ActivePrinciple", "Barcode", "Description", "ImageUrl", "Name", "SalePrice" },
                values: new object[] { "Dipirona Sódica 1g", "7891234500006", "Genérico para dores e febre.", "https://images.unsplash.com/photo-1550572017-4fade5817617?w=420&h=420&fit=crop&q=80", "Dipirona Genérica 1g", 12.90m });

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "ActivationReason", "ActivePrinciple", "Barcode", "CreatedAt", "DeletedAt", "DepthCm", "Description", "HeightCm", "ImageUrl", "InactivationCategory", "InactivationReason", "IsActive", "IsDeleted", "Name", "PrescriptionType", "PricingGroupId", "ProductCode", "SalePrice", "UpdatedAt", "Uuid", "WeightGrams", "WidthCm" },
                values: new object[,]
                {
                    { 7, null, "Fexofenadina 120mg", "7891234500007", new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, "Antialérgico de referência para rinite.", null, "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=420&h=420&fit=crop&q=80", null, null, true, false, "Allegra 120mg", 0, 2, "PROD0007", 42.90m, new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), new Guid("66666666-0000-4000-8000-000000000007"), null, null },
                    { 8, null, "Fexofenadina 120mg", "7891234500008", new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, "Genérico antialérgico para uso diário.", null, "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=420&h=420&fit=crop&q=80", null, null, true, false, "Fexofenadina Genérica 120mg", 0, 3, "PROD0008", 24.90m, new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), new Guid("66666666-0000-4000-8000-000000000008"), null, null },
                    { 9, null, "Loratadina 10mg", "7891234500009", new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, "Referência para alívio de sintomas alérgicos.", null, "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=420&h=420&fit=crop&q=80", null, null, true, false, "Claritin 10mg", 0, 2, "PROD0009", 32.90m, new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), new Guid("66666666-0000-4000-8000-000000000009"), null, null },
                    { 10, null, "Loratadina 10mg", "7891234500010", new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, "Genérico para rinite e urticária.", null, "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=420&h=420&fit=crop&q=80", null, null, true, false, "Loratadina Genérica 10mg", 0, 3, "PROD0010", 17.90m, new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), new Guid("66666666-0000-4000-8000-000000000010"), null, null },
                    { 11, null, "Omeprazol 20mg", "7891234500011", new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, "Referência para redução da acidez gástrica.", null, "https://images.unsplash.com/photo-1550572017-4fade5817617?w=420&h=420&fit=crop&q=80", null, null, true, false, "Losec Mups 20mg", 0, 2, "PROD0011", 29.90m, new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), new Guid("66666666-0000-4000-8000-000000000011"), null, null },
                    { 12, null, "Omeprazol 20mg", "7891234500012", new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, "Genérico para gastrite e refluxo.", null, "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=420&h=420&fit=crop&q=80", null, null, true, false, "Omeprazol Genérico 20mg", 0, 3, "PROD0012", 15.90m, new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), new Guid("66666666-0000-4000-8000-000000000012"), null, null },
                    { 13, null, "Amoxicilina 500mg", "7891234500013", new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, "Antibiótico de referência sob prescrição.", null, "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=420&h=420&fit=crop&q=80", null, null, true, false, "Amoxil 500mg", 2, 1, "PROD0013", 44.90m, new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), new Guid("66666666-0000-4000-8000-000000000013"), null, null },
                    { 14, null, "Amoxicilina 500mg", "7891234500014", new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, "Antibiótico genérico sob prescrição médica.", null, "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=420&h=420&fit=crop&q=80", null, null, true, false, "Amoxicilina Genérica 500mg", 2, 3, "PROD0014", 29.90m, new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), new Guid("66666666-0000-4000-8000-000000000014"), null, null },
                    { 15, null, "Diclofenaco Potássico 50mg", "7891234500015", new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, "Anti-inflamatório de referência para dor aguda.", null, "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=420&h=420&fit=crop&q=80", null, null, true, false, "Cataflam 50mg", 2, 1, "PROD0015", 31.90m, new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), new Guid("66666666-0000-4000-8000-000000000015"), null, null },
                    { 16, null, "Diclofenaco Potássico 50mg", "7891234500016", new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, "Genérico anti-inflamatório sob prescrição.", null, "https://images.unsplash.com/photo-1550572017-4fade5817617?w=420&h=420&fit=crop&q=80", null, null, true, false, "Diclofenaco Potássico Genérico 50mg", 2, 3, "PROD0016", 19.90m, new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), new Guid("66666666-0000-4000-8000-000000000016"), null, null },
                    { 17, null, "Multivitamínico A-Z", "7891234500017", new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, "Suplemento vitamínico completo.", null, "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=420&h=420&fit=crop&q=80", null, null, true, false, "Centrum A-Z", 0, 4, "PROD0017", 64.90m, new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), new Guid("66666666-0000-4000-8000-000000000017"), null, null },
                    { 18, null, "Multivitamínico A-Z", "7891234500018", new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, "Suplemento diário de vitaminas e minerais.", null, "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=420&h=420&fit=crop&q=80", null, null, true, false, "Multivitamínico Genérico A-Z", 0, 4, "PROD0018", 38.90m, new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), new Guid("66666666-0000-4000-8000-000000000018"), null, null },
                    { 19, null, "Nimesulida 100mg", "7891234500019", new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, "Anti-inflamatório sob prescrição médica.", null, "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=420&h=420&fit=crop&q=80", null, null, true, false, "Nimesulida 100mg", 2, 1, "PROD0019", 27.90m, new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), new Guid("66666666-0000-4000-8000-000000000019"), null, null },
                    { 20, null, "Nimesulida 100mg", "7891234500020", new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, "Genérico anti-inflamatório de uso controlado.", null, "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=420&h=420&fit=crop&q=80", null, null, true, false, "Nimesulida Genérica 100mg", 2, 3, "PROD0020", 17.90m, new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), new Guid("66666666-0000-4000-8000-000000000020"), null, null }
                });

            migrationBuilder.InsertData(
                table: "StockEntries",
                columns: new[] { "Id", "CostValue", "CreatedAt", "DeletedAt", "EntryDate", "IsDeleted", "ProductId", "Quantity", "SupplierId", "Uuid" },
                values: new object[,]
                {
                    { 3, 19.30m, new DateTime(2026, 3, 6, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateOnly(2026, 3, 6), false, 3, 70, 3, new Guid("88888888-0000-4000-8000-000000000003") },
                    { 5, 14.90m, new DateTime(2026, 3, 7, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateOnly(2026, 3, 7), false, 5, 85, 3, new Guid("88888888-0000-4000-8000-000000000005") }
                });

            migrationBuilder.UpdateData(
                table: "Suppliers",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "ContactEmail", "Name" },
                values: new object[] { "pedidos@hypera.com.br", "Hypera Pharma" });

            migrationBuilder.InsertData(
                table: "Suppliers",
                columns: new[] { "Id", "Cnpj", "ContactEmail", "ContactPhone", "DeletedAt", "IsActive", "IsDeleted", "Name", "Uuid" },
                values: new object[,]
                {
                    { 4, "60.659.463/0001-91", "vendas@ache.com.br", "11999990004", null, true, false, "Aché Laboratórios", new Guid("55555555-0000-4000-8000-000000000004") },
                    { 5, "10.588.595/0001-03", "comercial@medley.com.br", "11999990005", null, true, false, "Medley", new Guid("55555555-0000-4000-8000-000000000005") },
                    { 6, "62.641.224/0001-01", "atendimento@neoquimica.com.br", "11999990006", null, true, false, "Neo Química", new Guid("55555555-0000-4000-8000-000000000006") }
                });

            migrationBuilder.InsertData(
                table: "DrugInteractions",
                columns: new[] { "Id", "DeletedAt", "Description", "IsDeleted", "ProductAId", "ProductBId", "SeverityLevel", "Uuid" },
                values: new object[,]
                {
                    { 1, null, "Associação de dois anti-inflamatórios pode elevar risco gastrointestinal e renal.", false, 3, 15, 3, new Guid("99999999-0000-4000-8000-000000000001") },
                    { 2, null, "Uso concomitante de AINEs aumenta chance de eventos adversos gastrointestinais.", false, 4, 16, 3, new Guid("99999999-0000-4000-8000-000000000002") },
                    { 3, null, "Combinação pode elevar risco de reações adversas hematológicas e gastrintestinais.", false, 5, 19, 2, new Guid("99999999-0000-4000-8000-000000000003") },
                    { 4, null, "Atenção ao uso conjunto por potencial aumento de eventos adversos.", false, 6, 20, 2, new Guid("99999999-0000-4000-8000-000000000004") },
                    { 5, null, "Pode reduzir absorção ideal dependendo de horários de administração.", false, 13, 11, 2, new Guid("99999999-0000-4000-8000-000000000005") },
                    { 6, null, "Recomenda-se orientação farmacêutica para ajuste de horários e monitoramento.", false, 14, 12, 2, new Guid("99999999-0000-4000-8000-000000000006") }
                });

            migrationBuilder.InsertData(
                table: "ProductCategories",
                columns: new[] { "CategoryId", "ProductId" },
                values: new object[,]
                {
                    { 4, 7 },
                    { 4, 8 },
                    { 4, 9 },
                    { 4, 10 },
                    { 5, 11 },
                    { 5, 12 },
                    { 9, 13 },
                    { 10, 13 },
                    { 9, 14 },
                    { 10, 14 },
                    { 2, 15 },
                    { 10, 15 },
                    { 2, 16 },
                    { 10, 16 },
                    { 3, 17 },
                    { 6, 17 },
                    { 3, 18 },
                    { 6, 18 },
                    { 2, 19 },
                    { 10, 19 },
                    { 2, 20 },
                    { 10, 20 }
                });

            migrationBuilder.InsertData(
                table: "ProductStocks",
                columns: new[] { "Id", "AvailableQuantity", "BlockedQuantity", "DeletedAt", "IsDeleted", "LastUpdated", "ProductId", "Uuid" },
                values: new object[,]
                {
                    { 7, 60, 2, null, false, new DateTime(2026, 3, 15, 0, 0, 0, 0, DateTimeKind.Utc), 7, new Guid("77777777-0000-4000-8000-000000000007") },
                    { 8, 95, 3, null, false, new DateTime(2026, 3, 15, 0, 0, 0, 0, DateTimeKind.Utc), 8, new Guid("77777777-0000-4000-8000-000000000008") },
                    { 9, 72, 1, null, false, new DateTime(2026, 3, 15, 0, 0, 0, 0, DateTimeKind.Utc), 9, new Guid("77777777-0000-4000-8000-000000000009") },
                    { 10, 116, 4, null, false, new DateTime(2026, 3, 15, 0, 0, 0, 0, DateTimeKind.Utc), 10, new Guid("77777777-0000-4000-8000-000000000010") },
                    { 11, 80, 2, null, false, new DateTime(2026, 3, 15, 0, 0, 0, 0, DateTimeKind.Utc), 11, new Guid("77777777-0000-4000-8000-000000000011") },
                    { 12, 140, 5, null, false, new DateTime(2026, 3, 15, 0, 0, 0, 0, DateTimeKind.Utc), 12, new Guid("77777777-0000-4000-8000-000000000012") },
                    { 13, 56, 3, null, false, new DateTime(2026, 3, 15, 0, 0, 0, 0, DateTimeKind.Utc), 13, new Guid("77777777-0000-4000-8000-000000000013") },
                    { 14, 104, 4, null, false, new DateTime(2026, 3, 15, 0, 0, 0, 0, DateTimeKind.Utc), 14, new Guid("77777777-0000-4000-8000-000000000014") },
                    { 15, 62, 2, null, false, new DateTime(2026, 3, 15, 0, 0, 0, 0, DateTimeKind.Utc), 15, new Guid("77777777-0000-4000-8000-000000000015") },
                    { 16, 98, 3, null, false, new DateTime(2026, 3, 15, 0, 0, 0, 0, DateTimeKind.Utc), 16, new Guid("77777777-0000-4000-8000-000000000016") },
                    { 17, 75, 2, null, false, new DateTime(2026, 3, 15, 0, 0, 0, 0, DateTimeKind.Utc), 17, new Guid("77777777-0000-4000-8000-000000000017") },
                    { 18, 128, 3, null, false, new DateTime(2026, 3, 15, 0, 0, 0, 0, DateTimeKind.Utc), 18, new Guid("77777777-0000-4000-8000-000000000018") },
                    { 19, 68, 2, null, false, new DateTime(2026, 3, 15, 0, 0, 0, 0, DateTimeKind.Utc), 19, new Guid("77777777-0000-4000-8000-000000000019") },
                    { 20, 101, 4, null, false, new DateTime(2026, 3, 15, 0, 0, 0, 0, DateTimeKind.Utc), 20, new Guid("77777777-0000-4000-8000-000000000020") }
                });

            migrationBuilder.InsertData(
                table: "StockEntries",
                columns: new[] { "Id", "CostValue", "CreatedAt", "DeletedAt", "EntryDate", "IsDeleted", "ProductId", "Quantity", "SupplierId", "Uuid" },
                values: new object[,]
                {
                    { 1, 17.20m, new DateTime(2026, 3, 5, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateOnly(2026, 3, 5), false, 1, 90, 4, new Guid("88888888-0000-4000-8000-000000000001") },
                    { 2, 9.60m, new DateTime(2026, 3, 5, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateOnly(2026, 3, 5), false, 2, 120, 5, new Guid("88888888-0000-4000-8000-000000000002") },
                    { 4, 11.50m, new DateTime(2026, 3, 6, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateOnly(2026, 3, 6), false, 4, 110, 6, new Guid("88888888-0000-4000-8000-000000000004") },
                    { 6, 8.20m, new DateTime(2026, 3, 7, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateOnly(2026, 3, 7), false, 6, 130, 5, new Guid("88888888-0000-4000-8000-000000000006") },
                    { 7, 31.50m, new DateTime(2026, 3, 8, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateOnly(2026, 3, 8), false, 7, 60, 2, new Guid("88888888-0000-4000-8000-000000000007") },
                    { 8, 18.20m, new DateTime(2026, 3, 8, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateOnly(2026, 3, 8), false, 8, 95, 6, new Guid("88888888-0000-4000-8000-000000000008") },
                    { 9, 24.80m, new DateTime(2026, 3, 9, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateOnly(2026, 3, 9), false, 9, 72, 2, new Guid("88888888-0000-4000-8000-000000000009") },
                    { 10, 10.70m, new DateTime(2026, 3, 9, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateOnly(2026, 3, 9), false, 10, 116, 5, new Guid("88888888-0000-4000-8000-000000000010") },
                    { 11, 20.40m, new DateTime(2026, 3, 10, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateOnly(2026, 3, 10), false, 11, 80, 1, new Guid("88888888-0000-4000-8000-000000000011") },
                    { 12, 9.90m, new DateTime(2026, 3, 10, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateOnly(2026, 3, 10), false, 12, 140, 6, new Guid("88888888-0000-4000-8000-000000000012") },
                    { 13, 31.00m, new DateTime(2026, 3, 11, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateOnly(2026, 3, 11), false, 13, 56, 1, new Guid("88888888-0000-4000-8000-000000000013") },
                    { 14, 19.40m, new DateTime(2026, 3, 11, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateOnly(2026, 3, 11), false, 14, 104, 5, new Guid("88888888-0000-4000-8000-000000000014") },
                    { 15, 22.10m, new DateTime(2026, 3, 12, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateOnly(2026, 3, 12), false, 15, 62, 4, new Guid("88888888-0000-4000-8000-000000000015") },
                    { 16, 12.40m, new DateTime(2026, 3, 12, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateOnly(2026, 3, 12), false, 16, 98, 6, new Guid("88888888-0000-4000-8000-000000000016") },
                    { 17, 44.60m, new DateTime(2026, 3, 13, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateOnly(2026, 3, 13), false, 17, 75, 2, new Guid("88888888-0000-4000-8000-000000000017") },
                    { 18, 26.10m, new DateTime(2026, 3, 13, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateOnly(2026, 3, 13), false, 18, 128, 6, new Guid("88888888-0000-4000-8000-000000000018") },
                    { 19, 18.90m, new DateTime(2026, 3, 14, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateOnly(2026, 3, 14), false, 19, 68, 4, new Guid("88888888-0000-4000-8000-000000000019") },
                    { 20, 11.20m, new DateTime(2026, 3, 14, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateOnly(2026, 3, 14), false, 20, 101, 6, new Guid("88888888-0000-4000-8000-000000000020") }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "DrugInteractions",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "DrugInteractions",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "DrugInteractions",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "DrugInteractions",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "DrugInteractions",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "DrugInteractions",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "ProductCategories",
                keyColumns: new[] { "CategoryId", "ProductId" },
                keyValues: new object[] { 1, 3 });

            migrationBuilder.DeleteData(
                table: "ProductCategories",
                keyColumns: new[] { "CategoryId", "ProductId" },
                keyValues: new object[] { 2, 3 });

            migrationBuilder.DeleteData(
                table: "ProductCategories",
                keyColumns: new[] { "CategoryId", "ProductId" },
                keyValues: new object[] { 1, 5 });

            migrationBuilder.DeleteData(
                table: "ProductCategories",
                keyColumns: new[] { "CategoryId", "ProductId" },
                keyValues: new object[] { 2, 5 });

            migrationBuilder.DeleteData(
                table: "ProductCategories",
                keyColumns: new[] { "CategoryId", "ProductId" },
                keyValues: new object[] { 1, 6 });

            migrationBuilder.DeleteData(
                table: "ProductCategories",
                keyColumns: new[] { "CategoryId", "ProductId" },
                keyValues: new object[] { 2, 6 });

            migrationBuilder.DeleteData(
                table: "ProductCategories",
                keyColumns: new[] { "CategoryId", "ProductId" },
                keyValues: new object[] { 4, 7 });

            migrationBuilder.DeleteData(
                table: "ProductCategories",
                keyColumns: new[] { "CategoryId", "ProductId" },
                keyValues: new object[] { 4, 8 });

            migrationBuilder.DeleteData(
                table: "ProductCategories",
                keyColumns: new[] { "CategoryId", "ProductId" },
                keyValues: new object[] { 4, 9 });

            migrationBuilder.DeleteData(
                table: "ProductCategories",
                keyColumns: new[] { "CategoryId", "ProductId" },
                keyValues: new object[] { 4, 10 });

            migrationBuilder.DeleteData(
                table: "ProductCategories",
                keyColumns: new[] { "CategoryId", "ProductId" },
                keyValues: new object[] { 5, 11 });

            migrationBuilder.DeleteData(
                table: "ProductCategories",
                keyColumns: new[] { "CategoryId", "ProductId" },
                keyValues: new object[] { 5, 12 });

            migrationBuilder.DeleteData(
                table: "ProductCategories",
                keyColumns: new[] { "CategoryId", "ProductId" },
                keyValues: new object[] { 9, 13 });

            migrationBuilder.DeleteData(
                table: "ProductCategories",
                keyColumns: new[] { "CategoryId", "ProductId" },
                keyValues: new object[] { 10, 13 });

            migrationBuilder.DeleteData(
                table: "ProductCategories",
                keyColumns: new[] { "CategoryId", "ProductId" },
                keyValues: new object[] { 9, 14 });

            migrationBuilder.DeleteData(
                table: "ProductCategories",
                keyColumns: new[] { "CategoryId", "ProductId" },
                keyValues: new object[] { 10, 14 });

            migrationBuilder.DeleteData(
                table: "ProductCategories",
                keyColumns: new[] { "CategoryId", "ProductId" },
                keyValues: new object[] { 2, 15 });

            migrationBuilder.DeleteData(
                table: "ProductCategories",
                keyColumns: new[] { "CategoryId", "ProductId" },
                keyValues: new object[] { 10, 15 });

            migrationBuilder.DeleteData(
                table: "ProductCategories",
                keyColumns: new[] { "CategoryId", "ProductId" },
                keyValues: new object[] { 2, 16 });

            migrationBuilder.DeleteData(
                table: "ProductCategories",
                keyColumns: new[] { "CategoryId", "ProductId" },
                keyValues: new object[] { 10, 16 });

            migrationBuilder.DeleteData(
                table: "ProductCategories",
                keyColumns: new[] { "CategoryId", "ProductId" },
                keyValues: new object[] { 3, 17 });

            migrationBuilder.DeleteData(
                table: "ProductCategories",
                keyColumns: new[] { "CategoryId", "ProductId" },
                keyValues: new object[] { 6, 17 });

            migrationBuilder.DeleteData(
                table: "ProductCategories",
                keyColumns: new[] { "CategoryId", "ProductId" },
                keyValues: new object[] { 3, 18 });

            migrationBuilder.DeleteData(
                table: "ProductCategories",
                keyColumns: new[] { "CategoryId", "ProductId" },
                keyValues: new object[] { 6, 18 });

            migrationBuilder.DeleteData(
                table: "ProductCategories",
                keyColumns: new[] { "CategoryId", "ProductId" },
                keyValues: new object[] { 2, 19 });

            migrationBuilder.DeleteData(
                table: "ProductCategories",
                keyColumns: new[] { "CategoryId", "ProductId" },
                keyValues: new object[] { 10, 19 });

            migrationBuilder.DeleteData(
                table: "ProductCategories",
                keyColumns: new[] { "CategoryId", "ProductId" },
                keyValues: new object[] { 2, 20 });

            migrationBuilder.DeleteData(
                table: "ProductCategories",
                keyColumns: new[] { "CategoryId", "ProductId" },
                keyValues: new object[] { 10, 20 });

            migrationBuilder.DeleteData(
                table: "ProductStocks",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "ProductStocks",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "ProductStocks",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "ProductStocks",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "ProductStocks",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "ProductStocks",
                keyColumn: "Id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "ProductStocks",
                keyColumn: "Id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "ProductStocks",
                keyColumn: "Id",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "ProductStocks",
                keyColumn: "Id",
                keyValue: 15);

            migrationBuilder.DeleteData(
                table: "ProductStocks",
                keyColumn: "Id",
                keyValue: 16);

            migrationBuilder.DeleteData(
                table: "ProductStocks",
                keyColumn: "Id",
                keyValue: 17);

            migrationBuilder.DeleteData(
                table: "ProductStocks",
                keyColumn: "Id",
                keyValue: 18);

            migrationBuilder.DeleteData(
                table: "ProductStocks",
                keyColumn: "Id",
                keyValue: 19);

            migrationBuilder.DeleteData(
                table: "ProductStocks",
                keyColumn: "Id",
                keyValue: 20);

            migrationBuilder.DeleteData(
                table: "StockEntries",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "StockEntries",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "StockEntries",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "StockEntries",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "StockEntries",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "StockEntries",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "StockEntries",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "StockEntries",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "StockEntries",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "StockEntries",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "StockEntries",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "StockEntries",
                keyColumn: "Id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "StockEntries",
                keyColumn: "Id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "StockEntries",
                keyColumn: "Id",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "StockEntries",
                keyColumn: "Id",
                keyValue: 15);

            migrationBuilder.DeleteData(
                table: "StockEntries",
                keyColumn: "Id",
                keyValue: 16);

            migrationBuilder.DeleteData(
                table: "StockEntries",
                keyColumn: "Id",
                keyValue: 17);

            migrationBuilder.DeleteData(
                table: "StockEntries",
                keyColumn: "Id",
                keyValue: 18);

            migrationBuilder.DeleteData(
                table: "StockEntries",
                keyColumn: "Id",
                keyValue: 19);

            migrationBuilder.DeleteData(
                table: "StockEntries",
                keyColumn: "Id",
                keyValue: 20);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 15);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 16);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 17);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 18);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 19);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 20);

            migrationBuilder.DeleteData(
                table: "Suppliers",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Suppliers",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Suppliers",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.InsertData(
                table: "ProductCategories",
                columns: new[] { "CategoryId", "ProductId" },
                values: new object[,]
                {
                    { 9, 3 },
                    { 10, 3 },
                    { 4, 5 },
                    { 5, 6 }
                });

            migrationBuilder.UpdateData(
                table: "ProductStocks",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "AvailableQuantity", "BlockedQuantity", "LastUpdated" },
                values: new object[] { 0, 0, new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.UpdateData(
                table: "ProductStocks",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "AvailableQuantity", "BlockedQuantity", "LastUpdated" },
                values: new object[] { 0, 0, new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.UpdateData(
                table: "ProductStocks",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "AvailableQuantity", "BlockedQuantity", "LastUpdated" },
                values: new object[] { 0, 0, new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.UpdateData(
                table: "ProductStocks",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "AvailableQuantity", "BlockedQuantity", "LastUpdated" },
                values: new object[] { 0, 0, new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.UpdateData(
                table: "ProductStocks",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "AvailableQuantity", "BlockedQuantity", "LastUpdated" },
                values: new object[] { 0, 0, new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.UpdateData(
                table: "ProductStocks",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "AvailableQuantity", "BlockedQuantity", "LastUpdated" },
                values: new object[] { 0, 0, new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Barcode", "Description", "ImageUrl", "Name", "PricingGroupId", "SalePrice" },
                values: new object[] { "7891234000001", "Indicado para alívio de dores leves a moderadas e redução da febre.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop&q=80", "Paracetamol 750mg", 3, 18.90m });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "ActivePrinciple", "Barcode", "Description", "ImageUrl", "Name", "SalePrice" },
                values: new object[] { "Ibuprofeno 600mg", "7891234000002", "Anti-inflamatório não esteroidal para dores musculares e febre.", "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop&q=80", "Ibuprofeno 600mg", 22.50m });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "ActivePrinciple", "Barcode", "Description", "ImageUrl", "Name", "PrescriptionType", "PricingGroupId", "SalePrice" },
                values: new object[] { "Amoxicilina Tri-hidratada 500mg", "7891234000003", "Antibiótico indicado para tratamento de infecções bacterianas.", "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=400&fit=crop&q=80", "Amoxicilina 500mg", 2, 1, 35.00m });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "ActivePrinciple", "Barcode", "Description", "ImageUrl", "Name", "SalePrice" },
                values: new object[] { "Dipirona Sódica 1g", "7891234000004", "Analgésico e antitérmico indicado para dores e febre.", "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&h=400&fit=crop&q=80", "Dipirona 1g", 15.75m });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "ActivePrinciple", "Barcode", "Description", "ImageUrl", "Name", "PricingGroupId", "SalePrice" },
                values: new object[] { "Loratadina 10mg", "7891234000005", "Antialérgico indicado para rinite, urticária e outras alergias.", "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400&h=400&fit=crop&q=80", "Loratadina 10mg", 3, 27.30m });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "ActivePrinciple", "Barcode", "Description", "ImageUrl", "Name", "SalePrice" },
                values: new object[] { "Omeprazol 20mg", "7891234000006", "Reduz a produção de ácido no estômago, indicado para gastrite e refluxo.", "https://images.unsplash.com/photo-1550572017-4fade5817617?w=400&h=400&fit=crop&q=80", "Omeprazol 20mg", 19.90m });

            migrationBuilder.UpdateData(
                table: "Suppliers",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "ContactEmail", "Name" },
                values: new object[] { "pedidos@hypermarcas.com.br", "Hypermarcas" });
        }
    }
}
