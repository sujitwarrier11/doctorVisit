using Mediforward.Common.Contracts;
using Mediforward.Common.Identity;
using Mediforward.Data.Entities;
using Mediforward.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;
using System.Threading.Tasks;
using Mediforward.Common;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Mediforward.Common.Helper;

namespace Mediforward.Data.Repo
{
    public class ProviderRepo : IProviderRepo
    {
        private readonly AppDBContext _dbContext;
        private readonly UserManager<User> _userManager;
        private readonly IJwtTokenGenerator _jwtTokenGenerator;


        public ProviderRepo(AppDBContext dBContext, UserManager<User> userManager, IJwtTokenGenerator jwtTokenGenerator)
        {
            _dbContext = dBContext;
            _userManager = userManager;
            _jwtTokenGenerator = jwtTokenGenerator;
        }
        public async Task<ProviderModel> GetProviderDetails(string id)
        {
            try
            {
                var providerDetails = await _dbContext.Providers.Where(item => item.UserId == id).FirstOrDefaultAsync();
                if (providerDetails != null)
                {
                    List<KeyValuePair<string, string>> mappings = new List<KeyValuePair<string, string>>
                    {
                    new KeyValuePair<string, string>("Id","ProviderId")
                    };
                    var provider = providerDetails.MapTo<ProviderModel>(mappings: mappings);
                    var user = await _userManager.FindByIdAsync(id);
                    provider.FirstName = user.FirstName;
                    provider.LastName = user.LastName;
                    provider.Email = user.Email;
                    provider.PhoneNumber = user.PhoneNumber;
                    provider.UserId = null;
                    return provider;
                }
                return null;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<ProviderModel> GetProviderDetailsById(int ProviderId, bool hideUserId = true)
        {
            var providerDetails = await _dbContext.Providers.Where(item => item.Id == ProviderId).FirstOrDefaultAsync();
            if (providerDetails != null)
            {
                List<KeyValuePair<string, string>> mappings = new List<KeyValuePair<string, string>>
                {
                    new KeyValuePair<string, string>("Id","ProviderId")
                };
                var provider = providerDetails.MapTo<ProviderModel>(mappings: mappings);
                var user = await _userManager.FindByIdAsync(provider.UserId);
                provider.FirstName = user.FirstName;
                provider.LastName = user.LastName;
                provider.Email = user.Email;
                provider.PhoneNumber = user.PhoneNumber;
                if (hideUserId)
                {
                    provider.UserId = null;
                }
                return provider;
            }
            return null;
        }

        public async Task<ProviderModel> RegisterNewProvider(ProviderModel model, int AdminId = 0)
        {

            var emailExists = await _userManager.FindByEmailAsync(model.Email);
            if (emailExists != null && !emailExists.IsDeleted)
                throw new GenericException(ErrorCodes.GetCode("UserAlreadyExits"));
            var userDetails = new User()
            {
                UserName = model.Email,
                Email = model.Email,
                FirstName = model.FirstName,
                LastName = model.LastName,
                PhoneNumber = model.PhoneNumber,
                EmailConfirmed = true,
                IsDeleted = false,
                EmailNotification = true,
                SmsNotification = true
            };
            var result = await _userManager.CreateAsync(userDetails, model.Password);
            if (!result.Succeeded)
                throw new GenericException(ErrorCodes.GetCode("RegistrationFailed"));
            await _userManager.AddToRoleAsync(userDetails, "doctor");
            var provider = model.MapTo<Provider>();
            provider.UserId = userDetails.Id;
            provider.Language = "eng";
            if (model.InstituteId == 0)
            {
                var Institute = new Institution
                {
                    InstituteName = model.InstituteName,
                    Hostnames = "Temp",
                    Status = "Active",
                };
                _dbContext.Institutions.Add(Institute);
                await _dbContext.SaveChangesAsync();
                provider.InstituteId = Institute.Id;
            }
            provider.AllowEmail = true;
            provider.AllowSMS = true;
            _dbContext.Providers.Add(provider);
            await _dbContext.SaveChangesAsync();
            //foreach (SpecialityModel sm in model.Specialities)
            //{
            //    _dbContext.ProviderSpecialityMappings.Add(new ProviderSpecialityMapping
            //    {
            //        ProviderId = provider.Id,
            //        SpecialityId = sm.SpecialityId

            //    });
            //}
            await _dbContext.SaveChangesAsync();
            var jwt = await _jwtTokenGenerator.GenerateToken(userDetails);
            model.Token = jwt;
            var room = await CreateNewWaitingRoom(new WaitingRoomModel
            {
                RoomName = model.RoomName,
                ProviderId = provider.Id,
                Type = "Individual"
            });
            _dbContext.RoomProviderMapping.Add(new RoomProviderMapping
            {
                RoomId = room.Id,
                ProviderId = provider.Id,
                IsActive = true,
                IsPrimaryOwner = true,
            });
            if (AdminId != 0)
            {
                _dbContext.RoomProviderMapping.Add(new RoomProviderMapping
                {
                    RoomId = room.Id,
                    ProviderId = AdminId,
                    IsActive = true,
                    IsPrimaryOwner = false,
                });
            }
            await _dbContext.SaveChangesAsync();
            return model;

        }

        public async Task<ProviderModel> RegisterNewAdmin(ProviderModel model)
        {
            var username = model.Email != null ? model.Email : model.PhoneNumber;
            var emailExists = await _userManager.FindByNameAsync(username);
            if (emailExists != null)
                throw new GenericException(ErrorCodes.GetCode("UserAlreadyExits"));
            var userDetails = new User()
            {
                UserName = username,
                Email = model.Email,
                FirstName = model.FirstName,
                LastName = model.LastName,
                PhoneNumber = model.PhoneNumber,
                EmailConfirmed = true,
                IsDeleted = false,
                EmailNotification = true,
                SmsNotification = true,
            };
            var result = await _userManager.CreateAsync(userDetails, model.Password);
            if (!result.Succeeded)
                throw new GenericException(ErrorCodes.GetCode("GenericError"));
            await _userManager.AddToRoleAsync(userDetails, "admin");
            var provider = model.MapTo<Provider>();
            provider.UserId = userDetails.Id;
            if (model.InstituteId == 0)
            {
                var Institute = new Institution
                {
                    InstituteName = model.InstituteName,
                    Hostnames = "Temp",
                    Status = "Active",
                };
                _dbContext.Institutions.Add(Institute);
                await _dbContext.SaveChangesAsync();
                provider.InstituteId = Institute.Id;
            }
            provider.MedicalLicenceNumber = "";
            provider.Language = "eng";
            provider.AllowEmail = true;
            provider.AllowSMS = true;
            _dbContext.Providers.Add(provider);
            await _dbContext.SaveChangesAsync();
            //foreach (SpecialityModel sm in model.Specialities)
            //{
            //    _dbContext.ProviderSpecialityMappings.Add(new ProviderSpecialityMapping
            //    {
            //        ProviderId = provider.Id,
            //        SpecialityId = sm.SpecialityId

            //    });
            //}
            await _dbContext.SaveChangesAsync();
            var jwt = await _jwtTokenGenerator.GenerateToken(userDetails);
            model.Token = jwt;
            var room = await CreateNewWaitingRoom(new WaitingRoomModel()
            {
                RoomName = model.RoomName,
                ProviderId = provider.Id,
                Type = "Individual"
            });
            _dbContext.RoomProviderMapping.Add(new RoomProviderMapping
            {
                RoomId = room.Id,
                ProviderId = provider.Id,
                IsActive = true,
                IsPrimaryOwner = true,
            });
            await _dbContext.SaveChangesAsync();
            return model;

        }


        public async Task<WaitingRoomModel> CreateNewWaitingRoom(WaitingRoomModel model)
        {
            var waitingRoom = model.MapTo<WaitingRoom>();
            waitingRoom.IsActive = true;
            _dbContext.WaitingRooms.Add(waitingRoom);
            await _dbContext.SaveChangesAsync();
            model.Id = waitingRoom.Id;
            return model;
        }

        public async Task<List<WaitingRoomModel>> GetAllWaitingRooms(int ProviderId)
        {
            List<WaitingRoomModel> lstWaitingRooms = new List<WaitingRoomModel>();
            var RoomIds = await _dbContext.RoomProviderMapping.Where(item => item.ProviderId == ProviderId).Select(item => item.RoomId).ToListAsync();
            var waitingRooms = await _dbContext.WaitingRooms.Where(item => item.IsActive && RoomIds.Contains(item.Id)).ToListAsync();
            foreach (WaitingRoom objWaitingRoom in waitingRooms)
            {
                var waitingRoom = objWaitingRoom.MapTo<WaitingRoomModel>();
                var roomElements = await _dbContext.WaitingRoomElement.Where(item => item.WaitingRoomId == waitingRoom.Id && item.IsDeleted == false).ToListAsync();
                foreach (WaitingRoomElements em in roomElements)
                {
                    waitingRoom.Elements.Add(em.MapTo<ElementModel>());
                }
                waitingRoom.Path = $"/room/{waitingRoom.Id}/{waitingRoom.RoomName}";
                lstWaitingRooms.Add(waitingRoom);
            }
            return lstWaitingRooms.OrderBy(item => item.ProviderId != ProviderId).ToList();
        }

        public async Task<List<ElementModel>> AddRoomElements(RoomElementWarpper wrapper)
        {
            List<int> roomIds = new List<int>();
            foreach (ElementModel model in wrapper.Elements)
            {
                if (model.Id == 0)
                {
                    var element = model.MapTo<WaitingRoomElements>();
                    element.IsDeleted = false;
                    _dbContext.WaitingRoomElement.Add(element);
                    await _dbContext.SaveChangesAsync();
                    model.Id = element.Id;
                    roomIds.Add(element.Id);
                }
                else
                {
                    var element = await _dbContext.WaitingRoomElement.Where(item => item.Id == model.Id).FirstOrDefaultAsync();
                    element.Position = model.Position;
                    element.Content = model.Content;
                    element.ElementType = model.ElementType;
                    await _dbContext.SaveChangesAsync();
                    roomIds.Add(model.Id);
                }

            }
            var elements = await _dbContext.WaitingRoomElement.Where(item => wrapper.DeleteElements.Contains(item.Id)).ToListAsync();
            foreach (WaitingRoomElements em in elements)
            {
                em.IsDeleted = true;
                await _dbContext.SaveChangesAsync();
            }
            return wrapper.Elements;
        }

        public async Task<WaitingRoomModel> GetRoomDetails(int RoomId)
        {
            WaitingRoom roomDetail = await _dbContext.WaitingRooms.Where(item => item.Id == RoomId).FirstOrDefaultAsync();
            if (roomDetail != null)
            {
                var roomElements = await _dbContext.WaitingRoomElement.Where(item => item.WaitingRoomId == roomDetail.Id).ToListAsync();
                var waitingRoom = roomDetail.MapTo<WaitingRoomModel>();
                foreach (WaitingRoomElements em in roomElements)
                {
                    waitingRoom.Elements.Add(em.MapTo<ElementModel>());
                }
                waitingRoom.Path = $"/room/{waitingRoom.Id}/{waitingRoom.RoomName}";
                return waitingRoom;
            }
            return null;
        }

        public async Task UpdateProviderSocketId(int ProviderId, string socketId)
        {
            var providerDetails = await _dbContext.RoomProviderMapping.Where(item => item.ProviderId == ProviderId).ToListAsync();
            foreach (RoomProviderMapping provider in providerDetails)
            {
                provider.SocketId = socketId;
            }
            await _dbContext.SaveChangesAsync();
        }

        public async Task<List<string>> GetProviderToken(int roomId)
        {
            WaitingRoom roomDetail = await _dbContext.WaitingRooms.Where(item => item.Id == roomId).FirstOrDefaultAsync();

            if (roomDetail != null)
            {
                var sockets = await _dbContext.RoomProviderMapping.Where(item => item.RoomId == roomDetail.Id).Select(item => item.SocketId).ToListAsync();
                return sockets;
            }
            return null;
        }

        public async Task<MeetingHistoryModel> GetMeetingHistory(string userId, int PageNo = 1)
        {
            try
            {
                List<AppointmentModel> lstAppointments = new List<AppointmentModel>();
                var provider = await _dbContext.Providers.Where(item => item.UserId == userId).FirstOrDefaultAsync();
                var total = await _dbContext.DoctorAppointments.Where(item => item.ProviderId == provider.Id).CountAsync();
                var appointments = await _dbContext.DoctorAppointments.Where(item => item.ProviderId == provider.Id).OrderByDescending(item => item.AddedDate).Skip((PageNo - 1) * 10).Take(10).ToListAsync();
                List<KeyValuePair<string, string>> mappings = new List<KeyValuePair<string, string>>
                {
                    new KeyValuePair<string, string>("Id","AppointmentId")
                };
                foreach (Appointment appointment in appointments)
                {

                    var objAppointment = appointment.MapTo<AppointmentModel>(mappings: mappings);
                    var notes = await _dbContext.Notes.Where(item => item.AppointmentId == appointment.Id).ToListAsync();
                    foreach (DoctorNotes note in notes)
                    {
                        objAppointment.Notes.Add(note.MapTo<DoctorNoteModel>());
                    }
                    var payments = await _dbContext.Orders.Where(item => item.AppointmentId == appointment.Id).ToListAsync();
                    if (payments != null)
                    {
                        foreach (AppointmentOrders o in payments)
                        {
                            objAppointment.PaymentAttemptInformation.Add(o.MapTo<PaymentModel>());
                        }
                    }
                    var patient = await _dbContext.Patients.Where(item => item.Id == appointment.PatientId).FirstOrDefaultAsync();
                    objAppointment.Name = $"{patient.FirstName} {patient.LastName}";
                    var participants = await _dbContext.CallParticipant.Where(item => item.AppointmentId == objAppointment.AppointmentId).ToListAsync();
                    foreach (CallParticipants cp in participants)
                    {
                        var participant = cp.MapTo<CallParticipantModel>();
                        if (participant.Role == "patient")
                        {
                            var Patient = await _dbContext.Patients.Where(item => item.Id == participant.ParticipantId).FirstOrDefaultAsync();
                            participant.Name = $"{Patient.FirstName} {Patient.LastName}";
                        }
                        else if (participant.Role == "doctor" || participant.Role == "admin")
                        {
                            var Provider = await _dbContext.Providers.Where(item => item.Id == participant.ParticipantId).FirstOrDefaultAsync();
                            var User = await _userManager.FindByIdAsync(provider.UserId);
                            participant.Name = $"{User.FirstName} {User.LastName}";
                        }
                        objAppointment.Participants.Add(participant);
                    }
                    var files = await _dbContext.Files.Where(item => item.AppointmentId == appointment.Id).ToListAsync();
                    foreach (File file in files)
                    {
                        var objFile = file.MapTo<FileTransferModel>();
                        if (objFile.SharedBy != null)
                        {
                            var user = await _userManager.FindByIdAsync(objFile.SharedBy);
                            objFile.SharedBy = userId == objFile.SharedBy ? "you" : $"{user.FirstName} {user.LastName}";
                        }
                        objAppointment.Files.Add(objFile);
                    }
                    lstAppointments.Add(objAppointment);
                }

                return new MeetingHistoryModel { Appointments = lstAppointments, TotalPages = total / 10 + (total % 10 > 0 ? 1 : 0) };
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task UpdateAppointmentStartTime(int AppointmentId)
        {
            var appointment = await _dbContext.DoctorAppointments.Where(item => item.Id == AppointmentId).FirstOrDefaultAsync();
            appointment.StartTime = DateTime.Now;
            await _dbContext.SaveChangesAsync();

        }

        public async Task UpdateAppointmentEndTime(int AppointmentId)
        {
            var appointment = await _dbContext.DoctorAppointments.Where(item => item.Id == AppointmentId).FirstOrDefaultAsync();
            appointment.EndTime = DateTime.Now;
            await _dbContext.SaveChangesAsync();
        }

        public async Task<ProviderModel> UpdateProviderDetails(ProviderModel model)
        {
            var user = await _userManager.FindByIdAsync(model.UserId);
            user.FirstName = model.FirstName;
            user.LastName = model.LastName;
            await _userManager.UpdateAsync(user);
            var provider = await _dbContext.Providers.Where(item => item.UserId == model.UserId).FirstOrDefaultAsync();
            provider.Speciality = model.Speciality;
            provider.DisplayName = model.DisplayName;
            provider.MedicalLicenceNumber = model.MedicalLicenceNumber;
            provider.Position = model.Position;
            await _dbContext.SaveChangesAsync();
            model.UserId = null;
            return model;
        }

        public async Task<WaitingRoomModel> UpdateRoomDetails(WaitingRoomModel model)
        {
            var room = await _dbContext.WaitingRooms.Where(item => item.Id == model.Id).FirstOrDefaultAsync();
            room.RoomName = model.RoomName;
            room.UsePasscode = model.UsePasscode;
            room.RoomCode = model.RoomCode;
            await _dbContext.SaveChangesAsync();
            var provider = await _dbContext.Providers.Where(item => item.Id == room.ProviderId).FirstOrDefaultAsync();
            provider.ProfilePicture = model.ProfilePicture;
            provider.DashboardCamEnabled = model.DashboardCamEnabled;
            await _dbContext.SaveChangesAsync();
            return model;
        }

        public async Task<List<InstituteUserModel>> GetAllUsers(string userId)
        {
            List<InstituteUserModel> lstproviders = new List<InstituteUserModel>();
            var instituteId = await _dbContext.Providers.Where(item => item.UserId == userId).Select(item => item.InstituteId).FirstOrDefaultAsync();
            var providers = await _dbContext.Providers.Join(_dbContext.Users, prvdr => prvdr.UserId, usr => usr.Id, (prvdr, usr) => new { provider = prvdr, user = usr }).Where(item => item.provider.InstituteId == instituteId && item.provider.UserId != userId && !item.user.IsDeleted).ToListAsync();
            foreach (var provider in providers)
            {
                var user = await _userManager.FindByIdAsync(provider.provider.UserId);
                var roles = await _userManager.GetRolesAsync(user);
                var roomDetail = await _dbContext.RoomProviderMapping.Join(_dbContext.WaitingRooms, mapping => mapping.RoomId, room => room.Id, (mapping, room) => new { Mapping = mapping, Room = room }).Where(item => item.Mapping.ProviderId == provider.provider.Id).Select(item => item.Room.RoomName).FirstOrDefaultAsync();
                lstproviders.Add(new InstituteUserModel
                {
                    Name = $"{user.FirstName} {user.LastName}",
                    CurrentRole = roles[0],
                    Email = user.Email,
                    RoomName = roomDetail,
                    ProviderId = provider.provider.Id
                });
            }
            return lstproviders;
        }

        public async Task<string> GetProviderSocketId(int ProviderId)
        {
            var providerDetails = await _dbContext.RoomProviderMapping.Where(item => item.ProviderId == ProviderId).FirstOrDefaultAsync();
            return providerDetails.SocketId;
        }

        public async Task<List<InstituteUserModel>> GetUserStatusForRoom(WaitingRoomModel model)
        {
            var users = await _dbContext.RoomProviderMapping.Where(item => item.RoomId == model.Id && item.ProviderId != model.ProviderId).Select(item => item.ProviderId).ToListAsync();
            var currentUsers = await GetAllUsers(model.UserId);
            return currentUsers.Select(item =>
            {
                var newItem = item.MapTo<InstituteUserModel>();
                newItem.Allowed = users.Contains(item.ProviderId);
                return newItem;
            }).ToList();
        }

        public async Task AddRemoveUserFromRoom(RoomMappingModel model)
        {
            var mapping = await _dbContext.RoomProviderMapping.Where(item => item.RoomId == model.RoomId && item.ProviderId == model.ProviderId).FirstOrDefaultAsync();
            if (mapping != null)
            {
                if (!mapping.IsPrimaryOwner)
                {
                    _dbContext.RoomProviderMapping.Remove(mapping);
                    await _dbContext.SaveChangesAsync();
                }
                else
                {
                    throw new GenericException(ErrorCodes.GetCode("DeleteOwner"));
                }
            }
            else
            {
                _dbContext.RoomProviderMapping.Add(new RoomProviderMapping
                {
                    ProviderId = model.ProviderId,
                    RoomId = model.RoomId,
                    IsActive = true,
                    IsPrimaryOwner = false
                });
                await _dbContext.SaveChangesAsync();
            }
        }

        public async Task<string> GetInviteEmailBody(EmailModel model)
        {
            var user = await _userManager.FindByIdAsync(model.UserId);
            var provider = await GetProviderDetails(model.UserId);
            var theme = await _dbContext.AppThemes.Where(item => item.HostName == model.HostName).FirstOrDefaultAsync();
            if (theme == null)
                theme = _dbContext.AppThemes.Where(item => item.HostName == "default").FirstOrDefault();
            var themeElements = await _dbContext.ThemeElement.Where(item => item.ThemeId == theme.Id).ToListAsync();
            var mainBg = themeElements.Where(item => item.Type == ThemeContentType.MainBackgroundColor).FirstOrDefault();
            var themeColor2 = themeElements.Where(item => item.Type == ThemeContentType.ThemeSubColor2).FirstOrDefault();
            var borderColor = "#d4d6d5";
            var logo = themeElements.Where(item => item.Type == ThemeContentType.Logo).FirstOrDefault();
            var logoPath = $"{ConfigurationManager.AppSetting.ServiceEndpoint}{logo.Content}";
            var roomDetails = await _dbContext.WaitingRooms.Where(item => item.Id == model.RoomId).FirstOrDefaultAsync();
            var roomName = roomDetails?.RoomName;
            var doctorName = $"{user.FirstName} {user.LastName}";
            var nameWithSalutation = $"{provider.Salutation} {doctorName}";
            var roomLink = $"{ConfigurationManager.AppSetting.WebEndpoint}/room/{model.RoomId}/{roomName}";
            string templateType = roomDetails.UsePasscode ? "RoomInviteWithCode" : "RoomInvite";
            var template = await _dbContext.EmailTemplate.Where(item => item.TemplateType == templateType).FirstOrDefaultAsync();
            return String.Format(template.TemplateContent, mainBg.Content, themeColor2.Content, borderColor, logoPath, nameWithSalutation, roomLink, roomDetails.RoomCode);
        }


        public async Task<string> GetSocketIdForProvider(int ProviderId)
        {
            var provider = await _dbContext.RoomProviderMapping.Where(item => item.ProviderId == ProviderId).FirstOrDefaultAsync();
            return provider.SocketId;
        }

        public async Task<string> GetSMSBody(SmsModel model)
        {
            var user = await _userManager.FindByIdAsync(model.UserId);
            var provider = await GetProviderDetails(model.UserId);
            var roomDetails = await _dbContext.WaitingRooms.Where(item => item.Id == model.RoomId).FirstOrDefaultAsync();
            var roomName = roomDetails?.RoomName;
            var doctorName = $"{user.FirstName}";
            var nameWithSalutation = $"{provider.Salutation}{doctorName}";
            var roomLink = $"{ConfigurationManager.AppSetting.WebEndpoint}/room/{model.RoomId}/{roomName}";
            string templateType = roomDetails.UsePasscode ? "RoomInviteSMSWithCode" : "RoomInviteSMS";
            var template = await _dbContext.EmailTemplate.Where(item => item.TemplateType == templateType).FirstOrDefaultAsync();
            return String.Format(template.TemplateContent, doctorName, roomName, roomLink, roomDetails.RoomCode);
        }

        public async Task<bool> SaveDoctorNote(DoctorNoteModel model)
        {

            var note = model.MapTo<DoctorNotes>();
            _dbContext.Notes.Add(note);
            await _dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<WaitingRoomModel> CreateSharedRoom(SharedWaitingRoomModel model)
        {
            model.RoomDetails.Type = "Shared";
            var room = await CreateNewWaitingRoom(model.RoomDetails);
            foreach (int ProviderId in model.Providers)
            {
                _dbContext.RoomProviderMapping.Add(new RoomProviderMapping
                {
                    RoomId = room.Id,
                    ProviderId = ProviderId,
                    IsActive = true,
                    IsPrimaryOwner = true,
                });
            }
            model.RoomDetails.Id = room.Id;
            await _dbContext.SaveChangesAsync();
            return model.RoomDetails;
        }

        public async Task<List<WaitingRoomModel>> GetAllsharedRoom(int ProviderId)
        {
            List<WaitingRoomModel> lstWaitingRooms = new List<WaitingRoomModel>();
            var RoomIds = await _dbContext.RoomProviderMapping.Where(item => item.ProviderId == ProviderId).Select(item => item.RoomId).ToListAsync();
            var waitingRooms = await _dbContext.WaitingRooms.Where(item => item.IsActive && RoomIds.Contains(item.Id) && item.Type == "Shared").ToListAsync();
            foreach (WaitingRoom objWaitingRoom in waitingRooms)
            {
                var waitingRoom = objWaitingRoom.MapTo<WaitingRoomModel>();
                var roomElements = await _dbContext.WaitingRoomElement.Where(item => item.WaitingRoomId == waitingRoom.Id && item.IsDeleted == false).ToListAsync();
                foreach (WaitingRoomElements em in roomElements)
                {
                    waitingRoom.Elements.Add(em.MapTo<ElementModel>());
                }
                waitingRoom.Path = $"/room/{waitingRoom.Id}/{waitingRoom.RoomName}";
                lstWaitingRooms.Add(waitingRoom);
            }
            return lstWaitingRooms.OrderBy(item => item.ProviderId != ProviderId).ToList();
        }


        public async Task<List<ProviderModel>> GetAllUsersForRoom(int RoomId)
        {
            List<ProviderModel> providerModels = new List<ProviderModel>();
            var ProviderIds = await _dbContext.RoomProviderMapping.Where(item => item.RoomId == RoomId).Select(item => item.ProviderId).ToListAsync();
            var providers = await _dbContext.Providers.Where(item => ProviderIds.Contains(item.Id)).ToListAsync();
            foreach (Provider provider in providers)
            {
                providerModels.Add(provider.MapTo<ProviderModel>());
            }
            return providerModels;
        }

        public async Task<AppointmentModel> GetAppointmentDetailsById(int AppointmentId)
        {
            var appointmentDetails = await _dbContext.DoctorAppointments.Where(item => item.Id == AppointmentId).FirstOrDefaultAsync();
            List<KeyValuePair<string, string>> mappings = new List<KeyValuePair<string, string>>
             {
                 new KeyValuePair<string, string>("Id","AppointmentId")
             };
            return appointmentDetails.MapTo<AppointmentModel>(mappings: mappings);
        }

        public async Task UpdateNotificationSettings(ProviderModel model)
        {
            var provider = await _dbContext.Providers.Where(item => item.Id == model.ProviderId).FirstOrDefaultAsync();
            provider.AllowEmail = model.AllowEmail;
            provider.AllowSMS = model.AllowSMS;
            await _dbContext.SaveChangesAsync();
        }

        public async Task<List<ProviderModel>> GetAllMappedProvidersForRoom(int RoomId)
        {
            List<KeyValuePair<string, string>> mappings = new List<KeyValuePair<string, string>>
                    {
                    new KeyValuePair<string, string>("Id","ProviderId")
                    };
            List<ProviderModel> lstProviders = new List<ProviderModel>();
            var providerIds = await _dbContext.RoomProviderMapping.Where(item => item.RoomId == RoomId).Select(item => item.ProviderId).ToListAsync();
            var providers = await _dbContext.Providers.Where(item => providerIds.Contains(item.Id)).ToListAsync();
            foreach (Provider p in providers)
            {
                var provider = p.MapTo<ProviderModel>(mappings: mappings);
                var user = await _userManager.FindByIdAsync(provider.UserId);
                provider.Email = user.Email;
                provider.PhoneNumber = user.PhoneNumber;
                lstProviders.Add(provider);
            }
            return lstProviders;
        }

        public async Task<string> GetPatientEmailBody(EmailModel model, string PatientName)
        {
            var user = await _userManager.FindByIdAsync(model.UserId);
            var provider = await GetProviderDetails(model.UserId);
            var theme = await _dbContext.AppThemes.Where(item => item.HostName == model.HostName).FirstOrDefaultAsync();
            if (theme == null)
                theme = _dbContext.AppThemes.Where(item => item.HostName == "default").FirstOrDefault();
            var themeElements = await _dbContext.ThemeElement.Where(item => item.ThemeId == theme.Id).ToListAsync();
            var mainBg = themeElements.Where(item => item.Type == ThemeContentType.MainBackgroundColor).FirstOrDefault();
            var themeColor2 = themeElements.Where(item => item.Type == ThemeContentType.ThemeSubColor2).FirstOrDefault();
            var borderColor = "#d4d6d5";
            var logo = themeElements.Where(item => item.Type == ThemeContentType.Logo).FirstOrDefault();
            var logoPath = $"{ConfigurationManager.AppSetting.ServiceEndpoint}{logo.Content}";
            var roomDetails = await _dbContext.WaitingRooms.Where(item => item.Id == model.RoomId).FirstOrDefaultAsync();
            var roomName = roomDetails?.RoomName;
            var doctorName = $"{user.FirstName} {user.LastName}";
            var nameWithSalutation = $"{provider.Salutation} {doctorName}";
            var template = await _dbContext.EmailTemplate.Where(item => item.TemplateType == "Patientjoined").FirstOrDefaultAsync();
            return String.Format(template.TemplateContent, mainBg.Content, themeColor2.Content, borderColor, logoPath, nameWithSalutation, PatientName, roomDetails.RoomName);
        }

        public async Task<string> GetPatientFileUploadedEmailBody(EmailModel model, string PatientName, string path, string filename)
        {
            var user = await _userManager.FindByIdAsync(model.UserId);
            var provider = await GetProviderDetails(model.UserId);
            var theme = await _dbContext.AppThemes.Where(item => item.HostName == model.HostName).FirstOrDefaultAsync();
            if (theme == null)
                theme = _dbContext.AppThemes.Where(item => item.HostName == "default").FirstOrDefault();
            var themeElements = await _dbContext.ThemeElement.Where(item => item.ThemeId == theme.Id).ToListAsync();
            var mainBg = themeElements.Where(item => item.Type == ThemeContentType.MainBackgroundColor).FirstOrDefault();
            var themeColor1 = themeElements.Where(item => item.Type == ThemeContentType.ThemeSubColor1).FirstOrDefault();
            var themeColor2 = themeElements.Where(item => item.Type == ThemeContentType.ThemeSubColor2).FirstOrDefault();
            var borderColor = "#d4d6d5";
            var logo = themeElements.Where(item => item.Type == ThemeContentType.Logo).FirstOrDefault();
            var logoPath = $"{ConfigurationManager.AppSetting.ServiceEndpoint}{logo.Content}";
            var roomDetails = await _dbContext.WaitingRooms.Where(item => item.Id == model.RoomId).FirstOrDefaultAsync();
            var roomName = roomDetails?.RoomName;
            var doctorName = $"{user.FirstName} {user.LastName}";
            var nameWithSalutation = $"{provider.Salutation} {doctorName}";
            var template = await _dbContext.EmailTemplate.Where(item => item.TemplateType == "PatientUploadedFile").FirstOrDefaultAsync();
            return String.Format(template.TemplateContent, mainBg.Content, themeColor2.Content, borderColor, logoPath, nameWithSalutation, PatientName, path, filename, themeColor1.Content);
        }




    }
}
