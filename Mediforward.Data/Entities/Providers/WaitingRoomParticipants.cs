using System;
using System.Collections.Generic;
using System.Text;

namespace Mediforward.Data.Entities
{
   public class WaitingRoomParticipants: BaseColumns<int>
    {
        public int WaitingRoomId { get; set; }
        public int PatientId { get; set; }
        public DateTime LastPing { get; set; }
        public bool IsConnected { get; set; }
    }
}
