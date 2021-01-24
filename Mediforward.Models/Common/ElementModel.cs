using System;
using System.Collections.Generic;
using System.Text;

namespace Mediforward.Models
{
   public class ElementModel : BaseModel
    {
        public int Id { get; set; }
        public int WaitingRoomId { get; set; }
        public string ElementType { get; set; }
        public string Content { get; set; }
        public int Position { get; set; }

    }
}
