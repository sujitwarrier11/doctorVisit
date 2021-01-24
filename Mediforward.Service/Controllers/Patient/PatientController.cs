using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Mediforward.Common;
using Mediforward.Common.Contracts;
using Mediforward.Common.Helper;
using Mediforward.Common.Identity;
using Mediforward.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using OpenTokSDK;

namespace Mediforward.Service.Controllers.Patient
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientController : ControllerBase
    {
        private readonly IPatientManager _manager;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly UserManager<User> _userManager;
        private readonly IJwtTokenGenerator _jwtTokenGenerator;
        public PatientController(IPatientManager manager, IHttpContextAccessor httpContextAccessor, UserManager<User> userManager, IJwtTokenGenerator jwtTokenGenerator)
        {
            _manager = manager;
            _httpContextAccessor = httpContextAccessor;
            _userManager = userManager;
            _jwtTokenGenerator = jwtTokenGenerator;
        }

        [HttpPost]
        [Route("CheckIfExisitsAndLogin")]
        public async Task<IActionResult> CheckIfExisitsAndLogin([FromBody] PatientModel model)
        {
            try
            {
                string username = model.Email != null ? model.Email : model.PhoneNumber;
                var userDetails = await _userManager.FindByNameAsync(username);
                if (userDetails != null)
                {
                    var isPatient = await _userManager.IsInRoleAsync(userDetails, "patient");
                    if (isPatient)
                    {
                        var result = await _userManager.CheckPasswordAsync(userDetails, "PatientLogin123!");
                        if (result)
                        {
                            var jwt = await _jwtTokenGenerator.GenerateToken(userDetails);
                            JObject returnData = new JObject();
                            returnData["token"] = jwt;
                            returnData["role"] = "patient";
                            returnData["Email"] = model.Email;
                            return Ok(returnData.ToString());
                        }
                    }
                    else
                    {
                        throw new GenericException(ErrorCodes.GetCode("UserNotPatient"));
                    }

                }
                else
                {
                    var provider = await _manager.RegisterPatient(new PatientModel
                    {
                        Email = model.Email,
                        FirstName = model.FirstName,
                        LastName = model.LastName,
                        PhoneNumber = model.PhoneNumber,
                        Username = username
                    });
                    if (provider != null)
                    {
                        JObject returnData = new JObject();
                        returnData["token"] = provider.Token;
                        returnData["role"] = "patient";
                        returnData["Email"] = model.Email;
                        return Ok(returnData.ToString());
                    }
                }
                throw new GenericException(ErrorCodes.GetCode("UserNotFound"));
            }
            catch(GenericException ex)
            {
                return Ok(new JObject
                {
                    ["error"] = ex.Code
                }.ToString());
            }
            catch(Exception ex)
            {
                return Ok(new JObject
                {
                    ["error"] = ex.Message
                }.ToString());
            }
        }


        [HttpPost]
        [Authorize(Roles = "patient")]
        [Route("CreateAppointment")]
        public async Task<AppointmentModel> CreateAppointment([FromBody] AppointmentModel model)
        {
            try
            {
                var tokBoxSetting = ConfigurationManager.AppSetting.TokBoxVideoSetting;
                var OT = new OpenTok(tokBoxSetting.APIKEY, tokBoxSetting.APISecret);
                var Session = OT.CreateSession("", MediaMode.RELAYED, ArchiveMode.MANUAL);
                model.RoomSID = Session.Id;
                var user = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value;
                var patient = await _manager.GetPatientDetails(user);
                model.PatientId = patient.PatientId;
                var appointment = await _manager.CreateAppointment(model);
                return appointment;
            }
            catch(GenericException ex)
            {
                return new AppointmentModel { error = ex.Code };
            }
            catch (Exception ex)
            {
                return new AppointmentModel { error = ex.Message };
            }
        }


        [HttpPost]
        [Route("GetRoomDetails")]
        public async Task<WaitingRoomModel> GetRoomDetails([FromBody] WaitingRoomModel model)
        {
            return await _manager.GetRoomDetails(model.Id);
        }


    }
}
