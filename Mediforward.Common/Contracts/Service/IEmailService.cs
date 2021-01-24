using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Mediforward.Common.Contracts
{
    public interface IEmailService
    {
        Task SendEmail(string toEmailId, string Message,string subject);
    }
}
