using Microsoft.EntityFrameworkCore.Migrations;

namespace Mediforward.Data.Migrations
{
    public partial class notification : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "AllowEmail",
                table: "Institutions",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "AllowSms",
                table: "Institutions",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "EmailTemplate",
                keyColumn: "Id",
                keyValue: 1,
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
                                <p>Hello,{4} has invited you to join a secure video call:</p>
                                <p><a href=""{5}"">{5}</a> </p>
                                <p> Make sure you are using a device with good internet connection and access to camera/audio. If you need any assistance please contact your provider directly.</p>
                              </div>
                           </div>
                         </div>   
                    </body>");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AllowEmail",
                table: "Institutions");

            migrationBuilder.DropColumn(
                name: "AllowSms",
                table: "Institutions");

            migrationBuilder.UpdateData(
                table: "EmailTemplate",
                keyColumn: "Id",
                keyValue: 1,
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
                         <div style=""display: flex; box-sizing: border-box; flex-direction: column; align-items: center; justify-content: center; background-color: {0}; width:100%;"">
                            <div style=""margin: auto; background-color: {1}; box-sizing: border-box; width: 70%; padding: 20px;"">
                              <div style=""display: flex; box-sizing: border-box; flex-direction: column; align-items: center; justify-content: center; border-bottom: {2};"">
                                <img src=""{3}"" height=""95"" width = ""140"" />
                              </div>
                              <div style=""display: block; box-sizing: border-box; flex-direction: column; align-items: center; justify-content: center;"">
                                <p>Hello,{4} has invited you to join a secure video call:</p>
                                <p><a href=""{5}"">{5}</a> </p>
                                <p> Make sure you are using a device with good internet connection and access to camera/audio. If you need any assistance please contact your provider directly.</p>
                              </div>
                           </div>
                         </div>   
                    </body>");
        }
    }
}
