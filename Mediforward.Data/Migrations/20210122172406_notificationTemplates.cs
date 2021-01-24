using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Mediforward.Data.Migrations
{
    public partial class notificationTemplates : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "EmailTemplate",
                columns: new[] { "Id", "AddedBy", "AddedDate", "TemplateContent", "TemplateType", "UpdatedBy", "UpdatedDate" },
                values: new object[] { 6, null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), @"
                    <!DOCTYPE html PUBLIC ""-//W3C//DTD XHTML 1.0 Transitional//EN"" ""https://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"">
                     <html xmlns=""https://www.w3.org/1999/xhtml"">
                      <head>
                        <title>Invitation</title>
                        <meta http–equiv=""Content-Type"" content=""text/html; charset=UTF-8"" />
                        <meta http–equiv=""X-UA-Compatible"" content=""IE=edge"" />
                        <meta name=""viewport"" content=""width=device-width, initial-scale=1.0 "" />
                     </head>
                     <body style=""margin:0px; padding:0px;"" >
                         <div style=""display: block; box-sizing: border-box; background-color: {0}; width:100%;"">
                            <div style=""margin: auto; background-color: {1}; box-sizing: border-box; width: 70%; padding: 20px;"">
                              <div style=""display: block; box-sizing: border-box; width: 100%; align-items: center; justify-content: center; border-bottom: {2};"">
                                <img src=""{3}"" height=""95"" width = ""140"" style=""display: block; margin-left: auto; margin-right: auto;"" />
                              </div>
                              <div style=""display: block; box-sizing: border-box;"">
                                <p>Hi,{4}</p>
                                <p style=""margin-bottom: 20px;"">Patient {5} has joined room {6}</p>
                              </div>
                           </div>
                         </div>   
                    </body>", "Patientjoined", null, null });

            migrationBuilder.InsertData(
                table: "EmailTemplate",
                columns: new[] { "Id", "AddedBy", "AddedDate", "TemplateContent", "TemplateType", "UpdatedBy", "UpdatedDate" },
                values: new object[] { 7, null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Patient {0} has joined room {1}", "PatientjoinedSMS", null, null });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "EmailTemplate",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "EmailTemplate",
                keyColumn: "Id",
                keyValue: 7);
        }
    }
}
