﻿using System;
using System.Collections.Generic;
using System.Text;

namespace Mediforward.Models
{
    public class PatientModel : BaseModel
    {
        public int PatientId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Token { get; set; }
        public string UserId { get; set; }
        public string Username { get; set; }
    }
}
