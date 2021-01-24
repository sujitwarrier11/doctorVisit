using System;
using System.Collections.Generic;
using System.Text;

namespace Mediforward.Models
{
   public class InstitutionModel : BaseModel
    {
        public int InstitutionId { get; set; }
        public string InstitutionName { get; set; }
        public string  Status { get; set; }
        public List<ProviderModel> Providers { get; set; } = new List<ProviderModel>();
    }
}
