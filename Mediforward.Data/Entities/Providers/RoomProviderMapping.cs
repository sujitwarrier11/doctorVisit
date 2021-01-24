using System;
using System.Collections.Generic;
using System.Text;

namespace Mediforward.Data.Entities
{
   public class RoomProviderMapping: BaseColumns<int>
    {
        public int RoomId { get; set; }
        public int ProviderId { get; set; }
        public bool IsPrimaryOwner { get; set; }
        public string SocketId { get; set; }
        public bool IsActive { get; set; }
    }
}
