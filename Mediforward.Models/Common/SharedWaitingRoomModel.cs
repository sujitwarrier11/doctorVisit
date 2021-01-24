using System;
using System.Collections.Generic;
using System.Text;

namespace Mediforward.Models
{
  public  class SharedWaitingRoomModel: BaseModel
    {
        public WaitingRoomModel RoomDetails { get; set; }
        public List<int> Providers { get; set; }
    }
}
