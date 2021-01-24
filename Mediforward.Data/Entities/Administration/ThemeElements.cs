using Mediforward.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace Mediforward.Data.Entities
{
   public class ThemeElements: BaseColumns<int>
    {
        public int ThemeId { get; set; }
        public ThemeContentType Type { get; set; }
        public string Content { get; set; }
    }
}
