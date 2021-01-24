using Mediforward.Common.Contracts;
using Mediforward.Common.Helper;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using Twilio;
using Twilio.Rest.Api.V2010.Account;

namespace Mediforward.Common
{
    public class SMSService : ISMSService
    {
        static readonly HttpClient client = new HttpClient();
        public async Task SendSMS(string phoneNumbers, string body)
        {
            String message = HttpUtility.UrlEncode(body);
            string[] numbers = phoneNumbers.Split(",");
            string allNumbers = "";
            foreach (string number in numbers)
            {
                allNumbers += $"91{phoneNumbers.Replace("+91", "")},";
            }

            using (var wb = new WebClient())
            {
                byte[] response = wb.UploadValues("https://api.textlocal.in/send/", new NameValueCollection()
                {
                {"apikey" ,ConfigurationManager.AppSetting.SmsSetting.ApiKey},
                {"numbers" , allNumbers.TrimEnd(',') },
                {"message" , message},
                {"sender" , ConfigurationManager.AppSetting.SmsSetting.SmsHeader}
                });
                string result = System.Text.Encoding.UTF8.GetString(response);
                //return result;
                Console.WriteLine(result);
            }
            //var result = await client.PostAsync($"{ConfigurationManager.AppSetting.SmsSetting.APIUrl}/send/", new StringContent(content, Encoding.UTF8, "application/json"));

        }
    }
}
