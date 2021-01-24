using System;
using System.Collections.Generic;
using System.Text;

namespace Mediforward.Models
{
   public class EmailModel: BaseModel
    {
        public string Email { get; set; }
        public int RoomId { get; set; }
        public string  UserId { get; set; }
        public string HostName { get; set; }
    }
}
