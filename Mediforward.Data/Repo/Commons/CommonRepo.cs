using Mediforward.Common;
using Mediforward.Common.Contracts;
using Mediforward.Common.Helper;
using Mediforward.Common.Identity;
using Mediforward.Data.Entities;
using Mediforward.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mediforward.Data.Repo
{
    public class CommonRepo : ICommonRepo
    {
        private readonly AppDBContext _dbContext;
        private readonly UserManager<User> _userManager;
        private readonly IPaymentService _paymentService;
        private readonly IEmailService _emailService;

        public CommonRepo(AppDBContext appDBContext, UserManager<User> userManager, IPaymentService paymentService, IEmailService emailService)
        {
            _dbContext = appDBContext;
            _userManager = userManager;
            _paymentService = paymentService;
            _emailService = emailService;
        }
        public async Task SetAppointmentStartTime(int AppointmentId)
        {
            var appointment = await _dbContext.DoctorAppointments.Where(item => item.Id == AppointmentId).FirstOrDefaultAsync();
            appointment.StartTime = DateTime.Now;
            await _dbContext.SaveChangesAsync();
        }

        public async Task SetAppointmentEndTime(int AppointmentId)
        {
            var appointment = await _dbContext.DoctorAppointments.Where(item => item.Id == AppointmentId).FirstOrDefaultAsync();
            appointment.EndTime = DateTime.Now;
            await _dbContext.SaveChangesAsync();
        }

        public async Task<AppointmentModel> GetAppointmentDetails(int AppointmentId)
        {
            var appointment = await _dbContext.DoctorAppointments.Where(item => item.Id == AppointmentId).FirstOrDefaultAsync();
            return appointment.MapTo<AppointmentModel>();
        }

        public async Task<ProviderModel> RoomProviderDetails(WaitingRoomModel model)
        {
            var room = await _dbContext.WaitingRooms.Where(item => item.Id == model.Id).FirstOrDefaultAsync();
            var provider = await _dbContext.Providers.Where(item => item.Id == room.ProviderId).FirstOrDefaultAsync();
            var user =await _userManager.FindByIdAsync(provider.UserId);
            List<KeyValuePair<string, string>> mappings = new List<KeyValuePair<string, string>>
                {
                    new KeyValuePair<string, string>("Id","ProviderId")
                };
            var providerModel = provider.MapTo<ProviderModel>(mappings: mappings);
            providerModel.FirstName = user.FirstName;
            providerModel.LastName = user.LastName;
            return providerModel;
        }

        public async Task UpdatePariticpantSocketId(CallParticipantModel model)
        {
            var participant = await _dbContext.CallParticipant.Where(item => item.AppointmentId == model.AppointmentId && item.Role == model.Role && item.ParticipantId == model.ParticipantId && item.RoomId == model.RoomId).FirstOrDefaultAsync();
            if(participant != null)
            {
                participant.SocketId = model.SocketId;
                participant.Status = "A";
                await _dbContext.SaveChangesAsync();
            }
            else
            {
                var objparticipant = model.MapTo<CallParticipants>();
                objparticipant.Role = model.Role;
                _dbContext.CallParticipant.Add(objparticipant);
                await _dbContext.SaveChangesAsync();
            }
        }

        public async Task<List<CallParticipantModel>> GetParticipants(int RoomId)
        {
            List<CallParticipantModel> lstParticipants = new List<CallParticipantModel>();
            var participants = await _dbContext.CallParticipant.Where(item => item.RoomId == RoomId && item.Status == "A").ToListAsync();
            foreach(CallParticipants cp in participants)
            {
                lstParticipants.Add(cp.MapTo<CallParticipantModel>());
            }
            return lstParticipants;
        }

        public async Task UpdateParticipantStatus(CallParticipantModel model)
        {
            var participant = await _dbContext.CallParticipant.Where(item => item.AppointmentId == model.AppointmentId && item.Role == model.Role && item.ParticipantId == model.ParticipantId).FirstOrDefaultAsync();
            if(participant != null)
            {
                participant.Status = model.Status;
                await _dbContext.SaveChangesAsync();
            }
            else
            {
                _dbContext.CallParticipant.Add(model.MapTo<CallParticipants>());
                await _dbContext.SaveChangesAsync();
            }
        }

        public async Task<CallParticipantModel> GetParticipantDetailsById(CallParticipantModel model)
        {
            var participant = await _dbContext.CallParticipant.Where(item => item.ParticipantId == model.ParticipantId && item.Role == model.Role && item.RoomId == model.RoomId && item.AppointmentId == model.AppointmentId).FirstOrDefaultAsync();
            if(participant != null)
            {
                model.SocketId = participant.SocketId;
            }
            return model;
        }

        public async Task SaveFileDetails(FileTransferModel model)
        {
            var file = model.MapTo<File>();
            if (model.Role == "patient")
            {
                var patient = await _dbContext.Patients.Where(item => item.Id == model.ParticipantId).FirstOrDefaultAsync();
                file.SharedBy = patient.UserId;

            } else
            {
                var provider = await _dbContext.Providers.Where(item => item.Id == model.ParticipantId).FirstOrDefaultAsync();
                file.SharedBy = provider.UserId;
            }
            _dbContext.Files.Add(file);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<List<CallParticipantModel>> GetParticipantsByAppointmentId(int AppointmentId)
        {
            List<CallParticipantModel> lstParticipants = new List<CallParticipantModel>();
            var participants = await _dbContext.CallParticipant.Where(item => item.AppointmentId == AppointmentId).ToListAsync();
            foreach(CallParticipants participant in participants)
            {
                lstParticipants.Add(participant.MapTo<CallParticipantModel>());
            }
            return lstParticipants;
        }

        public async Task<PaymentModel> CreatePaymentOrder(PaymentModel model)
        {
            var payment = model.MapTo<AppointmentOrders>();
            _dbContext.Orders.Add(payment);
            await _dbContext.SaveChangesAsync();
            model.Id = payment.Id;
            model = GenericHelper.GenerateReceiptId(model);
            model = _paymentService.CreateOrder(model);
            payment.ReceiptId = model.ReceiptId;
            payment.RazorPayOrderId = model.RazorPayOrderId;
            await _dbContext.SaveChangesAsync();
            return model;
        } 

        public async Task<PaymentModel> UpdatePaymentStatus(PaymentModel model)
        {
            var payment = await _dbContext.Orders.Where(item => item.Id == model.Id).FirstOrDefaultAsync();
            bool isValid = _paymentService.VerifyOrderStatus(payment.RazorPayOrderId, model.RazorPayPaymentId, model.RazorPaySignature);
            if (model.PaymentStatus!= "Successful" || isValid)
            {
                payment.PaymentStatus = model.PaymentStatus;
                payment.ErrorJson = model.ErrorJson;
                payment.RazorPayPaymentId = model.RazorPayPaymentId;
                payment.RazorPaySignature = model.RazorPaySignature;
            }
            else
            {
                payment.PaymentStatus = "VerificationFailed";
                payment.ErrorJson = model.ErrorJson;
                payment.RazorPayPaymentId = model.RazorPayPaymentId;
                payment.RazorPaySignature = model.RazorPaySignature;
            }
            
            await _dbContext.SaveChangesAsync();
            return model;
        }

        public async Task<string> GetRoomNameForParticipant(CallParticipantModel model)
        {
            var participant = await _dbContext.CallParticipant.Where(item => item.ParticipantId == model.ParticipantId && item.Role == "patient" && item.SocketId == model.SocketId).FirstOrDefaultAsync();
            var room = await _dbContext.WaitingRooms.Where(item => item.Id == participant.RoomId).FirstOrDefaultAsync();
            return room.RoomName;
        }

        public async Task<string> GetForgotPasswordEmailBody(ForgotPasswordRequestModel model, string ValidationKey)
        {
            var user = await _userManager.FindByIdAsync(model.UserId);
            var theme = await _dbContext.AppThemes.Where(item => item.HostName == model.HostName || item.HostName == "default").FirstOrDefaultAsync();
            var themeElements = await _dbContext.ThemeElement.Where(item => item.ThemeId == theme.Id).ToListAsync();
            var mainBg = themeElements.Where(item => item.Type == ThemeContentType.MainBackgroundColor).FirstOrDefault();
            var themeColor2 = themeElements.Where(item => item.Type == ThemeContentType.ThemeSubColor2).FirstOrDefault();
            var themeColor1 = themeElements.Where(item => item.Type == ThemeContentType.ThemeSubColor1).FirstOrDefault();
            var borderColor = "#d4d6d5";
            var logo = themeElements.Where(item => item.Type == ThemeContentType.Logo).FirstOrDefault();
            var logoPath = $"{ConfigurationManager.AppSetting.ServiceEndpoint}{logo.Content}";
            var link = $"{ConfigurationManager.AppSetting.WebEndpoint}/changepassword/{ValidationKey}";
            var template = await _dbContext.EmailTemplate.Where(item => item.TemplateType == "ForgotPassword").FirstOrDefaultAsync();
            var forgotPasswordLink = $"{ConfigurationManager.AppSetting.WebEndpoint}/forgotpassword";
            return String.Format(template.TemplateContent, mainBg.Content, themeColor2.Content, borderColor, logoPath, $"{user.FirstName} {user.LastName}", link, themeColor1.Content, forgotPasswordLink);
        }

        public async Task<string> GenerateForgotPasswordEmail(ForgotPasswordRequestModel model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if(user != null)
            {
                var hash = GenericHelper.GenerateForgotPasswordToken(user);
                _dbContext.ForgotPasswordToken.Add(new ForgotPasswordValidationKey 
                {
                    ValidationKey = hash,
                    UserId = user.Id
                });
                await _dbContext.SaveChangesAsync();
                model.UserId = user.Id;
               string body = await GetForgotPasswordEmailBody(model, hash);
                await _emailService.SendEmail(user.Email, body, "Password Reset");
                return "";
            }
            else
            {
                throw new GenericException(ErrorCodes.GetCode("UserNotFound"));
            }
        }

        public async Task<string> GetUserIdByValidationToken(string token)
        {
            var user = await _dbContext.ForgotPasswordToken.Where(item => item.ValidationKey == token).FirstOrDefaultAsync();
            if (user != null)
            {
                if(user.AddedDate.AddDays(1) > DateTime.Now)
                {
                    return user.UserId;
                }
                throw new GenericException(ErrorCodes.GetCode("LinkExpired"));
            }
            throw new GenericException(ErrorCodes.GetCode("UserNotFound"));
        }

    }
}
 