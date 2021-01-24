using Mediforward.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace Mediforward.Data.Entities
{
    public class WaitingRoomElements : BaseColumns<int>
    {
        public int WaitingRoomId { get; set; }
        public string ElementType { get; set; }
        public bool IsDeleted { get; set; }
        public string Content { get; set; }
        public int Position { get; set; }
    }
}
