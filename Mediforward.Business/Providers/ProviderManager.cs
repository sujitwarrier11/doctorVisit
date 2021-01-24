using Mediforward.Common.Contracts;
using Mediforward.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Mediforward.Business
{
    public class ProviderManager : IProviderManager
    {
        private IProviderRepo _repo;
        private IFileUpload _uploader;

        public ProviderManager(IProviderRepo manager, IFileUpload uploader)
        {
            _repo = manager;
            _uploader = uploader;
        }
        public async Task<List<ElementModel>> AddRoomElements(RoomElementWarpper wrapper)
        {
            return await _repo.AddRoomElements(wrapper);
        }

        public async Task<WaitingRoomModel> CreateNewWaitingRoom(WaitingRoomModel model)
        {
            return await _repo.CreateNewWaitingRoom(model);
        }

        public async Task<List<WaitingRoomModel>> GetAllWaitingRooms(int ProviderId)
        {
            return await _repo.GetAllWaitingRooms(ProviderId);
        }

        public async Task<ProviderModel> GetProviderDetails(string id)
        {
            return await _repo.GetProviderDetails(id);
        }

        public async Task<List<string>> GetProviderToken(int roomId)
        {
            return await _repo.GetProviderToken(roomId);
        }

        public async Task<WaitingRoomModel> GetRoomDetails(int RoomId)
        {
            return await _repo.GetRoomDetails(RoomId);
        }

        public async Task<ProviderModel> RegisterNewProvider(ProviderModel model, int AdminId = 0)
        {
            return await _repo.RegisterNewProvider(model, AdminId);
        }

        public async Task UpdateProviderSocketId(int ProviderId, string socketId)
        {
            await _repo.UpdateProviderSocketId(ProviderId, socketId);
        }

        public async Task<ProviderModel> GetProviderDetailsById(int ProviderId, bool hideUserId = true)
        {
            return await _repo.GetProviderDetailsById(ProviderId, hideUserId);
        }

        public async Task<MeetingHistoryModel> GetMeetingHistory(string userId, int PageNo)
        {
            return await _repo.GetMeetingHistory(userId, PageNo);
        }

        public async Task UpdateAppointmentStartTime(int AppointmentId)
        {
            await _repo.UpdateAppointmentStartTime(AppointmentId);
        }
        public async Task UpdateAppointmentEndTime(int AppointmentId)
        {
            await _repo.UpdateAppointmentEndTime(AppointmentId);
        }

        public async Task<ProviderModel> UpdateProviderDetails(ProviderModel model)
        {
            return await _repo.UpdateProviderDetails(model);
        }

        public async Task<WaitingRoomModel> UpdateRoomDetails(WaitingRoomModel model)
        {
            return await _repo.UpdateRoomDetails(model);
        }

        public async Task<ProviderModel> RegisterNewAdmin(ProviderModel model)
        {
            return await _repo.RegisterNewAdmin(model);
        }

        public async Task<List<InstituteUserModel>> GetAllUsers(string userId)
        {
            return await _repo.GetAllUsers(userId);
        }

        public async Task<string> GetProviderSocketId(int ProviderId)
        {
            return await _repo.GetProviderSocketId(ProviderId);
        }

        public async Task<List<InstituteUserModel>> GetUserStatusForRoom(WaitingRoomModel model)
        {
            return await _repo.GetUserStatusForRoom(model);

        }

        public async Task AddRemoveUserFromRoom(RoomMappingModel model)
        {
            await _repo.AddRemoveUserFromRoom(model);
        }

        public async Task<string> GetInviteEmailBody(EmailModel model)
        {
            return await _repo.GetInviteEmailBody(model);
        }

        public async Task<string> GetSocketIdForProvider(int ProviderId)
        {
            return await _repo.GetSocketIdForProvider(ProviderId);
        }

        public async Task<bool> SaveDoctorNote(DoctorNoteModel model)
        {
            return await _repo.SaveDoctorNote(model);
        }

        public async Task<WaitingRoomModel> CreateSharedRoom(SharedWaitingRoomModel model)
        {
            return await _repo.CreateSharedRoom(model);
        }

        public async Task<List<ProviderModel>> GetAllUsersForRoom(int RoomId)
        {
            return await _repo.GetAllUsersForRoom(RoomId);
        }

        public async Task<string> GetSMSBody(SmsModel model)
        {
            return await _repo.GetSMSBody(model);
        }

        public async Task<AppointmentModel> GetAppointmentDetailsById(int AppointmentId)
        {
            return await _repo.GetAppointmentDetailsById(AppointmentId);
        }

        public async Task UpdateNotificationSettings(ProviderModel model)
        {
            await _repo.UpdateNotificationSettings(model);
        }

        public async Task<List<ProviderModel>> GetAllMappedProvidersForRoom(int RoomId)
        {
            return await _repo.GetAllMappedProvidersForRoom(RoomId);
        }

        public async Task<string> GetPatientEmailBody(EmailModel model, string PatientName)
        {
            return await _repo.GetPatientEmailBody(model, PatientName);
        }

        public async Task<string> GetPatientFileUploadedEmailBody(EmailModel model, string PatientName, string path, string filename)
        {
            return await _repo.GetPatientFileUploadedEmailBody(model, PatientName, path, filename);
        }
    }
}
