using Mediforward.Common;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Mediforward.Data.Entities
{
   public class AppointmentPayment: BaseColumns<int>
    {
        public Appointment appointment { get; set; }

        [Column(TypeName ="money")]
        public double Amount { get; set; }
        public string TransactionId { get; set; }
        public TransactionStatus transactionStatus { get; set; }
    }
}
