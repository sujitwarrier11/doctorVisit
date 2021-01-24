using Mediforward.Common.Contracts;
using Mediforward.Common.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;

namespace Mediforward.Common.Helper
{
    public class JwtTokenGenerator : IJwtTokenGenerator
    {
        private readonly UserManager<User> _userManager;
        private readonly JwtIssuerOptions _jwtOptions;
        private readonly IConfiguration _configuration;

        public JwtTokenGenerator(UserManager<User> userManager, IOptions<JwtIssuerOptions> jwtOptions, IConfiguration configuration)
        {
            _userManager = userManager;
            _jwtOptions = jwtOptions.Value;
            _configuration = configuration;
        }
        public async Task<string> GenerateToken(User user)
        {
            try
            {
                var identity = await GenerateClaimsIdentity(user);

                string jwt = await GenerateEncodedToken(user.Email, identity);

                return jwt;
            }
            catch(Exception ex)
            {
                return null;
            }
        }

        private async Task<ClaimsIdentity> GenerateClaimsIdentity(User user)
        {
            var roles = await _userManager.GetRolesAsync(user);

            var claimsIdentity = new ClaimsIdentity(new GenericIdentity(user.Id, "Token"), new[]
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim("UserId", user.Id)
            });

            foreach (var role in roles)
                claimsIdentity.AddClaim(new Claim(ClaimTypes.Role, role));

            return claimsIdentity;
        }



        public async Task<string> GenerateEncodedToken(string userName, ClaimsIdentity identity)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Jti, await _jwtOptions.JtiGenerator()),
                new Claim(JwtRegisteredClaimNames.Iat, ToUnixEpochDate(_jwtOptions.IssuedAt).ToString(),
                    ClaimValueTypes.Integer64),
                identity.FindFirst(ClaimTypes.NameIdentifier)
            };

            claims.AddRange(identity.FindAll(System.Security.Claims.ClaimTypes.Role));
            var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(ConfigurationManager.AppSetting.Jwt.SecretKey));
            // Create the JWT security token and encode it.
            var jwt = new JwtSecurityToken(
                issuer: ConfigurationManager.AppSetting.Jwt.Issuer,
                audience: ConfigurationManager.AppSetting.Jwt.Audience,
                expires: DateTime.Now.AddHours(3),
                claims:claims,
                signingCredentials: new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256));


            var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

            return encodedJwt;
        }

        private static long ToUnixEpochDate(DateTime date)
            => (long)Math.Round((date.ToUniversalTime() -
                                 new DateTimeOffset(1970, 1, 1, 0, 0, 0, TimeSpan.Zero))
                .TotalSeconds);

        private static void ThrowIfInvalidOptions(JwtIssuerOptions options)
        {
            if (options == null) throw new ArgumentNullException(nameof(options));

            if (options.ValidFor <= TimeSpan.Zero.Seconds)
            {
                throw new ArgumentException("Must be a non-zero TimeSpan.", nameof(JwtIssuerOptions.ValidFor));
            }

            if (options.SigningCredentials == null)
            {
                throw new ArgumentNullException(nameof(JwtIssuerOptions.SigningCredentials));
            }

            if (options.JtiGenerator == null)
            {
                throw new ArgumentNullException(nameof(JwtIssuerOptions.JtiGenerator));
            }
        }
    }

}
