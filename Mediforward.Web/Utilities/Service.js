import httpRequest from "@root/Utilities/httpRequest";
import Env from "@root/Env";

const objAPI = {
  login: { url: "/api/Account/login" },
  getProviderProfile: {
    url: "/api/Provider/GetUserProfile",
  },
  getTheme: {
    url: "/api/Admin/GetTheme",
  },
  getRooms: {
    url: "/api/Provider/GetRooms",
  },
  registerProvider: {
    url: "/api/Account/Provider/Register",
  },
  checkifPatientExists: {
    url: "/api/Patient/CheckIfExisitsAndLogin",
  },
  getProviderName: {
    url: "/api/Common/GetProviderName",
  },
  createAppointment: {
    url: "/api/Patient/CreateAppointment",
  },
  getToken: {
    url: "/api/Common/GetToken",
  },
  uploadFile: {
    url: "/api/Common/FileUpload",
  },
  saveElements: {
    url: "/api/Provider/SaveRoomElements",
  },
  getRoomDetails: {
    url: "/api/Patient/GetRoomDetails",
  },
  getMeetingHistory: {
    url: "/api/Provider/GetMeetingHistory",
  },
  updateProviderDetails: {
    url: "/api/Provider/UpdateProviderDetails",
  },
  updateRoomDetails: {
    url: "/api/Provider/UpdateRoomDetails",
  },
  updateEmail: {
    url: "/api/Account/UpdateEmail",
  },
  updatePassword: {
    url: "/api/Account/UpdatePassword",
  },
  addNewUser: {
    url: "/api/Admin/RegisterNewDoctor",
  },
  getAllUsers: {
    url: "/api/Provider/GetAllUsers",
  },
  deleteUser: {
    url: "/api/Account/DeleteUser",
  },
  getUserStatusForRoom: {
    url: "/api/Admin/GetUserStatusForRoom",
  },
  addRemoveUserFromRoom: {
    url: "/api/Admin/AddRemoveUserFromRoom",
  },
  getEmailBody: {
    url: "/api/Provider/GetEmailBody",
  },
  sendInivteEmail: {
    url: "/api/Provider/SendInivteEmail",
  },
  sendDoctorNotes: {
    url: "/api/Provider/SendDoctorNotes",
  },
  createSharedRoom: {
    url: "/api/Provider/CreateSharedRoom",
  },
  getAllUsersForRoom: {
    url: "/api/Provider/GetAllUsersForRoom"
  },
  getSmsBody: {
    url: "/api/Provider/GetSMSBody",
  },
  sendSMS: {
    url: "/api/Provider/SendSMS",
  },
  generateForgotPasswordEmail: {
    url: "/api/Account/GenerateForgotPasswordEmail",
  },
  resetPassword: {
    url: "/api/Account/ResetPassword",
  },
  updateNotificationSettings: {
    url: "/api/Provider/UpdateNotificationSettings",
  },
};

const callAPI = (apiName, data, headers) => {
  return httpRequest({
    method: "POST",
    url: `${Env.baseUrl}${objAPI[apiName].url}`,
    data,
    headers,
  });
};

export default callAPI;
