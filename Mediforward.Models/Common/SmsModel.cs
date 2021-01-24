using System;
using System.Collections.Generic;
using System.Text;

namespace Mediforward.Models
{
    public class SmsModel : BaseModel
    {
        public string Number { get; set; }
        public int RoomId { get; set; }
        public string UserId { get; set; }
        public string HostName { get; set; }
    }
}
