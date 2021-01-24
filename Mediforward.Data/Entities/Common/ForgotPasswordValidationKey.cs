using System;
using System.Collections.Generic;
using System.Text;

namespace Mediforward.Data.Entities
{
   public class ForgotPasswordValidationKey: BaseColumns<int>
    {
        public string ValidationKey { get; set; }
        public string  UserId { get; set; }
    }
}
