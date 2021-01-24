using System;
using System.Collections.Generic;
using System.Text;

namespace Mediforward.Models
{
    public class MeetingHistoryModel : BaseModel
    {
        public List<AppointmentModel> Appointments { get; set; }
        public int TotalPages { get; set; }
    }
}
