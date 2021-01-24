using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Text;

namespace Mediforward.Data
{
   public class AppRoleContext : RoleManager<IdentityRole>
    {
        public AppRoleContext(IRoleStore<IdentityRole> store,
                    IEnumerable<IRoleValidator<IdentityRole>> roleValidators,
                    ILookupNormalizer keyNormalizer,
                         IdentityErrorDescriber errors,
                            ILogger<RoleManager<IdentityRole>> logger)
       : base(store, roleValidators, keyNormalizer, errors, logger)
        {
        }
    }
}
