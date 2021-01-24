using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Mediforward.Data.Entities
{
    public class Provider : BaseColumns<int>
    {
        public string Salutation { get; set; } = "Mr.";
        public long? PhotoId { get; set; }
        public string MedicalLicenceNumber { get; set; }
        public string? UserId { get; set; }
        public bool Active { get; set; }
        public bool Deleted { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string AddedBy { get; set; }
        public DateTime AddedDate { get; set; }
        public int InstituteId { get; set; }
        public string SocketId { get; set; }
        public string Speciality { get; set; }
        public string DisplayName { get; set; }
        public string Position { get; set; }
        public string ProfilePicture { get; set; }
        public bool DashboardCamEnabled { get; set; }
        public string FirstTimeSignInComplete { get; set; }
        public string Language { get; set; }
        public bool AllowSMS { get; set; }
        public bool AllowEmail { get; set; }
    }
}
