using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Mediforward.Data.Migrations
{
    public partial class room_with_code_template : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "EmailTemplate",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "TemplateContent", "TemplateType" },
                values: new object[] { @"
                    <!DOCTYPE html PUBLIC ""-//W3C//DTD XHTML 1.0 Transitional//EN"" ""https://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"">
                     <html xmlns=""https://www.w3.org/1999/xhtml"">
                      <head>
                        <title>Invitation</title>
                        <meta http–equiv=""Content-Type"" content=""text/html; charset=UTF-8"" />
                        <meta http–equiv=""X-UA-Compatible"" content=""IE=edge"" />
                        <meta name=""viewport"" content=""width=device-width, initial-scale=1.0 "" />
                     </head>
                     <body style=""margin:0px; padding:0px;"" >
                         <div style=""display: flex; box-sizing: border-box; flex-direction: column; align-items: center; justify-content: center; background-color: {0}; width:100%;"">
                            <div style=""margin: auto; background-color: {1}; box-sizing: border-box; width: 70%; padding: 20px;"">
                              <div style=""display: flex; box-sizing: border-box; flex-direction: column; align-items: center; justify-content: center; border-bottom: {2};"">
                                <img src=""{3}"" height=""95"" width = ""140"" />
                              </div>
                              <div style=""display: block; box-sizing: border-box; flex-direction: column; align-items: center; justify-content: center;"">
                                <p>Hello,{4} has invited you to join a secure video call:</p>
                                <p><a href=""{5}"">{5}</a> </p>
                                 <p>Please use the code {6} to enter the room.</p>
                                <p> Make sure you are using a device with good internet connection and access to camera/audio. If you need any assistance please contact your provider directly.</p>
                              </div>
                           </div>
                         </div>   
                    </body>", "RoomInviteWithCode" });

            migrationBuilder.InsertData(
                table: "EmailTemplate",
                columns: new[] { "Id", "AddedBy", "AddedDate", "TemplateContent", "TemplateType", "UpdatedBy", "UpdatedDate" },
                values: new object[] { 4, null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "{0} now in the {1} waiting room. click the link to start consultation: {2}", "RoomInviteSMSWithCode", null, null });

            migrationBuilder.InsertData(
                table: "EmailTemplate",
                columns: new[] { "Id", "AddedBy", "AddedDate", "TemplateContent", "TemplateType", "UpdatedBy", "UpdatedDate" },
                values: new object[] { 3, null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "{0} now in the {1} waiting room. click the link to start consultation: {2}", "RoomInviteSMS", null, null });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "EmailTemplate",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "EmailTemplate",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.UpdateData(
                table: "EmailTemplate",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "TemplateContent", "TemplateType" },
                values: new object[] { "{0} now in the {1} waiting room. click the link to start consultation: {2}", "RoomInviteSMS" });
        }
    }
}
