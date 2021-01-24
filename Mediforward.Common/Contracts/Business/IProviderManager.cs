using Mediforward.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Mediforward.Common.Contracts
{
   public interface IProviderManager
    {
        Task<ProviderModel> GetProviderDetails(string id);
        Task<ProviderModel> RegisterNewProvider(ProviderModel model, int AdminId = 0);
        Task<List<WaitingRoomModel>> GetAllWaitingRooms(int ProviderId);
        Task<WaitingRoomModel> CreateNewWaitingRoom(WaitingRoomModel model);
        Task<List<ElementModel>> AddRoomElements(RoomElementWarpper wrapper);
        Task<WaitingRoomModel> GetRoomDetails(int RoomId);
        Task UpdateProviderSocketId(int ProviderId, string socketId);
        Task<List<string>> GetProviderToken(int roomId);
        Task<ProviderModel> GetProviderDetailsById(int ProviderId,bool hideUserId = true);
        Task<MeetingHistoryModel> GetMeetingHistory(string userId, int PageNo);

        Task UpdateAppointmentStartTime(int AppointmentId);
        Task UpdateAppointmentEndTime(int AppointmentId);
        Task<ProviderModel> UpdateProviderDetails(ProviderModel model);
        Task<WaitingRoomModel> UpdateRoomDetails(WaitingRoomModel model);
        Task<ProviderModel> RegisterNewAdmin(ProviderModel model);
        Task<List<InstituteUserModel>> GetAllUsers(string userId);
        Task<string> GetProviderSocketId(int ProviderId);
        Task<List<InstituteUserModel>> GetUserStatusForRoom(WaitingRoomModel model);
        Task AddRemoveUserFromRoom(RoomMappingModel model);
        Task<string> GetInviteEmailBody(EmailModel model);
        Task<string> GetSocketIdForProvider(int ProviderId);
        Task<bool> SaveDoctorNote(DoctorNoteModel model);
        Task<WaitingRoomModel> CreateSharedRoom(SharedWaitingRoomModel model);
        Task<List<ProviderModel>> GetAllUsersForRoom(int RoomId);
        Task<string> GetSMSBody(SmsModel model);
        Task<AppointmentModel> GetAppointmentDetailsById(int AppointmentId);
        Task UpdateNotificationSettings(ProviderModel model);
        Task<List<ProviderModel>> GetAllMappedProvidersForRoom(int RoomId);
        Task<string> GetPatientEmailBody(EmailModel model, string PatientName);
        Task<string> GetPatientFileUploadedEmailBody(EmailModel model, string PatientName, string path, string filename);

    }
}
