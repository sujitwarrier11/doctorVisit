using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Text;

namespace Mediforward.Models
{
   public class AppThemeModel : BaseModel
    {
        public string HostName { get; set; }
        public List<ThemeElementModel> Elements { get; set; } = new List<ThemeElementModel>();
    }
}
