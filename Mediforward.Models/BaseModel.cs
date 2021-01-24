using System;
using System.Collections.Generic;
using System.Text;

namespace Mediforward.Models
{
    public abstract class BaseModel
    {
        public string error { get; set; }
        public string message { get; set; }
        public string stackTrace { get; set; }
    }
}
