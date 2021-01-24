using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Mediforward.Data.Migrations
{
    public partial class ForgotPasswordChange : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_ForgotPassowrd",
                table: "ForgotPassowrd");

            migrationBuilder.RenameTable(
                name: "ForgotPassowrd",
                newName: "ForgotPasswordToken");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ForgotPasswordToken",
                table: "ForgotPasswordToken",
                column: "Id");

            migrationBuilder.InsertData(
                table: "EmailTemplate",
                columns: new[] { "Id", "AddedBy", "AddedDate", "TemplateContent", "TemplateType", "UpdatedBy", "UpdatedDate" },
                values: new object[] { 5, null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), @"
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
                                <p style=""margin-bottom: 20px;"">We've made it really easy to reset your password. If you are already logged in, please log out first. Simply click on this link below: </p>
                                 <div style=""display:block; margin-left: auto; margin-right: auto;"">
                                      <p><a style=""height: 18px; width:125px; background-color: {6}; color: white;"" href=""{5}"">Reset my Password</a> </p>
                                 </div>
                                <p>Or Copy/Paste this link into your browser:</p>
                                <p><a href=""{5}"">{5}</a> </p>
                                <p> If it has been more than 24 hours since this email was sent, the link above will no longer reset your password. You can request another password reset link here:</p>
                                <div style=""display:block; margin-left: auto; margin-right: auto;"">
                                      <p><a style=""height: 18px; width:125px; background-color: {6}; color: white;"" href=""{7}"">Request new link.</a> </p>
                                 </div>
                              </div>
                           </div>
                         </div>   
                    </body>", "ForgotPassword", null, null });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_ForgotPasswordToken",
                table: "ForgotPasswordToken");

            migrationBuilder.DeleteData(
                table: "EmailTemplate",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.RenameTable(
                name: "ForgotPasswordToken",
                newName: "ForgotPassowrd");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ForgotPassowrd",
                table: "ForgotPassowrd",
                column: "Id");
        }
    }
}
