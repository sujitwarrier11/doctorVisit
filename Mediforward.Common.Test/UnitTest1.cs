using Mediforward.Common.Helper;
using NUnit.Framework;

namespace Mediforward.Common.Test
{
    public class Tests
    {
        [SetUp]
        public void Setup()
        {
            ConfigurationManager.AppSetting = new AppSetting();
            ConfigurationManager.AppSetting.RazorPaySetting = new RazorPaySettings();
            ConfigurationManager.AppSetting.RazorPaySetting.appSecret = "Yg3wrN6ZE66xxqCnbewdDVsD";
            ConfigurationManager.AppSetting.RazorPaySetting.apiKey = "rzp_test_C1X4D57fghLeJk";
        }

        [Test]
        public void VerificationSuccess()
        {
            Assert.IsTrue(new PaymentService().VerifyOrderStatus("order_GKlDHfY4dN2CWg", "pay_GKlDSWIsR4UaWS", "502978572b35da7aedde8e4c2e0e7822acfae046c33bf6a476d1d8d9520f587e"));
        }


        [Test]
        public void VerificationFailure()
        {
            Assert.IsFalse(new PaymentService().VerifyOrderStatus("order_GKlDHfY4dN2CWg", "pay_GKlDSWIsR4UaWS1", "502978572b35da7aedde8e4c2e0e7822acfae046c33bf6a476d1d8d9520f587e"));
        }
    }
}