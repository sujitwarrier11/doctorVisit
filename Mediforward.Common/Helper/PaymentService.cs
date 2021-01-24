using Mediforward.Common.Contracts;
using Mediforward.Common.Helper;
using Mediforward.Models;
using Newtonsoft.Json.Linq;
using Razorpay.Api;
using System;
using System.Collections.Generic;
using System.Net;
using System.Security.Cryptography;
using System.Text;

namespace Mediforward.Common
{
    public class PaymentService: IPaymentService
    {

        public PaymentModel CreateOrder(PaymentModel model)
        {

            RazorpayClient client = new RazorpayClient(ConfigurationManager.AppSetting.RazorPaySetting.apiKey, ConfigurationManager.AppSetting.RazorPaySetting.appSecret);
            System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            Dictionary<string, object> options = new Dictionary<string, object>();

            options.Add("amount", model.Amount*100);
            options.Add("currency", "INR");
            options.Add("receipt", model.ReceiptId);

            Order order = client.Order.Create(options);
            JObject result = JObject.Parse(order.Attributes.ToString());
            model.RazorPayOrderId = (string)result["id"];
            return model;
        }

        public  bool VerifyOrderStatus(string orderId, string paymentId, string signature)
        {
            try
            {
                RazorpayClient client = new RazorpayClient(ConfigurationManager.AppSetting.RazorPaySetting.apiKey, ConfigurationManager.AppSetting.RazorPaySetting.appSecret);
                Dictionary<string, string> attributes = new Dictionary<string, string>();

                attributes.Add("razorpay_payment_id", paymentId);
                attributes.Add("razorpay_order_id", orderId);
                attributes.Add("razorpay_signature", signature);
                Utils.verifyPaymentSignature(attributes);

                return true;
            }catch(Exception ex)
            {
                return false;
            }
        }
    }
}
