using Mediforward.Common.Contracts;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace Mediforward.Common.Helper
{
    public class EmailService : IEmailService
    {
        private readonly SmtpClient client;
        private readonly MailAddress fromAddress;
        static bool mailSent = false;
        private static void SendCompletedCallback(object sender, AsyncCompletedEventArgs e)
        {
            // Get the unique identifier for this asynchronous operation.
            String token = (string)e.UserState;

            if (e.Cancelled)
            {
                Console.WriteLine("[{0}] Send canceled.", token);
            }
            if (e.Error != null)
            {
                Console.WriteLine("error: {0}", e.Error);
            }
            else
            {
                Console.WriteLine("Message sent.");
            }
            mailSent = true;
        }

        public EmailService()
        {
            var smptSetting = ConfigurationManager.AppSetting.SmtpSetting;
            client = new SmtpClient(smptSetting.Host, smptSetting.Port);
            client.UseDefaultCredentials = true;
            client.Credentials = new NetworkCredential(smptSetting.UserName, smptSetting.Password);
            client.SendCompleted += new
            SendCompletedEventHandler(SendCompletedCallback);
            client.EnableSsl = smptSetting.EnableSsl;
            fromAddress = new MailAddress(smptSetting.FromAddress);
        }
        public async Task SendEmail(string toEmailId, string Message, string subject)
        {
            MailAddress toAddress = new MailAddress(toEmailId);
            MailMessage message = new MailMessage(fromAddress, toAddress);
            message.Body = Message;
            message.Subject = subject;
            message.IsBodyHtml = true;
            try
            {
                client.SendAsync(message, "token");
            }catch(Exception ex)
            {

            }
        }
    }
}
