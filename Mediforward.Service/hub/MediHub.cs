using Mediforward.Common.Contracts;
using Mediforward.Common.Helper;
using Mediforward.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json.Linq;
using OpenTokSDK;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Text.Json;
using Microsoft.AspNetCore.Identity;
using Mediforward.Common.Identity;

namespace Mediforward.Service
{
    public class MediHub : Hub
    {
        private readonly IProviderManager _providerManager;
        private readonly ISuperAdminManager _superAdminManager;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IPatientManager _patientIManager;
        private readonly ICommonManager _commonManager;
        private readonly UserManager<User> _userManager;
        private readonly IEmailService _emailService;
        private readonly ISMSService _sMSService;

        public MediHub(IProviderManager providerManager, ISuperAdminManager superAdminManager, IHttpContextAccessor httpContextAccessor, IPatientManager patientIManager, ICommonManager commonManager, UserManager<User> userManager, IEmailService emailService, ISMSService sMSService)
        {
            _providerManager = providerManager;
            _superAdminManager = superAdminManager;
            _httpContextAccessor = httpContextAccessor;
            _patientIManager = patientIManager;
            _commonManager = commonManager;
            _userManager = userManager;
            _emailService = emailService;
            _sMSService = sMSService;
        }

        public async Task SendMessage(string user, string message)
        {
            JObject objMessage = JObject.Parse(message);

            string socketId = Context.ConnectionId;
            await Clients.Caller.SendAsync("GetSRClientId", new JObject
            {
                ["SRClientId"] = socketId
            }.ToString());

        }

        public async Task GetProviderSRClientId(string message)
        {
            try
            {
                JObject objMessage = JObject.Parse(message);
                string socketId = Context.ConnectionId;
                await _providerManager.UpdateProviderSocketId((int)objMessage["ProviderId"], socketId);
                var rooms = await _providerManager.GetAllWaitingRooms((int)objMessage["ProviderId"]);
                foreach(var room in rooms)
                {
                   
                    await Clients.Group(room.RoomName).SendAsync("DoctorOnline", objMessage.ToString());
                     await Groups.AddToGroupAsync(socketId, room.RoomName);
                }
                await Clients.Caller.SendAsync("GetProviderSRClientId", new JObject
                {
                    ["SRClientId"] = socketId
                }.ToString());
            }
            catch (Exception ex)
            {
                await Clients.Caller.SendAsync("Exception", new JObject
                {
                    ["error"] = ex.Message,
                    ["stackTrace"] = ex.StackTrace
                }.ToString());
            }

        }

        public async Task GetSRClientId(string user)
        {
            try
            {
                string socketId = Context.ConnectionId;
                await Clients.Caller.SendAsync("GetSRClientId", new JObject
                {
                    ["SRClientId"] = socketId
                }.ToString());
            }
            catch (Exception ex)
            {
                await Clients.Caller.SendAsync("Exception", new JObject
                {
                    ["error"] = ex.Message,
                    ["stackTrace"] = ex.StackTrace
                }.ToString());
            }
        }

        public async Task ParticipantJoined(string message)
        {
            try
            {
                JObject objMessage = JObject.Parse(message);
                int RoomId = (int)objMessage["RoomId"];
                int AppointmentId = (int)objMessage["AppointmentId"];
                var appointmmentDetails = await _providerManager.GetAppointmentDetailsById(AppointmentId);
                await Groups.AddToGroupAsync(Context.ConnectionId, appointmmentDetails.RoomSID);
                if ((string)objMessage["Role"] == "patient")
                {
                    var room = await _providerManager.GetRoomDetails(RoomId);
                    await Groups.AddToGroupAsync(Context.ConnectionId, room.RoomName);
                    var socketids = await _providerManager.GetProviderToken(RoomId);
                    int PatientId = (int)objMessage["ParticipantId"];
                    var patientDetails = await _patientIManager.GetPatientDetailsById(PatientId);
                    string HostName = (string)objMessage["HostName"];
                    var providers = await _providerManager.GetAllMappedProvidersForRoom(RoomId);
                    foreach(ProviderModel pm in providers)
                    {
                        if (pm.AllowEmail)
                        {
                            try
                            {
                                var body = await _providerManager.GetPatientEmailBody(new EmailModel
                                {
                                    UserId = pm.UserId,
                                    HostName = HostName,
                                    RoomId = RoomId

                                }, $"{patientDetails.FirstName} {patientDetails.LastName}");
                                await _emailService.SendEmail(pm.Email, body, "Patient Joined Waiting room.");
                            }catch(Exception ex)
                            {

                            }
                        }
                    }
                    await _commonManager.UpdatePariticpantSocketId(new CallParticipantModel
                    {
                        ParticipantId = PatientId,
                        RoomId = RoomId,
                        AppointmentId = (int)objMessage["AppointmentId"],
                        SocketId = Context.ConnectionId,
                        Role = (string)objMessage["Role"],
                        Name = $"{patientDetails.FirstName} {patientDetails.LastName}",
                    });
                    foreach (string socketid in socketids)
                    {
                        await Clients.Client(socketid).SendAsync("PatientJoined", new JObject
                        {
                            ["AppointmentId"] = objMessage["AppointmentId"],
                            ["SessionId"] = objMessage["SessionId"],
                            ["PatientId"] = PatientId,
                            ["Name"] = $"{patientDetails.FirstName} {patientDetails.LastName}",
                            ["ProfileImage"] = objMessage["ProfileImage"],
                            ["RoomId"] = RoomId

                        }.ToString());
                    }
                }
                else
                {
                    int Provider = (int)objMessage["ParticipantId"];
                    var lstParticipants = await _commonManager.GetParticipants(RoomId);
                    var providerDetails = await _providerManager.GetProviderDetailsById(Provider);
                    var participants = await _commonManager.GetParticipants(RoomId);
                    var roomDetails = await _providerManager.GetRoomDetails(RoomId);
                    await Clients.Group(roomDetails.RoomName).SendAsync("onDocStatusSchange", new JObject
                    {
                        ["status"] = "onCallOrange"
                    }.ToString());
                    foreach (CallParticipantModel mod in participants)
                    {
                        await Clients.Client(mod.SocketId).SendAsync("DoctorJoined", new JObject
                        {
                            ["Name"] = $"{providerDetails.FirstName} {providerDetails.LastName}",
                            ["ProfileImage"] = objMessage["ProfileImage"],
                            ["RoomId"] = RoomId

                        }.ToString());
                    }
                }
            }
            catch (Exception ex)
            {
                await Clients.Caller.SendAsync("Exception", new JObject
                {
                    ["error"] = ex.Message,
                    ["stackTrace"] = ex.StackTrace
                }.ToString());
            }
        }

        public async Task CallEnd(string message)
        {
            try
            {
                JObject objMessage = JObject.Parse(message);
                int RoomId = (int)objMessage["RoomId"];
                int AppointmentId = (int)objMessage["AppointmentId"];
                string Status = (string)objMessage["Status"];
                await _providerManager.UpdateAppointmentEndTime(AppointmentId);
                var roomDetails = await _providerManager.GetRoomDetails(RoomId);
                var appointmentDetails = await _providerManager.GetAppointmentDetailsById(AppointmentId);
                await Groups.RemoveFromGroupAsync(roomDetails.RoomName, Context.ConnectionId);
                await Groups.RemoveFromGroupAsync(appointmentDetails.RoomSID, Context.ConnectionId);
                if (objMessage["Role"] != null && (string)objMessage["Role"] == "patient")
                {
                    
                    int PatientId = (int)objMessage["ParticipantId"];
                    await _commonManager.UpdateParticipantStatus(new CallParticipantModel
                    {
                        AppointmentId = AppointmentId,
                        RoomId = RoomId,
                        ParticipantId = PatientId,
                        Status = Status,
                        Role = "patient"
                    });
                    var socketids = await _providerManager.GetProviderToken(RoomId);
                    foreach (string socketid in socketids)
                    {
                        await Clients.Client(socketid).SendAsync("ParticipantDisconnected", new JObject
                        {
                            ["AppointmentId"] = objMessage["AppointmentId"],
                            ["PatientId"] = PatientId,


                        }.ToString());
                    }
                }
                else
                {
                    await Clients.Group(roomDetails.RoomName).SendAsync("onDocStatusSchange", new JObject
                    {
                        ["status"] = "onlineGreen"
                    }.ToString());
                    var participants = await _commonManager.GetParticipantsByAppointmentId(AppointmentId);
                    foreach (CallParticipantModel participant in participants)
                    {
                        await Clients.Client(participant.SocketId).SendAsync("ParticipantDisconnected", new JObject
                        {
                            ["AppointmentId"] = objMessage["AppointmentId"],
                        }.ToString());
                    }
                }
            }
            catch (Exception ex)
            {
                await Clients.Caller.SendAsync("Exception", new JObject
                {
                    ["error"] = ex.Message,
                    ["stackTrace"] = ex.StackTrace
                }.ToString());
            }
        }


        public async Task JoinGroupCall(string message)
        {
            try
            {
                JObject objMessage = JObject.Parse(message);
                int RoomId = (int)objMessage["RoomId"];
                int ParticipantId = (int)objMessage["ParticipantId"];
                string Role = (string)objMessage["Role"];
                int AppointmentId = (int)objMessage["AppointmentId"];
                int CurrentAppointmentId = (int)objMessage["CurrentAppointmentId"];
                var participant = await _commonManager.GetParticipantDetailsById(new CallParticipantModel
                {
                    RoomId = RoomId,
                    ParticipantId = ParticipantId,
                    Role = Role,
                    AppointmentId = AppointmentId
                });
                var tokBoxSetting = ConfigurationManager.AppSetting.TokBoxVideoSetting;
                var OT = new OpenTok(tokBoxSetting.APIKEY, tokBoxSetting.APISecret);
                string token = OT.GenerateToken((string)objMessage["SessionId"]);
                await Clients.Client(participant.SocketId).SendAsync("JoinGroupCall", new JObject
                {
                    ["SessionId"] = objMessage["SessionId"],
                    ["AccessToken"] = token,
                    ["AppointmentId"] = CurrentAppointmentId,
                    ["ParticipantId"] = ParticipantId,
                    ["RoomId"] = RoomId

                }.ToString());
            }
            catch (Exception ex)
            {
                await Clients.Caller.SendAsync("Exception", new JObject
                {
                    ["error"] = ex.Message,
                    ["stackTrace"] = ex.StackTrace
                }.ToString());
            }
        }


        public async Task FileUploaded(string message)
        {
            try
            {
                JArray arrMessage = JArray.Parse(message);
                JArray arrFiles = new JArray();
                int RoomId = (int)arrMessage[0]["RoomId"];
                int AppointmentId = (int)arrMessage[0]["AppointmentId"];
                string Role = (string)arrMessage[0]["Role"];
                int ParticipantId = Role == "patient" ? (int)arrMessage[0]["ParticipantId"] : (int)arrMessage[0]["ProviderId"];
                foreach (JObject objMessage in arrMessage)
                {

                    arrFiles.Add(new JObject
                    {
                        ["Path"] = objMessage["Path"],
                        ["FileName"] = objMessage["FileName"],
                        ["Size"] = objMessage["Size"]
                    });
                    await _commonManager.SaveFileDetails(new FileTransferModel
                    {
                        RoomId = RoomId,
                        AppointmentId = AppointmentId,
                        ParticipantId = ParticipantId,
                        Role = Role,
                        Path = (string)objMessage["Path"],
                        FileName = (string)objMessage["FileName"],
                    });
                }

                if (Role == "doctor" || Role == "admin")
                {
                    var participant = await _commonManager.GetParticipantDetailsById(new CallParticipantModel
                    {
                        RoomId = RoomId,
                        AppointmentId = AppointmentId,
                        ParticipantId = (int)arrMessage[0]["ParticipantId"],
                        Role = "patient"
                    });
                    await Clients.Client(participant.SocketId).SendAsync("FileUploaded", arrFiles.ToString());
                }
                else if (Role == "patient")
                {
                    var socketids = await _providerManager.GetProviderToken(RoomId);
                    var user = Context.User.Identity.Name;
                    var patientDetails = await _patientIManager.GetPatientDetails(user);
                    string HostName = (string)arrMessage[0]["HostName"];
                    foreach (string socketid in socketids)
                    {
                        await Clients.Client(socketid).SendAsync("FileUploadedByPatient", arrFiles.ToString());
                    }
                    foreach (JObject file in arrFiles)
                    {
                        var provider = await _providerManager.GetProviderDetailsById(ParticipantId);
                        string body = await _providerManager.GetPatientFileUploadedEmailBody(new EmailModel
                        {
                            UserId = provider.UserId,
                            HostName = HostName,
                            RoomId = RoomId
                        }
                        , $"{patientDetails.FirstName} {patientDetails.LastName}", (string)file["Path"], (string)file["FileName"]);

                        if (provider.AllowEmail)
                        {
                           await _emailService.SendEmail(provider.Email, body, "File uploaded");
                        }                        
                    }

                }

            }
            catch (Exception ex)
            {
                await Clients.Caller.SendAsync("Exception", new JObject
                {
                    ["error"] = ex.Message,
                    ["stackTrace"] = ex.StackTrace
                }.ToString());
            }
        }

        public async Task AskPatientToUploadFile(string message)
        {
            try
            {
                JObject objMessage = JObject.Parse(message);
                int RoomId = (int)objMessage["RoomId"];
                int AppointmentId = (int)objMessage["AppointmentId"];
                int ParticipantId = (int)objMessage["ParticipantId"];
                string Role = (string)objMessage["Role"];
                var participant = await _commonManager.GetParticipantDetailsById(new CallParticipantModel
                {
                    RoomId = RoomId,
                    AppointmentId = AppointmentId,
                    ParticipantId = ParticipantId,
                    Role = "patient"
                });
                await Clients.Client(participant.SocketId).SendAsync("FileUploadRequested", "");
            }
            catch (Exception ex)
            {
                await Clients.Caller.SendAsync("Exception", new JObject
                {
                    ["error"] = ex.Message,
                    ["stackTrace"] = ex.StackTrace
                }.ToString());
            }
        }


        public async Task InformFileTransferAcceptance(string message)
        {
            try
            {
                JObject objMessage = JObject.Parse(message);
                int RoomId = (int)objMessage["RoomId"];
                int AppointmentId = (int)objMessage["AppointmentId"];
                int ParticipantId = (int)objMessage["ParticipantId"];
                string Role = (string)objMessage["Role"];
                if (Role == "patient")
                {
                    var socketids = await _providerManager.GetProviderToken(RoomId);
                    foreach (string socketid in socketids)
                    {
                        await Clients.Client(socketid).SendAsync("FileTransferAccepted", new JObject().ToString());
                    }
                }
                else if (Role == "doctor" || Role == "admin")
                {
                    var participant = await _commonManager.GetParticipantDetailsById(new CallParticipantModel
                    {
                        RoomId = RoomId,
                        AppointmentId = AppointmentId,
                        ParticipantId = ParticipantId,
                        Role = "Patient"
                    });
                    await Clients.Client(participant.SocketId).SendAsync("FileTransferAccepted", "");
                }
            }
            catch (Exception ex)
            {
                await Clients.Caller.SendAsync("Exception", new JObject
                {
                    ["error"] = ex.Message,
                    ["stackTrace"] = ex.StackTrace
                }.ToString());
            }
        }

        public async Task DoctorJoinedCall(string message)
        {
            try
            {
                JObject objMessage = JObject.Parse(message);
                int RoomId = (int)objMessage["RoomId"];
                int ParticipantId = (int)objMessage["ParticipantId"];
                string Role = (string)objMessage["Role"];
                int AppointmentId = (int)objMessage["AppointmentId"];
                await _providerManager.UpdateAppointmentStartTime(AppointmentId);
                var roomDetails = await _providerManager.GetRoomDetails(RoomId);
                var participant = await _commonManager.GetParticipantDetailsById(new CallParticipantModel
                {
                    RoomId = RoomId,
                    ParticipantId = ParticipantId,
                    Role = "patient",
                    AppointmentId = AppointmentId
                });
                await Clients.Group(roomDetails.RoomName).SendAsync("onDocStatusSchange", new JObject 
                { 
                    ["status"] = "onCallOrange"
                }.ToString());
                await Clients.Client(participant.SocketId).SendAsync("DoctorJoinedCall", new JObject
                {
                    ["Status"] = "Joined",
                    ["VoiceCall"] = objMessage["VoiceCall"]

                }.ToString());
            }
            catch (Exception ex)
            {
                await Clients.Caller.SendAsync("Exception", new JObject
                {
                    ["error"] = ex.Message,
                    ["stackTrace"] = ex.StackTrace
                }.ToString());
            }
        }

        public async Task SendChatMessage(string message)
        {
            try
            {
                JObject objMessage = JObject.Parse(message);
                int ParticipantId = (int)objMessage["ParticipantId"];
                string Role = (string)objMessage["Role"];
                int AppointmentId = (int)objMessage["AppointmentId"];
                string Message = (string)objMessage["Msg"];
                int RoomId = (int)objMessage["RoomId"];
                string name = "";
                var appointmentDetails = await _providerManager.GetAppointmentDetailsById(AppointmentId);
                if (Role != "patient")
                {
                    var participants = await _commonManager.GetParticipantsByAppointmentId(AppointmentId);
                    foreach (CallParticipantModel participant in participants)
                    {
                 
                        if (Role == "patient")
                        {
                            var patient = await _patientIManager.GetPatientDetailsById(ParticipantId);
                            name = $"{patient.FirstName} {patient.LastName}";
                        }
                        else
                        {
                            var provider = await _providerManager.GetProviderDetailsById(ParticipantId);
                            name = $"{provider.FirstName} {provider.LastName}";
                        }
                    }
                }
                await Clients.Group(appointmentDetails.RoomSID).SendAsync("ReceiveChatMessage", new JObject
                {
                    ["Msg"] = Message,
                    ["Role"] = Role,
                    ["ParticipantId"] = ParticipantId,
                    ["AppointmentId"] = AppointmentId
                }.ToString());
            }
            catch (Exception ex)
            {
                await Clients.Caller.SendAsync("Exception", new JObject
                {
                    ["error"] = ex.Message,
                    ["stackTrace"] = ex.StackTrace
                }.ToString());
            }
        }


        public async Task TakePhoto(string message)
        {
            try
            {
                JObject objMessage = JObject.Parse(message);
                int SenderId = (int)objMessage["SenderId"];
                string SenderType = (string)objMessage["SenderType"];
                int ParticipantId = (int)objMessage["ParticipantId"];
                int RoomId = (int)objMessage["RoomId"];
                int AppointmentId = (int)objMessage["AppointmentId"];
                var participant = await _commonManager.GetParticipantDetailsById(new CallParticipantModel
                {
                    RoomId = RoomId,
                    ParticipantId = ParticipantId,
                    Role = "patient",
                    AppointmentId = AppointmentId
                });
                await Clients.Client(participant.SocketId).SendAsync("TakePhoto", new JObject
                {
                    ["SenderId"] = SenderId,
                    ["SenderType"] = SenderType,

                }.ToString());
            }
            catch (Exception ex)
            {
                await Clients.Caller.SendAsync("Exception", new JObject
                {
                    ["error"] = ex.Message,
                    ["stackTrace"] = ex.StackTrace
                }.ToString());
            }
        }

        public async Task SendPhoto(string message)
        {
            try
            {
                JObject objMessage = JObject.Parse(message);
                int SenderId = (int)objMessage["SenderId"];
                string SenderType = (string)objMessage["SenderType"];
                int ParticipantId = (int)objMessage["ParticipantId"];
                int RoomId = (int)objMessage["RoomId"];
                int AppointmentId = (int)objMessage["AppointmentId"];
                string socketId = await _providerManager.GetProviderSocketId(SenderId);
                await Clients.Client(socketId).SendAsync("RecievePhoto", new JObject
                {
                    ["Picture"] = objMessage["Picture"]
                }.ToString());
            }
            catch (Exception ex)
            {
                await Clients.Caller.SendAsync("Exception", new JObject
                {
                    ["error"] = ex.Message,
                    ["stackTrace"] = ex.StackTrace
                }.ToString());
            }
        }

        public async Task AskForScreenShare(string message)
        {
            try
            {
                JObject objMessage = JObject.Parse(message);
                int ParticipantId = (int)objMessage["ParticipantId"];
                int RoomId = (int)objMessage["RoomId"];
                int AppointmentId = (int)objMessage["AppointmentId"];
                var participant = await _commonManager.GetParticipantDetailsById(new CallParticipantModel
                {
                    ParticipantId = ParticipantId,
                    RoomId = RoomId,
                    AppointmentId = AppointmentId,
                    Role = "patient"
                });
                await Clients.Client(participant.SocketId).SendAsync("AskForScreenShare", new JObject
                {
                    ["Picture"] = objMessage["Picture"]
                }.ToString());
            }
            catch (Exception ex)
            {
                await Clients.Caller.SendAsync("Exception", new JObject
                {
                    ["error"] = ex.Message,
                    ["stackTrace"] = ex.StackTrace
                }.ToString());
            }
        }


        public async Task AskforPayment(string message)
        {
            try
            {
                JObject objMessage = JObject.Parse(message);
                int ParticipantId = (int)objMessage["ParticipantId"];
                int RoomId = (int)objMessage["RoomId"];
                int AppointmentId = (int)objMessage["AppointmentId"];
                decimal Amount = (decimal)objMessage["Amount"];
                var model = await _commonManager.CreatePaymentOrder(new PaymentModel
                {
                    Amount = Amount,
                    PayeeId = ParticipantId,
                    PaymentStatus = "Initiated",
                    AppointmentId = AppointmentId,
                });
                model.ProviderId = (int)objMessage["ProviderId"];
                var participant = await _commonManager.GetParticipantDetailsById(new CallParticipantModel
                {
                    ParticipantId = ParticipantId,
                    RoomId = RoomId,
                    AppointmentId = AppointmentId,
                    Role = "patient",
                });
                await Clients.Client(participant.SocketId).SendAsync("AskforPayment", JsonSerializer.Serialize(model));
            }
            catch (Exception ex)
            {
                await Clients.Caller.SendAsync("Exception", new JObject
                {
                    ["error"] = ex.Message,
                    ["stackTrace"] = ex.StackTrace
                }.ToString());
            }
        }

        public async Task UpdatePaymentStatus(string message)
        {
            try
            {
                JObject objMessage = JObject.Parse(message);
                int RoomId = (int)objMessage["RoomId"];
                int AppointmentId = (int)objMessage["AppointmentId"];
                int OrderId = (int)objMessage["OrderId"];
                int ProviderId = (int)objMessage["ProviderId"];
                string OrderStatus = (string)objMessage["OrderStatus"];
                var Error = objMessage["Error"];
                string RazorPayPaymentId = (string)objMessage["RazorPayPaymentId"];
                string RazorPaySignature = (string)objMessage["RazorPaySignature"];
                string socket = await _providerManager.GetSocketIdForProvider(ProviderId);
                await _commonManager.UpdatePaymentStatus(new PaymentModel
                {
                    Id = OrderId,
                    AppointmentId = AppointmentId,
                    PaymentStatus = OrderStatus,
                    ErrorJson = Error != null ? Error.ToString() : null,
                    RazorPayPaymentId = RazorPayPaymentId,
                    RazorPaySignature = RazorPaySignature
                });
                await Clients.Client(socket).SendAsync("UpdatePaymentStatus", new JObject
                {
                    ["OrderId"] = OrderId,
                    ["Status"] = OrderStatus
                }.ToString());
            }
            catch (Exception ex)
            {
                await Clients.Caller.SendAsync("Exception", new JObject
                {
                    ["error"] = ex.Message,
                    ["stackTrace"] = ex.StackTrace
                }.ToString());
            }
        }

        public async Task RegisterForAppointment(string message)
        {
            JObject objMessage = JObject.Parse(message);
            int AppointmentId = (int)objMessage["AppointmentId"];
            int RoomId = (int)objMessage["RoomId"];
            var appointmentDetails = await _providerManager.GetAppointmentDetailsById(AppointmentId);
            var roomDetails = await _providerManager.GetRoomDetails(RoomId);
            await Clients.Group(roomDetails.RoomName).SendAsync("onDocStatusSchange", new JObject
            {
                ["status"] = "onlineGreen"
            }.ToString());
            await Groups.AddToGroupAsync(Context.ConnectionId, appointmentDetails.RoomSID);

        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            try
            {
                string name = Context.User.Identity.Name;
                if (name != null)
                {
                    var user = await _userManager.FindByIdAsync(name);
                    var isPatient = await _userManager.IsInRoleAsync(user, "patient");
                    if (isPatient)
                    {
                        var patient = await _patientIManager.GetPatientDetails(name);
                        var roomName = await _commonManager.GetRoomNameForParticipant(new CallParticipantModel
                        {
                            ParticipantId = patient.PatientId,
                            SocketId = Context.ConnectionId
                        });
                        await Clients.Group(roomName).SendAsync("ParticipantDisconnected", new JObject
                        {
                            ["PatientId"] = patient.PatientId,
                        }.ToString());
                    }
                    else
                    {
                        var provider = await _providerManager.GetProviderDetails(name);
                        var rooms = await _providerManager.GetAllWaitingRooms(provider.ProviderId);
                        foreach (var room in rooms)
                        {
                            await Clients.Group(room.RoomName).SendAsync("DoctorOffline", new JObject
                            {
                                ["ProviderId"] = provider.ProviderId
                            }.ToString());
                        }
                        await Groups.RemoveFromGroupAsync(Context.ConnectionId, "SignalR Users");
                        await base.OnDisconnectedAsync(exception);
                    }
                }

            }
            catch (Exception ex) 
            {
                await Clients.Caller.SendAsync("Exception", new JObject
                {
                    ["error"] = ex.Message,
                    ["stackTrace"] = ex.StackTrace
                }.ToString());
            }
        }
        
    }
}
