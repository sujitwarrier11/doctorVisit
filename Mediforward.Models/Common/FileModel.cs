using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;

namespace Mediforward.Models
{
   public class FileModel : BaseModel
    {
        public string FileName { get; set; }
        public string Extension { get; set; }
        public string Path { get; set; }
        public IFormFile FormFile { get; set; }
        public string Content { get; set; }
    }
}
