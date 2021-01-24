using System;
using System.Collections.Generic;
using System.Text;

namespace Mediforward.Data.Entities
{
  public class ProviderAvailability: BaseColumns<int>
    {
        public int ProviderId { get; set; }
        public DateTime? AvailableFromDate { get; set; }
        public DateTime? AvailableToDate { get; set; }
        public string CronExpression { get; set; }
        public string Type { get; set; }
        public bool IsDeleted { get; set; }
    }
}
