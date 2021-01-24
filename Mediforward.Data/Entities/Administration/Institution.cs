using Mediforward.Common;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Mediforward.Data.Entities
{
   public class Institution: BaseColumns<int>
    {
        public string InstituteName { get; set; }
        public string Status { get; set; }
        public string AdministratorId { get; set; }

        [MaxLength(2000)]
        public string Hostnames { get; set; }
        public string IdType { get; set; }
        public string IdNumber { get; set; }
        public InstitutionType Type { get; set; }
        public bool AllowEmail { get; set; }
        public bool AllowSms { get; set; }
    }
}
