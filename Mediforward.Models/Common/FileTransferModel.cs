using System;
using System.Collections.Generic;
using System.Text;

namespace Mediforward.Models
{
   public class FileTransferModel : BaseModel
    {
        public int ParticipantId { get; set; }

        public int? AppointmentId { get; set; }
        public int? RoomId { get; set; }

        public string FileName { get; set; }
        public string Extension { get; set; }
        public string Path { get; set; }
        public string Role { get; set; }

        public string SharedBy { get; set; }

    }
}
