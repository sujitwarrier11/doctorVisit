using Mediforward.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Mediforward.Common.Contracts
{
    public interface IPaymentService
    {
        PaymentModel CreateOrder(PaymentModel nodel);
        bool VerifyOrderStatus(string orderId, string paymentId, string signature);
    }
}
