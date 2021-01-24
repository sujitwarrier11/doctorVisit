using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Mediforward.Data
{
    public abstract class BaseColumns<KeyType>
    {
        [Required, Key]
        public KeyType Id { get; set; }
        public string UpdatedBy { get; set; }
       public DateTime? UpdatedDate { get; set; }
       public string AddedBy { get; set; }
       public DateTime AddedDate { get; set; }


    }
}
