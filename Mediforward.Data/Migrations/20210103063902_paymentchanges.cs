using Microsoft.EntityFrameworkCore.Migrations;

namespace Mediforward.Data.Migrations
{
    public partial class paymentchanges : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TransactionId",
                table: "Orders");

            migrationBuilder.AddColumn<string>(
                name: "RazorPayPaymentId",
                table: "Orders",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RazorPaySignature",
                table: "Orders",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RazorPayPaymentId",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "RazorPaySignature",
                table: "Orders");

            migrationBuilder.AddColumn<string>(
                name: "TransactionId",
                table: "Orders",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
