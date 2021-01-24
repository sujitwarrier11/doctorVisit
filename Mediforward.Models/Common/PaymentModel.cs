using System;
using System.Collections.Generic;
using System.Text;

namespace Mediforward.Models
{
   public class PaymentModel:BaseModel
    {
        public int Id { get; set; }
        public string RazorPayOrderId { get; set; }
        public decimal Amount { get; set; }
        public int AppointmentId { get; set; }
        public int PayeeId { get; set; }
        public string PaymentStatus { get; set; }
        public string TransactionId { get; set; }
        public string ReceiptId { get; set; }
        public string ErrorJson { get; set; }
        public string RazorPayPaymentId { get; set; }
        public string RazorPaySignature { get; set; }
        public int ProviderId { get; set; }
    }
}
