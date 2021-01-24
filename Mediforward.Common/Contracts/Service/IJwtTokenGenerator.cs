using Mediforward.Common.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Mediforward.Common.Contracts
{
    public interface IJwtTokenGenerator
    {
        Task<string> GenerateToken(User user);
    }
}
