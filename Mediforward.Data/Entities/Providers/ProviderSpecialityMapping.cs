using System;
using System.Collections.Generic;
using System.Text;

namespace Mediforward.Data.Entities
{
   public class ProviderSpecialityMapping: BaseColumns<int>
    {
        public int ProviderId { get; set; }
        public int SpecialityId { get; set; }
    }
}
