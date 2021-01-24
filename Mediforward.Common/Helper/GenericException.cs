using System;
using System.Collections.Generic;
using System.Text;

namespace Mediforward.Common
{
   public class GenericException : Exception
    {
        public string Code { get; set; }
        public GenericException(string code)
        {
            Code = code;
        }
    }
}
