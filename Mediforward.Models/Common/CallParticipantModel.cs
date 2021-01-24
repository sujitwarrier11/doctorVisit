using System;
using System.Collections.Generic;
using System.Text;

namespace Mediforward.Models
{
   public class CallParticipantModel : BaseModel
    {
        public int AppointmentId { get; set; }
        public string Role { get; set; }
        public string SocketId { get; set; }
        public int ParticipantId { get; set; }
        public int RoomId { get; set; }
        public string Status { get; set; }
        public string Name { get; set; }
    }
}
