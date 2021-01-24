using Mediforward.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Mediforward.Common.Contracts
{
   public interface IPatientManager
    {
        Task<PatientModel> RegisterPatient(PatientModel model);
        Task<bool> CheckIfPatientExists(PatientModel model);
        Task<PatientModel> GetPatientDetails(string userId);
        Task<AppointmentModel> CreateAppointment(AppointmentModel model);
        Task<PatientModel> GetPatientDetailsById(int PatientId);
        Task<WaitingRoomModel> GetRoomDetails(int RoomId);
    }
}
