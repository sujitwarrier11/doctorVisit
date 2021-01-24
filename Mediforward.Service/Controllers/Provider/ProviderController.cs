using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Mediforward.Common.Contracts;
using Mediforward.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;

namespace Mediforward.Service.Controllers.Provider
{
    [Authorize(Roles = "doctor,admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class ProviderController : ControllerBase
    {
        private readonly IProviderManager _manager;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IEmailService _emailService;
        private readonly ISMSService _smsService;
        private readonly IPatientManager _patientManager;
        public ProviderController(IProviderManager manager, IHttpContextAccessor httpContextAccessor, IEmailService emailService, ISMSService smsService, IPatientManager patientIManager)
        {
            _manager = manager;
            _httpContextAccessor = httpContextAccessor;
            _emailService = emailService;
            _smsService = smsService;
            _patientManager = patientIManager;
        }

        [HttpPost]
        [Route("CreateRoom")]
        public async Task<WaitingRoomModel> CreateNewWaitingRoom([FromBody] WaitingRoomModel model)
        {
            var user = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var providerDetails = await _manager.GetProviderDetails(user);
            model.ProviderId = providerDetails.ProviderId;
            return await _manager.CreateNewWaitingRoom(model);
        }

        [HttpPost]
        [Route("GetRooms")]
        public async Task<List<WaitingRoomModel>> GetAllWaitingRooms()
        {
            var user = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var providerDetails = await _manager.GetProviderDetails(user);
            return await _manager.GetAllWaitingRooms(providerDetails.ProviderId);
        }

        [HttpPost]
        [Route("GetUserProfile")]
        public async Task<ProviderModel> GetProviderDetails()
        {
            var user = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var providerDetails = await _manager.GetProviderDetails(user);
            return providerDetails;
        }

        [HttpPost]
        [Route("SaveRoomElements")]
        public async Task<List<ElementModel>> AddRoomElement([FromBody] RoomElementWarpper model)
        {
            return await _manager.AddRoomElements(model);
        }

        [HttpPost]
        [Route("GetRoomDetails")]
        public async Task<WaitingRoomModel> GetRoomDetails([FromBody] WaitingRoomModel model)
        {
            return await _manager.GetRoomDetails(model.Id);
        }

        [HttpPost]
        [Route("GetMeetingHistory")]
        public async Task<MeetingHistoryModel> GetMeetingHistory([FromBody] PageModel model)
        {
            string userId = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value;
            return await _manager.GetMeetingHistory(userId, model.PageNo);
        }

        [HttpPost]
        [Route("UpdateProviderDetails")]
        public async Task<ProviderModel> UpdateProviderDetails([FromBody] ProviderModel model)
        {
            string userId = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value;
            model.UserId = userId;
            return await _manager.UpdateProviderDetails(model);
        }

        [HttpPost]
        [Route("UpdateRoomDetails")]
        public async Task<WaitingRoomModel> UpdateRoomDetails(WaitingRoomModel model)
        {
            return await _manager.UpdateRoomDetails(model);
        }

        [HttpPost]
        [Route("GetAllUsers")]
        public async Task<List<InstituteUserModel>> GetAllUsers()
        {
            string userId = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value;
            return await _manager.GetAllUsers(userId);
        }

        [HttpPost]
        [Route("SendInivteEmail")]
        public async Task SendInviteEmail(EmailModel model)
        {
            try
            {
                string userId = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value;
                model.UserId = userId;
                string body = await _manager.GetInviteEmailBody(model);
                await _emailService.SendEmail(model.Email, body, "Telemedicine meeting invitation");
            }catch(Exception ex)
            {
                Console.WriteLine($"error:{ex.Message}");
            }
        }

        [HttpPost]
        [Route("GetEmailBody")]
        public async Task<IActionResult> GetEmailBody(EmailModel model)
        {
            try
            {
                string userId = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value;
                model.UserId = userId;
                string body = await _manager.GetInviteEmailBody(model);
                return Ok(new JObject { 
                    ["body"] = body
                }.ToString());
               
            }
            catch (Exception ex)
            {
                return Ok(new JObject {
                    ["error"] = ex.Message,
                    ["stackTrace"] = ex.StackTrace
                }.ToString());
            }
        }

        [HttpPost]
        [Route("SendSMS")]
        public async Task<IActionResult> SendSMS(SmsModel model)
        {
            string userId = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value;
            model.UserId = userId;
            var body = await _manager.GetSMSBody(model);
            await _smsService.SendSMS(model.Number, body);
            return Ok(new JObject {
                ["status"] = "success"
            }.ToString());
        }


        [HttpPost]
        [Route("GetSMSBody")]
        public async Task<IActionResult> GetSMSBody(SmsModel model)
        {
            string userId = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value;
            model.UserId = userId;
            return Ok(new JObject
            {
                ["body"] = await _manager.GetSMSBody(model)
            }.ToString());
        }


        [HttpPost]
        [Route("SendDoctorNotes")]
        public async Task<IActionResult> SendDoctorNotes(DoctorNoteModel model)
        {
            try
            {
                bool result = await _manager.SaveDoctorNote(model);
                var patient = await _patientManager.GetPatientDetailsById(model.PatientId);
                await _emailService.SendEmail(patient.Email, model.NoteContent, "Doctor notes");
                return Ok(new JObject 
                { 
                    ["status"] = "Success"
                }.ToString());
            }catch(Exception ex)
            {
                return Ok(new JObject
                {
                    ["error"] = ex.Message,
                    ["stackTrace"] = ex.StackTrace
                }.ToString());
            }
        }

        [HttpPost]
        [Route("CreateSharedRoom")]
        public async Task<WaitingRoomModel> CreateSharedRoom(SharedWaitingRoomModel model)
        {
            try
            {
                return await _manager.CreateSharedRoom(model);
            }
            catch(Exception ex)
            {
                return new WaitingRoomModel 
                {
                    error = ex.Message,
                    stackTrace = ex.StackTrace,
                };
            }
        }

        [HttpPost]
        [Route("GetAllUsersForRoom")]
        public async Task<List<ProviderModel>> GetAllUsersForRoom(WaitingRoomModel model)
        {
            try
            {
                return await _manager.GetAllUsersForRoom(model.Id);
            }catch(Exception ex)
            {
                return new List<ProviderModel> 
                {
                    new ProviderModel
                    {
                        error = ex.Message,
                        stackTrace = ex.StackTrace
                    }
                };
            }
        }

        [HttpPost]
        [Route("UpdateNotificationSettings")]
        public async Task<IActionResult> UpdateNotificationSettings(ProviderModel model)
        {
            try
            {
                await _manager.UpdateNotificationSettings(model);
                return Ok(new JObject
                {
                    ["status"] = "Success"
                }.ToString());
            }catch(Exception ex)
            {
                return Ok(new JObject
                {
                    ["error"] = ex.Message,
                    ["stacktrace"] = ex.StackTrace
                }.ToString());
            }
        }
    }
}
