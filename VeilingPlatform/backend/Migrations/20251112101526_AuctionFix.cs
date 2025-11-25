using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VeilingPlatform.Migrations
{
    /// <inheritdoc />
    public partial class AuctionFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "AuctionId",
                table: "Auctions",
                newName: "Id");

            migrationBuilder.AlterColumn<decimal>(
                name: "PriceSold",
                table: "ProductSolds",
                type: "decimal(10,2)",
                precision: 10,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AlterColumn<int>(
                name: "Length",
                table: "Products",
                type: "int",
                nullable: false,
                oldClrType: typeof(double),
                oldType: "float");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Auctions",
                newName: "AuctionId");

            migrationBuilder.AlterColumn<decimal>(
                name: "PriceSold",
                table: "ProductSolds",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(10,2)",
                oldPrecision: 10,
                oldScale: 2);

            migrationBuilder.AlterColumn<double>(
                name: "Length",
                table: "Products",
                type: "float",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");
        }
    }
}
