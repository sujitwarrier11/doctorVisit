using Mediforward.Common.Contracts;
using Mediforward.Common.Helper;
using Mediforward.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace Mediforward.Common
{
   public class UploadToFileSystem : IFileUpload
    {
        private IWebHostEnvironment _env;

       public UploadToFileSystem(IWebHostEnvironment env)
        {
            _env = env;
        }
        public async Task<string> UploadFile(FileModel objFile)
        {
            string NewFileName = $"{Guid.NewGuid().ToString()}.{objFile.Extension}";
            string path = Path.Combine(_env.ContentRootPath, "static", NewFileName);
            string RelativePath = $"/static/${NewFileName}";
            if (objFile.FormFile != null)
            {
                using (var stream = System.IO.File.Create(path))
                {
                    await objFile.FormFile.CopyToAsync(stream);
                }
            } else if(objFile.Content != null)
            {
                byte[] imageBytes = Convert.FromBase64String(objFile.Content.Replace("data:text/plain;base64,",""));
                File.WriteAllBytes(path, imageBytes);
            }
            return RelativePath;
        }

        public async Task<string> UploadOnlyFile(IFormFile file)
        {
            string NewFileName = $"{Guid.NewGuid().ToString()}.{file.FileName.Split('.')[1]}";
            string path = Path.Combine(_env.ContentRootPath, "static/download", NewFileName);
            string RelativePath = $"{ConfigurationManager.AppSetting.ServiceEndpoint}/static/download/{NewFileName}";
            if (file != null)
            {
                using (var stream = System.IO.File.Create(path))
                {
                    await file.CopyToAsync(stream);
                }
            }
            return RelativePath;
        }
    }
}
