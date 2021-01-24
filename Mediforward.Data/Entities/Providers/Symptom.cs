using System;
using System.Collections.Generic;
using System.Text;

namespace Mediforward.Data.Entities
{
   public class Symptom:BaseColumns<int>
    {
        public string SymptomName { get; set; }
        public int SpecialityId { get; set; }
        public string GroupName { get; set; }
    }
}
