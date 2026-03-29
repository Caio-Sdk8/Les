using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjetoLES.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddTransactionMetadataJson : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "MetadataJson",
                table: "Transactions",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MetadataJson",
                table: "Transactions");
        }
    }
}
