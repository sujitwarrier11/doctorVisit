using System;
using System.Collections.Generic;
using System.Text;

namespace Mediforward.Data.Entities
{
   public class DoctorNotes: BaseColumns<int>
    {
        public int PatientId { get; set; }
        public string NoteContent { get; set; }
        public int AppointmentId { get; set; }
    }
}
