using System;
using System.Collections.Generic;
using System.Text;

namespace Mediforward.Models
{
    public class InstituteRegirstrationModel: UserModel
    {
        public string Hostname { get; set; }
        public string InstituteName { get; set; }
        public string IdType { get; set; }
        public string IdNumber { get; set; }
        public AddressModel BillingAddress { get; set; }
        public AddressModel MailingAddress { get; set; }
        public int InstitutionType { get; set; } = 2;
    }
}
