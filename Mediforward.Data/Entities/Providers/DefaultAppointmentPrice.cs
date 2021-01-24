using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Mediforward.Data.Entities
{
   public class DefaultAppointmentPrice: BaseColumns<int>
    {
        public int UserId { get; set; }
        [Column(TypeName = "money")]
        public double? AppointmentBasePrice { get; set; }
        public string Currency { get; set; }

    }
}
