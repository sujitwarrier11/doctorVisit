using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Text;

namespace Mediforward.Common
{
   public static class ErrorCodes
    {
        private static JObject errorCodes = new JObject {
            ["GenericError"] = "0000",
            ["UserNotFound"] = "0001",
            ["UserNotDoctor"] = "0002",
            ["UserNotPatient"] = "0003",
            ["UserAlreadyExits"] = "0004",
            ["IncorrectRoomCode"] = "0005",
            ["Unauthorized"] = "0006",
            ["EmailSendFailure"] = "0007",
            ["RegistrationFailed"] = "0008",
            ["PasswordIncorrect"] = "0009",
            ["DeleteOwner"] = "0010",
            ["LinkExpired"] = "0011"
        };

        public static string GetCode(string key)
        {
            return (string)errorCodes[key];
        }
    }
}
