using System;
using System.Collections.Generic;
using System.Text;

namespace Mediforward.Data.Entities
{
   public class UserAddressMapping: BaseColumns<int>
    {
        public string UserId { get; set; }
        public int AddressId { get; set; }
        public bool IsActive { get; set; }
    }
}
