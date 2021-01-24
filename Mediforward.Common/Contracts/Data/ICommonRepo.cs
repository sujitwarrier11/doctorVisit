using Mediforward.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Mediforward.Common.Contracts
{
   public interface ICommonRepo
    {
        Task SetAppointmentStartTime(int AppointmentId);
        Task SetAppointmentEndTime(int AppointmentId);
        Task<AppointmentModel> GetAppointmentDetails(int AppointmentId);
        Task<ProviderModel> RoomProviderDetails(WaitingRoomModel model);
        Task UpdatePariticpantSocketId(CallParticipantModel model);
        Task<List<CallParticipantModel>> GetParticipants(int RoomId);
        Task UpdateParticipantStatus(CallParticipantModel model);
        Task<CallParticipantModel> GetParticipantDetailsById(CallParticipantModel model);
        Task SaveFileDetails(FileTransferModel model);
        Task<List<CallParticipantModel>> GetParticipantsByAppointmentId(int AppointmentId);
        Task<PaymentModel> CreatePaymentOrder(PaymentModel model);
        Task<PaymentModel> UpdatePaymentStatus(PaymentModel model);
        Task<string> GetRoomNameForParticipant(CallParticipantModel model);
        Task<string> GenerateForgotPasswordEmail(ForgotPasswordRequestModel model);
        Task<string> GetUserIdByValidationToken(string token);
    }
}
