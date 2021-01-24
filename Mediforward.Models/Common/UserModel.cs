using System;
using System.Collections.Generic;
using System.Text;

namespace Mediforward.Models
{
   public class UserModel : BaseModel
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Password { get; set; }
        public string Token { get; set; }
    }
}
