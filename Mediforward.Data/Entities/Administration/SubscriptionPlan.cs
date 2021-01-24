using System;
using System.Collections.Generic;
using System.Text;

namespace Mediforward.Data.Entities
{
    public class SubscriptionPlan : BaseColumns<int>
    {
        public string SubscriptionPlanName { get; set; }
        public int SubscriptionDuration { get; set; }

    }
}
