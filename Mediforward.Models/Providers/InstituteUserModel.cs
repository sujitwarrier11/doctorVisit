using System;
using System.Collections.Generic;
using System.Text;

namespace Mediforward.Models
{
   public class InstituteUserModel : BaseModel
    {
        public int ProviderId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string CurrentRole { get; set; }
        public string RoomName { get; set; }
        public bool Allowed { get; set; }
    }
}
