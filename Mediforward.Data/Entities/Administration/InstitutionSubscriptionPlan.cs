using System;
using System.Collections.Generic;
using System.Text;

namespace Mediforward.Data.Entities
{
    public class InstitutionSubscriptionPlan: BaseColumns<int>
    {
        public int UserId { get; set; }
        public int SubscriptionPlanId { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}
