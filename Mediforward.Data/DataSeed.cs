using Mediforward.Common;
using Mediforward.Data.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Reflection.Emit;
using System.Text;

namespace Mediforward.Data
{
    public static class DataSeed
    {
        public static void Initialize(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Speciality>().HasData(
             new Speciality { Id = 1, SpecialityName = "Allergy" },
             new Speciality { Id = 2, SpecialityName = "Audiology" },
             new Speciality { Id = 3, SpecialityName = "Cardiology" },
             new Speciality { Id = 4, SpecialityName = "Cardiothorasic Surgery" },
             new Speciality { Id = 5, SpecialityName = "Chiropractic Medicine" },
             new Speciality { Id = 6, SpecialityName = "Dermatology" },
             new Speciality { Id = 7, SpecialityName = "Endocrinology" },
             new Speciality { Id = 8, SpecialityName = "Family Medicine" },
             new Speciality { Id = 9, SpecialityName = "Gastroenterology" },
             new Speciality { Id = 10, SpecialityName = "General Surgery" },
             new Speciality { Id = 11, SpecialityName = "Hematology And Oncology" },
             new Speciality { Id = 12, SpecialityName = "Infectious Diseases" },
             new Speciality { Id = 13, SpecialityName = "Integrative Medicine" },
             new Speciality { Id = 14, SpecialityName = "Internal Medicine" },
             new Speciality { Id = 15, SpecialityName = "Neurology" },
             new Speciality { Id = 16, SpecialityName = "Obstetrics And Gynecology" },
             new Speciality { Id = 17, SpecialityName = "Opthamology" },
             new Speciality { Id = 18, SpecialityName = "Optometry" },
             new Speciality { Id = 19, SpecialityName = "Orthopedic Surgery" },
             new Speciality { Id = 20, SpecialityName = "Otolaryngology" },
             new Speciality { Id = 21, SpecialityName = "Pediatrics" },
             new Speciality { Id = 22, SpecialityName = "Plastic Surgery" },
             new Speciality { Id = 23, SpecialityName = "Podiatry" },
             new Speciality { Id = 24, SpecialityName = "Pulmomology" },
             new Speciality { Id = 25, SpecialityName = "Rheumatology" },
             new Speciality { Id = 26, SpecialityName = "Urology" },
             new Speciality { Id = 27, SpecialityName = "Pharmacy" },
             new Speciality { Id = 28, SpecialityName = "Oncology" }
          );
            modelBuilder.Entity<AppTheme>().HasData(new AppTheme { IsDefault = true, Id = 1, HostName = "default" });
            modelBuilder.Entity<ThemeElements>().HasData(
                new ThemeElements { Id = 1, ThemeId = 1, Type = ThemeContentType.Logo, Content = "/static/defaultTheme/logo.png" },
                new ThemeElements { Id = 2, ThemeId = 1, Type = ThemeContentType.MainBackgroundColor, Content = "#f4f6f5" },
                new ThemeElements { Id = 3, ThemeId = 1, Type = ThemeContentType.ThemeSubColor1, Content = "#029ba7" },
                new ThemeElements { Id = 4, ThemeId = 1, Type = ThemeContentType.ThemeSubColor2, Content = "#fff" },
                new ThemeElements { Id = 5, ThemeId = 1, Type = ThemeContentType.FontFamily, Content = "ProximaNova,Helvetica Neue,Helvetica,Arial,sans-serif" },
                new ThemeElements { Id = 6, ThemeId = 1, Type = ThemeContentType.NavlinkFontColor, Content = "#737373" },
                new ThemeElements { Id = 7, ThemeId = 1, Type = ThemeContentType.MainTitleFontColor, Content = "#000" },
                new ThemeElements { Id = 8, ThemeId = 1, Type = ThemeContentType.MainTitleFontSize, Content = "32px" },
                new ThemeElements { Id = 9, ThemeId = 1, Type = ThemeContentType.RegularTextColor, Content = "#5f6a7d" },
                new ThemeElements { Id = 10, ThemeId = 1, Type = ThemeContentType.MainSubtitleFontSize, Content = "14px" },
                new ThemeElements { Id = 11, ThemeId = 1, Type = ThemeContentType.RegularFontSize, Content = "12px" },
                new ThemeElements { Id = 12, ThemeId = 1, Type = ThemeContentType.NavLinkFontSize, Content = "14px" }
            );
            modelBuilder.Entity<EmailTemplates>().HasData(
                new EmailTemplates { Id = 1, TemplateType = "RoomInvite", TemplateContent = @"
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
                    </body>" },
                                new EmailTemplates { Id = 2, TemplateType = "RoomInviteWithCode", TemplateContent = @"
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
                    </body>" },
                new EmailTemplates { Id = 3, TemplateType = "RoomInviteSMS", TemplateContent = "{0} now in the {1} waiting room. click the link to start consultation: {2}" },
                 new EmailTemplates { Id = 4, TemplateType = "RoomInviteSMSWithCode", TemplateContent = "{0} now in the {1} waiting room. click the link to start consultation: {2}" },
                new EmailTemplates { Id = 5, TemplateType = "ForgotPassword", TemplateContent = @"
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
                    </body>" },
                  new EmailTemplates { Id = 6, TemplateType = "Patientjoined", TemplateContent = @"
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
                    </body>" },
                  new EmailTemplates { Id = 7, TemplateType = "PatientjoinedSMS", TemplateContent = @"Patient {0} has joined room {1}" },
                  new EmailTemplates { Id = 8, TemplateType = "PatientUploadedFile", TemplateContent = @"
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
                                <p style=""margin-bottom: 20px;"">Patient {5} has uploaded File</p>
                                 <div style=""display:block; margin-left: auto; margin-right: auto; width: 100%;"">
                                      <p><a style=""height: 25px; width:125px; background-color: {8}; color: white;"" href=""{6}"">{7}</a> </p>
                                 </div>
                              </div>
                           </div>
                         </div>   
                    </body>" }
            );
        }
    }
}
