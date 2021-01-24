using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Mediforward.Data.Entities
{
    public class EmailTemplates : BaseColumns<int>
    {
        public string TemplateType { get; set; }
        public string TemplateContent { get; set; }
    }
}
