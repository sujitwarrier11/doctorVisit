using Mediforward.Common;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Mediforward.Data.Entities
{
   public class Address : BaseColumns<int>
    {
        [Required, MaxLength(20), Column(TypeName = "nvarchar(20)")]
        public AddressType AddressType { get; set; }
        [Required, MaxLength(120)]
        public string AddressLine1 { get; set; }
        [MaxLength(120)]
        public string AddressLine2 { get; set; }
        [Required, MaxLength(60)]
        public string City { get; set; }

        [Required, MaxLength(60)]
        public string State { get; set; }

        [Required, MaxLength(60)]
        public string Country { get; set; }

        [Required, MaxLength(12)]
        public string Pincode { get; set; }
    }
}
