using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Mediforward.Common.Contracts
{
   public interface ISMSService
    {
        Task SendSMS(string phoneNumber, string body);
    }
}
