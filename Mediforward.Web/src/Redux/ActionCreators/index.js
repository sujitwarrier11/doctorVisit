import {
  LOGIN,
  LOGIN_FAILURE,
  LOGIN_SUCCESS,
  CALL_REGISTER,
  UPLOAD_FILE,
  GET_FILES,
  SET_UPLOAD_STATUS,
  SET_FILES,
  GET_PROVIDER_PROFILE,
  SET_PROVIDER_DETAILS,
  SET_THEME,
  GET_THEME,
  GET_ROOMS,
  SET_ROOMS,
  CHECK_PATIENT_EXISTANCE,
  GET_PROVIDER_NAME,
  SET_PROVIDER_NAME,
  SET_APPOINTMENT_RESPONSE,
  GET_TOKEN,
  SET_TOKEN,
  NAVIGATE_TO_ROOM,
  LOGOUT,
  SET_PATIENTS,
  REMOVE_PATIENT,
  CLEAR_FILE,
  SET_CURRENT_ROOM,
  SAVE_IMAGE_ELEMENT_DETAILS,
  UPLOAD_IMAGE_ELEMENT,
  SAVE_ROOM_ELEMENTS,
  SET_ROOM_ELEMENTS,
  GET_ROOM_DETAILS,
  SET_ROOM_DETAILS,
  GET_MEETING_HISTORY,
  SET_MEETING_HISTORY,
  CLEAR_PATIENT_DETAILS,
  SET_CONNECTION_OBJECT,
  UPDATE_PROVIDER_DETAILS,
  UPDATE_ROOM_DETAILS,
  SET_PATIENT_CONNECTION,
  SET_PROFILE_IMAGE,
  SET_CHAT_MESSAGES,
  UPDATE_EMAIL,
  UPDATE_PASSWORD,
  ADD_NEW_USER,
  SET_SNACKBAR_STATE,
  GET_ALL_USERS,
  SET_ALL_USERS,
  SET_USER,
  SET_PATIENT_PICTURE,
  CLEAR_PATIENT_PICTURE,
  ROOM_CLEAN_UP,
  SET_CURRENT_PATIENT,
  OPEN_CHAT,
  DELETE_USER,
  GET_ROOM_USER_STATUS,
  SET_ROOM_USER_STATUS,
  REMOVE_USER_FROM_ROOM,
  SEND_INVITE_EMAIL,
  GET_EMAIL_BODY,
  SET_EMAIL_BODY,
  SET_MESSAGE_READ,
  TOGGLE_LOADING,
  SEND_DOCTOR_NOTE,
  ENABLE_DISABLE_AUDIO,
  ADD_SHARED_ROOM,
  SAVE_SHARED_ROOM,
  GET_ALL_USERS_FOR_ROOM,
  SET_ALL_USERS_FOR_ROOM,
  GET_SMS_BODY,
  SAVE_SMS_BODY,
  SEND_SMS,
  SET_SECONDARY_PATIENT,
  OPEN_PATIENT_CHAT,
  GENERATE_FORGOT_PASSWORD_EMAIL,
  RESET_USER_PASSWORD,
  UPDATE_NOTIFICATION_SETTINGS,
} from "@root/src/Redux/constants";

export const login = (payload) => ({
  type: LOGIN,
  payload,
});

export const setLoginData = (payload) => ({
  type: LOGIN_SUCCESS,
  payload,
});

export const setLoginError = (payload) => ({
  type: LOGIN_FAILURE,
  payload,
});

export const callRegister = (payload) => ({
  type: CALL_REGISTER,
  payload,
});

export const uploadFile = (payload) => ({
  type: UPLOAD_FILE,
  payload,
});

export const getFiles = () => ({
  type: GET_FILES,
});

export const setUploadStatus = (payload) => ({
  type: SET_UPLOAD_STATUS,
  payload,
});

export const setFiles = (payload) => ({
  type: SET_FILES,
  payload,
});

export const getProviderProfile = () => ({
  type: GET_PROVIDER_PROFILE,
});

export const setProviderDetails = (payload) => ({
  type: SET_PROVIDER_DETAILS,
  payload,
});

export const setThemeData = (payload) => ({
  type: SET_THEME,
  payload,
});

export const getTheme = (payload) => ({
  type: GET_THEME,
  payload,
});

export const getRooms = () => ({
  type: GET_ROOMS,
});

export const setRooms = (payload) => ({
  type: SET_ROOMS,
  payload,
});

export const checkIfPatientExists = (payload) => ({
  type: CHECK_PATIENT_EXISTANCE,
  payload,
});

export const getProviderName = (payload) => ({
  type: GET_PROVIDER_NAME,
  payload,
});

export const logout = () => ({
  type: LOGOUT,
});

export const setProviderName = (payload) => ({
  type: SET_PROVIDER_NAME,
  payload,
});

export const setAppointmentResponse = (payload) => ({
  type: SET_APPOINTMENT_RESPONSE,
  payload,
});

export const getToken = (payload) => ({
  type: GET_TOKEN,
  payload,
});

export const setToken = (payload) => {
  return {
    type: SET_TOKEN,
    payload,
  };
};

export const navigateToRoom = (payload) => ({
  type: NAVIGATE_TO_ROOM,
  payload,
});

export const setPatients = (payload) => ({
  type: SET_PATIENTS,
  payload,
});

export const removePatient = (payload) => ({
  type: REMOVE_PATIENT,
  payload,
});

export const clearFile = () => ({
  type: CLEAR_FILE,
});

export const setCurrentRoom = (payload) => ({
  type: SET_CURRENT_ROOM,
  payload,
});

export const uploadImageElement = (payload) => ({
  type: UPLOAD_IMAGE_ELEMENT,
  payload,
});

export const saveImageElementDetails = (payload) => ({
  type: SAVE_IMAGE_ELEMENT_DETAILS,
  payload,
});

export const saveRoomElements = (payload) => ({
  type: SAVE_ROOM_ELEMENTS,
  payload: {
    ...payload,
    Elements: payload.Elements.map((item) => {
      if (!Number.isInteger(item.Id)) return { ...item, Id: 0 };
      return item;
    }),
  },
});

export const setRoomElements = (payload) => ({
  type: SET_ROOM_ELEMENTS,
  payload,
});

export const getRoomDetails = (payload) => ({
  type: GET_ROOM_DETAILS,
  payload,
});

export const setRoomDetails = (payload) => ({
  type: SET_ROOM_DETAILS,
  payload,
});

export const getMeetingHistory = (payload) => ({
  type: GET_MEETING_HISTORY,
  payload,
});

export const setMeetingHistory = (payload) => ({
  type: SET_MEETING_HISTORY,
  payload,
});

export const clearPatientDetails = () => ({
  type: CLEAR_PATIENT_DETAILS,
});

export const setConnectionObject = (payload) => ({
  type: SET_CONNECTION_OBJECT,
  payload,
});

export const updateProviderDetails = (payload) => ({
  type: UPDATE_PROVIDER_DETAILS,
  payload,
});

export const updateRoomDetails = (payload) => ({
  type: UPDATE_ROOM_DETAILS,
  payload,
});

export const setPatientConnection = (payload) => ({
  type: SET_PATIENT_CONNECTION,
  payload,
});

export const setProfileImage = (payload) => ({
  type: SET_PROFILE_IMAGE,
  payload,
});

export const setChatMessage = (payload) => ({
  type: SET_CHAT_MESSAGES,
  payload,
});

export const updateEmail = (payload) => ({
  type: UPDATE_EMAIL,
  payload,
});

export const updatePassword = (payload) => ({
  type: UPDATE_PASSWORD,
  payload,
});

export const addNewUser = (payload) => ({
  type: ADD_NEW_USER,
  payload,
});

export const snackBarConfig = (payload) => ({
  type: SET_SNACKBAR_STATE,
  payload,
});

export const getAllUsers = () => ({
  type: GET_ALL_USERS,
});

export const setAllUsers = (payload) => ({
  type: SET_ALL_USERS,
  payload,
});

export const setUser = (payload) => ({
  type: SET_USER,
  payload,
});

export const setPatientPicture = (payload) => ({
  type: SET_PATIENT_PICTURE,
  payload,
});

export const clearPatientPicture = () => ({
  type: CLEAR_PATIENT_PICTURE,
});

export const roomCleanUp = () => ({
  type: ROOM_CLEAN_UP,
});

export const setCurrentPatient = (payload) => ({
  type: SET_CURRENT_PATIENT,
  payload,
});

export const openChat = (payload) => ({
  type: OPEN_CHAT,
  payload,
});

export const deleteUser = (payload) => ({
  type: DELETE_USER,
  payload,
});

export const getRoomUserStatus = (payload) => ({
  type: GET_ROOM_USER_STATUS,
  payload,
});

export const setRoomUserStatus = (payload) => ({
  type: SET_ROOM_USER_STATUS,
  payload,
});

export const removeUserFromRoom = (payload) => ({
  type: REMOVE_USER_FROM_ROOM,
  payload,
});

export const getEmailBody = (payload) => ({
  type: GET_EMAIL_BODY,
  payload,
});

export const setEmailBody = (payload) => ({
  type: SET_EMAIL_BODY,
  payload,
});

export const sendInviteEmail = (payload) => ({
  type: SEND_INVITE_EMAIL,
  payload,
});

export const setMessageRead = (payload) => ({
  type: SET_MESSAGE_READ,
  payload,
});

export const toggleLoading = (payload) => ({
  type: TOGGLE_LOADING,
  payload,
});

export const sendDoctorNotes = (payload) => ({
  type: SEND_DOCTOR_NOTE,
  payload,
});

export const enableDisableAudio = (payload) => ({
  type: ENABLE_DISABLE_AUDIO,
  payload,
});

export const addSharedRoom = (payload) => ({
  type: ADD_SHARED_ROOM,
  payload,
});

export const saveSharedRoom = (payload) => ({
  type: SAVE_SHARED_ROOM,
  payload,
});

export const getAllUsersForRoom = (payload) => ({
  type: GET_ALL_USERS_FOR_ROOM,
  payload,
});

export const setAllUsersForRoom = (payload) => ({
  type: SET_ALL_USERS_FOR_ROOM,
  payload,
});

export const getSmsBody = (payload) => ({
  type: GET_SMS_BODY,
  payload,
});

export const saveSmsBody = (payload) => ({
  type: SAVE_SMS_BODY,
  payload,
});

export const sendSMS = (payload) => ({
  type: SEND_SMS,
  payload,
});

export const setSecondaryPatient = (payload) => ({
  type: SET_SECONDARY_PATIENT,
  payload,
});

export const openPatientChat = (payload) => ({
  type: OPEN_PATIENT_CHAT,
  payload,
});

export const generateForgotPasswordEmail = (payload) => ({
  type: GENERATE_FORGOT_PASSWORD_EMAIL,
  payload,
});

export const resetUserPassword = (payload) => ({
  type: RESET_USER_PASSWORD,
  payload,
});

export const updateNotificationSettings = (payload) => ({
  type: UPDATE_NOTIFICATION_SETTINGS,
  payload,
});
