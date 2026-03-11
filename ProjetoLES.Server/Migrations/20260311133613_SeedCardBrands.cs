using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ProjetoLES.Server.Migrations
{
    /// <inheritdoc />
    public partial class SeedCardBrands : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "CardBrands",
                columns: new[] { "Id", "DeletedAt", "IsActive", "IsDeleted", "Name", "Uuid" },
                values: new object[,]
                {
                    { 1, null, true, false, "Visa", new Guid("22222222-0000-4000-8000-000000000001") },
                    { 2, null, true, false, "Mastercard", new Guid("22222222-0000-4000-8000-000000000002") },
                    { 3, null, true, false, "Elo", new Guid("22222222-0000-4000-8000-000000000003") },
                    { 4, null, true, false, "American Express", new Guid("22222222-0000-4000-8000-000000000004") },
                    { 5, null, true, false, "Hipercard", new Guid("22222222-0000-4000-8000-000000000005") },
                    { 6, null, true, false, "Hiper", new Guid("22222222-0000-4000-8000-000000000006") },
                    { 7, null, true, false, "Diners Club", new Guid("22222222-0000-4000-8000-000000000007") },
                    { 8, null, true, false, "Cabal", new Guid("22222222-0000-4000-8000-000000000008") }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "CardBrands",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "CardBrands",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "CardBrands",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "CardBrands",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "CardBrands",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "CardBrands",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "CardBrands",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "CardBrands",
                keyColumn: "Id",
                keyValue: 8);
        }
    }
}
