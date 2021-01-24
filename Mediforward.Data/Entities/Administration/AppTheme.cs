using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Text;

namespace Mediforward.Data.Entities
{
   public class AppTheme: BaseColumns<int>
    {
        [AllowNull]
        public int InstitutionId { get; set; }
        public bool IsActive { get; set; }
        public bool IsDefault { get; set; }
        public string HostName { get; set; }
    }
}
