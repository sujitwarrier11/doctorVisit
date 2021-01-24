using System;
using System.Collections.Generic;
using System.Text;

namespace Mediforward.Models
{
   public class AppointmentModel : BaseModel
    {
        public int AppointmentId { get; set; }
        public int RoomId { get; set; }
        public int PatientId { get; set; }
        public string RoomSID { get; set; }

        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public string Name { get; set; }

        public List<CallParticipantModel> Participants { get; set; } = new List<CallParticipantModel>();

        public List<FileTransferModel> Files { get; set; } = new List<FileTransferModel>();
        public string RoomCode { get; set; }
        public List<PaymentModel> PaymentAttemptInformation { get; set; } = new List<PaymentModel>();
        public List<DoctorNoteModel> Notes { get; set; } = new List<DoctorNoteModel>();
    }
}
