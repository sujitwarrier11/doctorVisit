using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Mediforward.Data.Entities
{
   public class File:BaseColumns<int>
    {
        

        public int? AppointmentId { get; set; }
        public int? RoomId { get; set; }

        public string FileName { get; set; }
        public string Extension { get; set; }
        public string Path { get; set; }

        public string SharedBy { get; set; }


    }
}
