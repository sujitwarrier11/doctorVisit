using System;
using System.Collections.Generic;
using System.Text;

namespace Mediforward.Models
{
   public class WaitingRoomModel : BaseModel
    {
        public int Id { get; set; }
        public string RoomName { get; set; }
        public string RoomCode { get; set; }
        public int ProviderId { get; set; }
        public List<ElementModel> Elements { get; set; } = new List<ElementModel>();
        public string Path { get; set; }
        public bool UsePasscode { get; set; }
        public bool DashboardCamEnabled { get; set; }
        public string ProfilePicture { get; set; }
        public string UserId { get; set; }
        public string Type { get; set; }
    }
}
