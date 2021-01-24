using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Mediforward.Common.Helper
{
    public class JwtIssuerOptions
    {
        public string Issuer { get; set; }

        public string Subject { get; set; }

        public string Audience { get; set; }

        public DateTime Expiration => IssuedAt.Add(TimeSpan.FromSeconds(ValidFor));

        public DateTime NotBefore => DateTime.UtcNow;

        public DateTime IssuedAt => DateTime.UtcNow;

        public int ValidFor { get; set; } = 182 * 24 * 60 * 60;

        public Func<Task<string>> JtiGenerator =>
          () => Task.FromResult(Guid.NewGuid().ToString());

        public string SecretKey { get; set; }

        public SigningCredentials SigningCredentials { get; set; }
    }

}
