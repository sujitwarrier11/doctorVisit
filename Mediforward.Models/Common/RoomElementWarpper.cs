using System;
using System.Collections.Generic;
using System.Text;

namespace Mediforward.Models
{
   public class RoomElementWarpper : BaseModel
    {
        public List<ElementModel> Elements { get; set; }
        public List<int> DeleteElements { get; set; } = new List<int>();
    }
}
