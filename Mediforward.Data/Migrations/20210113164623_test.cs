using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Mediforward.Data.Migrations
{
    public partial class test : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "EmailTemplate",
                columns: new[] { "Id", "AddedBy", "AddedDate", "TemplateContent", "TemplateType", "UpdatedBy", "UpdatedDate" },
                values: new object[] { 2, null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "{0} now in the {1} waiting room. click the link to start consultation: {2}", "RoomInviteSMS", null, null });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "EmailTemplate",
                keyColumn: "Id",
                keyValue: 2);
        }
    }
}
