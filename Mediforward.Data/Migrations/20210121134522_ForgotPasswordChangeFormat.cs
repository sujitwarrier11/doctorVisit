using Microsoft.EntityFrameworkCore.Migrations;

namespace Mediforward.Data.Migrations
{
    public partial class ForgotPasswordChangeFormat : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "EmailTemplate",
                keyColumn: "Id",
                keyValue: 5,
                column: "TemplateContent",
                value: @"
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
                                 <div style=""display:block; margin-left: auto; margin-right: auto; width: 100%;"">
                                      <p><a style=""height: 18px; width:125px; background-color: {6}; color: white;"" href=""{5}"">Reset my Password</a> </p>
                                 </div>
                                <p>Or Copy/Paste this link into your browser:</p>
                                <p><a href=""{5}"">{5}</a> </p>
                                <p> If it has been more than 24 hours since this email was sent, the link above will no longer reset your password. You can request another password reset link here:</p>
                                <div style=""display:block; margin-left: auto; margin-right: auto; width: 100%;"">
                                      <p><a style=""height: 18px; width:125px; background-color: {6}; color: white;"" href=""{7}"">Request new link.</a> </p>
                                 </div>
                              </div>
                           </div>
                         </div>   
                    </body>");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "EmailTemplate",
                keyColumn: "Id",
                keyValue: 5,
                column: "TemplateContent",
                value: @"
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
                    </body>");
        }
    }
}
