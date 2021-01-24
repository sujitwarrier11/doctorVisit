using System;
using System.Collections.Generic;
using System.Text;

namespace Mediforward.Models
{
    public class ProviderModel: UserModel
    {
        public string Salutation { get; set; }
        public int ProviderId { get; set; }
        public string MedicalLicenceNumber { get; set; }
        public int InstituteId { get; set; }
        public string SocketId { get; set; }
        public string InstituteName { get; set; }
        public string RoomName { get; set; }
        public string UserId { get; set; }
        public List<SpecialityModel> Specialities { get; set; } = new List<SpecialityModel>();
        public string Speciality { get; set; }
        public string DisplayName { get; set; }
        public string Position { get; set; }
        public string ProfilePicture { get; set; }
        public bool DashboardCamEnabled { get; set; }
        public string FirstTimeSignInComplete { get; set; }
        public string Language { get; set; }
        public bool AllowSMS { get; set; }
        public bool AllowEmail { get; set; }
        public string UserName { get; set; }
    }
}
