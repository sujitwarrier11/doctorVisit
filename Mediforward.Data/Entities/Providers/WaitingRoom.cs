using System;
using System.Collections.Generic;
using System.Text;

namespace Mediforward.Data.Entities
{
   public class WaitingRoom: BaseColumns<int>
    {
        public int ProviderId { get; set; }
        public string RoomCode { get; set; }
        public string RoomName { get; set; }
        public bool IsActive { get; set; }
        public bool UsePasscode { get; set; }
        public string Type { get; set; }
    }
}
