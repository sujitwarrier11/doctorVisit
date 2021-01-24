using Mediforward.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace Mediforward.Data.Entities
{
    public class Appointment: BaseColumns<int>
    {
        public int ProviderId { get; set; }
        public int PatientId { get; set; }
        public AppointmentStatus appointmentStatus { get; set; }
        public AppointmentType appointmentType { get; set; }
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public string RoomSID { get; set; }
        public string RoomName { get; set; }
        public int RoomId { get; set; }
        public PaymentStatus paymentStatus { get; set; }
    }
}
