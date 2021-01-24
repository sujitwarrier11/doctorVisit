using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Mediforward.Common.Identity
{

    public class User : IdentityUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public bool IsDeleted { get; set; }
        public Guid CreatedBy { get; set; }
        public bool SmsNotification { get; set; }
        public bool EmailNotification { get; set; }
    }

}
