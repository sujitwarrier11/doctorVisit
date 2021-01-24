using Mediforward.Models;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace Mediforward.Common.Contracts
{
    public interface IFileUpload
    {
        Task<string> UploadFile(FileModel objFile);

        Task<string> UploadOnlyFile(IFormFile file);
    }
}
