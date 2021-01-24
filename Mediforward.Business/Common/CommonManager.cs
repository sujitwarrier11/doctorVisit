using Mediforward.Common.Contracts;
using Mediforward.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Mediforward.Business
{
    public class CommonManager : ICommonManager
    {
        private readonly ICommonRepo _repo;
        public CommonManager(ICommonRepo repo)
        {
            _repo = repo;
        }

        public async Task<AppointmentModel> GetAppointmentDetails(int RoomId)
        {
            return await _repo.GetAppointmentDetails(RoomId);
        }

        public async Task<List<CallParticipantModel>> GetParticipants(int AppointmentId)
        {
            return await _repo.GetParticipants(AppointmentId);
        }

        public async Task<ProviderModel> RoomProviderDetails(WaitingRoomModel model)
        {
            return await _repo.RoomProviderDetails(model);
        }

        public async Task SetAppointmentEndTime(int AppointmentId)
        {
           await _repo.SetAppointmentEndTime(AppointmentId);
        }

        public async Task SetAppointmentStartTime(int AppointmentId)
        {
            await _repo.SetAppointmentStartTime(AppointmentId);
        }

        public async Task UpdatePariticpantSocketId(CallParticipantModel model)
        {
             await _repo.UpdatePariticpantSocketId(model);
        }

        public async Task UpdateParticipantStatus(CallParticipantModel model)
        {
            await _repo.UpdateParticipantStatus(model);
        }

        public async Task<CallParticipantModel> GetParticipantDetailsById(CallParticipantModel model)
        {
            return await _repo.GetParticipantDetailsById(model);
        }

        public async Task SaveFileDetails(FileTransferModel model)
        {
            await _repo.SaveFileDetails(model);
        }

        public async Task<List<CallParticipantModel>> GetParticipantsByAppointmentId(int AppointmentId)
        {
            return await _repo.GetParticipantsByAppointmentId(AppointmentId);
        }

        public async Task<PaymentModel> CreatePaymentOrder(PaymentModel model)
        {
            return await _repo.CreatePaymentOrder(model);
        }

        public async Task<PaymentModel> UpdatePaymentStatus(PaymentModel model)
        {
            return await _repo.UpdatePaymentStatus(model);
        }

        public async  Task<string> GetRoomNameForParticipant(CallParticipantModel model)
        {
            return await _repo.GetRoomNameForParticipant(model);
        }

        public async Task<string> GenerateForgotPasswordEmail(ForgotPasswordRequestModel model)
        {
            return await _repo.GenerateForgotPasswordEmail(model);
        }

        public async Task<string> GetUserIdByValidationToken(string token)
        {
            return await _repo.GetUserIdByValidationToken(token);
        }
    }
}
