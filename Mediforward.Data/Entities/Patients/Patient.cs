using System;
using System.Collections.Generic;
using System.Text;

namespace Mediforward.Data.Entities
{
    public class Patient : BaseColumns<int>
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string UserId { get; set; }
    }
}
