using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Mediforward.Data.Entities
{
    public class AppointmentOrders : BaseColumns<int>
    {
        public string RazorPayOrderId { get; set; }
        [Column(TypeName = "money")]
        public decimal Amount { get; set; }
        public int AppointmentId { get; set; }
        public int PayeeId { get; set; }
        public string PaymentStatus { get; set; }
        public string RazorPayPaymentId { get; set; }
        public string RazorPaySignature { get; set; }
        public string ReceiptId { get; set; }
        public string ErrorJson { get; set; }
    }
}
