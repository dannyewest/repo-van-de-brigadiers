using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VeilingPlatform.Migrations
{
    /// <inheritdoc />
    public partial class AddAmountToProductSold : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Amount",
                table: "ProductSold",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Amount",
                table: "ProductSold");
        }
    }
}
