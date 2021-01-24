using System;
using System.Collections.Generic;
using System.Text;

namespace Mediforward.Models
{
   public class AddressModel : BaseModel
    {
        public int AddressType { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
        public string Pincode { get; set; }
    }
}
