using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Mediforward.Common;
using Mediforward.Common.Contracts;
using Mediforward.Common.Helper;
using Mediforward.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using OpenTokSDK;

namespace Mediforward.Service.Controllers.Common
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommonController : ControllerBase
    {
        private readonly ICommonManager _manager;
        private readonly IFileUpload _fileUpload;
      
        public CommonController(ICommonManager manager, IFileUpload fileUpload)
        {
            _manager = manager;
            _fileUpload = fileUpload;
        }
        [HttpPost]
        [Route("GetToken")]
        public async Task<IActionResult> GetToken([FromBody]AppointmentModel model)
        {
            var appointment = await _manager.GetAppointmentDetails(model.AppointmentId);
            var tokBoxSetting = ConfigurationManager.AppSetting.TokBoxVideoSetting;
            var OT = new OpenTok(tokBoxSetting.APIKEY, tokBoxSetting.APISecret);
            string token = OT.GenerateToken(appointment.RoomSID);
            return Ok(new JObject 
            { 
                ["SessionId"] = model.RoomSID,
                ["AccessToken"] = token
            }.ToString());
        }

        [HttpPost]
        [Route("GetProviderName")]
        public async Task<ProviderModel> GetProviderName([FromBody]WaitingRoomModel model)
        {
            return await _manager.RoomProviderDetails(model);
        } 

        [HttpPost, DisableRequestSizeLimit]
        [Route("FileUpload")]
        public async Task<IActionResult> UploadFile()
        {
            try
            {
                JArray objArray = new JArray();
                Random objRandom = new Random();
                foreach(var file in Request.Form.Files)
                {
                    JObject objResult = new JObject();
                    objResult["path"] = await _fileUpload.UploadOnlyFile(file);
                    objResult["FileName"] = file.FileName;
                    long b = file.Length;
                    long kb = b / 1024;
                    long mb = kb / 1024;
                    objResult["Size"] = mb > 1 ? $"{mb} MB" : $"{kb} KB";
                    objResult["Id"] = objRandom.Next();
                    objArray.Add(objResult);
                }
                return Ok(objArray.ToString());
            } catch(Exception ex)
            {
                return Ok(new JObject { 
                    ["error"] = ex.Message,
                    ["stackTrace"] = ex.StackTrace
                }.ToString());
            }
        }

       

    }
}
