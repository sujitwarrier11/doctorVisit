using System;
using System.Collections.Generic;
using System.Text;

namespace Mediforward.Data.Entities
{
    public class CallParticipants: BaseColumns<int>
    {
        public int AppointmentId { get; set; }
        public string  Role { get; set; }
        public string SocketId { get; set; }
        public int ParticipantId { get; set; }
        public int RoomId { get; set; }
        public string Status { get; set; }
    }
}
