import { takeLatest, all } from "redux-saga/effects";
import {
  LOGIN,
  GET_PROVIDER_PROFILE,
  GET_THEME,
  GET_ROOMS,
  CALL_REGISTER,
  GET_PROVIDER_NAME,
  CHECK_PATIENT_EXISTANCE,
  GET_TOKEN,
  NAVIGATE_TO_ROOM,
  UPLOAD_FILE,
  UPLOAD_IMAGE_ELEMENT,
  SAVE_ROOM_ELEMENTS,
  GET_ROOM_DETAILS,
  GET_MEETING_HISTORY,
  UPDATE_PROVIDER_DETAILS,
  UPDATE_ROOM_DETAILS,
  UPDATE_EMAIL,
  UPDATE_PASSWORD,
  ADD_NEW_USER,
  GET_ALL_USERS,
  DELETE_USER,
  GET_ROOM_USER_STATUS,
  REMOVE_USER_FROM_ROOM,
  GET_EMAIL_BODY,
  SEND_INVITE_EMAIL,
  SEND_DOCTOR_NOTE,
  ADD_SHARED_ROOM,
  GET_ALL_USERS_FOR_ROOM,
  GET_SMS_BODY,
  SEND_SMS,
  GENERATE_FORGOT_PASSWORD_EMAIL,
  RESET_USER_PASSWORD,
  UPDATE_NOTIFICATION_SETTINGS,
} from "@root/src/Redux/constants";
import {
  login,
  getTheme,
  updateEmail,
  updatePassword,
  generateForgotPasswordEmail,
  resetUserPassword,
} from "@root/src/Redux/sagas/userSaga";
import {
  getProviderProfile,
  getRooms,
  registerProvider,
  navigateToRoom,
  saveRoomElements,
  getMeetingHistory,
  updateProviderDetails,
  updateRoomDetails,
  addNewUser,
  getAllUsers,
  deleteUser,
  getRoomUserStatus,
  removeUserFromRoom,
  getEmailBody,
  sendInviteEmail,
  sendDoctorNotes,
  addNewSharedRoom,
  getSharedRoomUserStatus,
  getSmsBody,
  sendSMS,
  updateNotificationSettings,
} from "@root/src/Redux/sagas/providerSaga";
import {
  getProviderName,
  checkIfPatientExists,
  getRoomDetails,
} from "@root/src/Redux/sagas/patientSaga";
import {
  getToken,
  uploadFile,
  uploadImageElement,
} from "@root/src/Redux/sagas/commonSaga";
import "regenerator-runtime/runtime";

export default function* root() {
  yield all([
    takeLatest(LOGIN, login),
    takeLatest(GET_PROVIDER_PROFILE, getProviderProfile),
    takeLatest(GET_THEME, getTheme),
    takeLatest(GET_ROOMS, getRooms),
    takeLatest(CALL_REGISTER, registerProvider),
    takeLatest(GET_PROVIDER_NAME, getProviderName),
    takeLatest(CHECK_PATIENT_EXISTANCE, checkIfPatientExists),
    takeLatest(GET_TOKEN, getToken),
    takeLatest(NAVIGATE_TO_ROOM, navigateToRoom),
    takeLatest(UPLOAD_FILE, uploadFile),
    takeLatest(UPLOAD_IMAGE_ELEMENT, uploadImageElement),
    takeLatest(SAVE_ROOM_ELEMENTS, saveRoomElements),
    takeLatest(GET_ROOM_DETAILS, getRoomDetails),
    takeLatest(GET_MEETING_HISTORY, getMeetingHistory),
    takeLatest(UPDATE_PROVIDER_DETAILS, updateProviderDetails),
    takeLatest(UPDATE_ROOM_DETAILS, updateRoomDetails),
    takeLatest(UPDATE_PASSWORD, updatePassword),
    takeLatest(UPDATE_EMAIL, updateEmail),
    takeLatest(ADD_NEW_USER, addNewUser),
    takeLatest(GET_ALL_USERS, getAllUsers),
    takeLatest(DELETE_USER, deleteUser),
    takeLatest(GET_ROOM_USER_STATUS, getRoomUserStatus),
    takeLatest(REMOVE_USER_FROM_ROOM, removeUserFromRoom),
    takeLatest(GET_EMAIL_BODY, getEmailBody),
    takeLatest(SEND_INVITE_EMAIL, sendInviteEmail),
    takeLatest(SEND_DOCTOR_NOTE, sendDoctorNotes),
    takeLatest(ADD_SHARED_ROOM, addNewSharedRoom),
    takeLatest(GET_ALL_USERS_FOR_ROOM, getSharedRoomUserStatus),
    takeLatest(GET_SMS_BODY, getSmsBody),
    takeLatest(SEND_SMS, sendSMS),
    takeLatest(GENERATE_FORGOT_PASSWORD_EMAIL, generateForgotPasswordEmail),
    takeLatest(RESET_USER_PASSWORD, resetUserPassword),
    takeLatest(UPDATE_NOTIFICATION_SETTINGS, updateNotificationSettings)
  ]);
}