using Mediforward.Common;
using Mediforward.Common.Contracts;
using Mediforward.Common.Identity;
using Mediforward.Data.Entities;
using Mediforward.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mediforward.Data.Repo
{
    public class PatientRepo : IPatientRepo
    {
        private readonly AppDBContext _dbContext;
        private readonly UserManager<User> _userManager;
        private readonly IJwtTokenGenerator _jwtTokenGenerator;


        public PatientRepo(AppDBContext dBContext, UserManager<User> userManager, IJwtTokenGenerator jwtTokenGenerator)
        {
            _dbContext = dBContext;
            _userManager = userManager;
            _jwtTokenGenerator = jwtTokenGenerator;
        }

        public async Task<bool> CheckIfPatientExists(PatientModel model)
        {
            var emailExists = await _userManager.FindByEmailAsync(model.Email);
            return emailExists != null;
        }

        public async Task<PatientModel> RegisterPatient(PatientModel model)
        {
            try
            {
                var emailExists = await _userManager.FindByNameAsync(model.Username);
                if (emailExists != null)
                    throw new ValidationException("Email Already exists.");
                var userDetails = new User()
                {
                    UserName = model.Username,
                    Email = model.Email,
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    PhoneNumber = model.PhoneNumber,
                    EmailConfirmed = true,
                    IsDeleted = false,
                    EmailNotification = true,
                    SmsNotification = true
                };
                var result = await _userManager.CreateAsync(userDetails, "PatientLogin123!");
                if (!result.Succeeded)
                    throw new ValidationException("Registration failed.");
                await _userManager.AddToRoleAsync(userDetails, "patient");
                var patient = model.MapTo<Patient>();
                patient.UserId = userDetails.Id;
                _dbContext.Patients.Add(patient);
                await _dbContext.SaveChangesAsync();
                var jwt = await _jwtTokenGenerator.GenerateToken(userDetails);
                model.Token = jwt;
                return model;
            }
            catch (Exception ex)
            {
                return null;
            }

        }

        public async Task<PatientModel> GetPatientDetails(string userId)
        {
            var patient = await _dbContext.Patients.Where(item => item.UserId == userId).FirstOrDefaultAsync();
            if (patient != null)
            {
                List<KeyValuePair<string, string>> mappings = new List<KeyValuePair<string, string>>
                {
                    new KeyValuePair<string, string>("Id","PatientId")
                };
                var patientData = patient.MapTo<PatientModel>(mappings: mappings);
                return patientData;
            }
            return null;
        }

        public async Task<PatientModel> GetPatientDetailsById(int PatientId)
        {
            var patient = await _dbContext.Patients.Where(item => item.Id == PatientId).FirstOrDefaultAsync();
            if (patient != null)
            {
                List<KeyValuePair<string, string>> mappings = new List<KeyValuePair<string, string>>
                {
                    new KeyValuePair<string, string>("Id","PatientId")
                };
                var patientData = patient.MapTo<PatientModel>(mappings: mappings);
                return patientData;
            }
            return null;
        }

        public async Task<AppointmentModel> CreateAppointment(AppointmentModel model)
        {
            var room = await _dbContext.WaitingRooms.Where(item => item.Id == model.RoomId).FirstOrDefaultAsync();
            if (!room.UsePasscode || room.RoomCode == model.RoomCode)
            {
                var appointment = model.MapTo<Appointment>();
                appointment.ProviderId = room.ProviderId;
                appointment.RoomId = room.Id;
                _dbContext.DoctorAppointments.Add(appointment);
                await _dbContext.SaveChangesAsync();
                model.AppointmentId = appointment.Id;
                return model;
            }
            else
            {
                throw new GenericException(ErrorCodes.GetCode("IncorrectRoomCode"));
            }
        }

        public async Task<WaitingRoomModel> GetRoomDetails(int RoomId)
        {
            WaitingRoom roomDetail = await _dbContext.WaitingRooms.Where(item => item.Id == RoomId).FirstOrDefaultAsync();
            if (roomDetail != null)
            {
                var roomElements = await _dbContext.WaitingRoomElement.Where(item => item.WaitingRoomId == roomDetail.Id && item.IsDeleted == false).ToListAsync();
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

    }
}
