using Mediforward.Common.Contracts;
using Mediforward.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Mediforward.Business
{
    public class PatientManager: IPatientManager
    {
        public readonly IPatientRepo _repo;
        public PatientManager(IPatientRepo repo)
        {
            _repo = repo;
        }

        public async Task<bool> CheckIfPatientExists(PatientModel model)
        {
            return await _repo.CheckIfPatientExists(model);
        }

        public async Task<AppointmentModel> CreateAppointment(AppointmentModel model)
        {
            return await _repo.CreateAppointment(model);
        }

        public async Task<PatientModel> GetPatientDetails(string userId)
        {
            return await _repo.GetPatientDetails(userId);
        }

        public async Task<PatientModel> GetPatientDetailsById(int PatientId)
        {
            return await _repo.GetPatientDetailsById(PatientId);
        }

        public async Task<PatientModel> RegisterPatient(PatientModel model)
        {
            return await _repo.RegisterPatient(model);
        }

        public async Task<WaitingRoomModel> GetRoomDetails(int RoomId)
        {
            return await _repo.GetRoomDetails(RoomId);
        }
    }
}
