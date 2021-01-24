using System;
using System.Collections.Generic;
using System.Text;

namespace Mediforward.Models
{
    public class DoctorNoteModel
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public string NoteContent { get; set; }
        public int AppointmentId { get; set; }
        public DateTime AddedDate { get; set; }
    }
}
