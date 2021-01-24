using Microsoft.EntityFrameworkCore.Migrations;

namespace Mediforward.Data.Migrations
{
    public partial class payment_error : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ErrorJson",
                table: "Orders",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ErrorJson",
                table: "Orders");
        }
    }
}
