import {
  SET_PROVIDER_DETAILS,
  SET_ROOMS,
  NAVIGATE_TO_ROOM,
  LOGOUT,
  SET_PATIENTS,
  REMOVE_PATIENT,
  SET_CURRENT_ROOM,
  SET_ROOM_ELEMENTS,
  SET_MEETING_HISTORY,
  SET_CONNECTION_OBJECT,
  UPDATE_PROVIDER_DETAILS,
  UPDATE_ROOM_DETAILS,
  SET_ALL_USERS,
  SET_USER,
  SET_PATIENT_PICTURE,
  CLEAR_PATIENT_PICTURE,
  ROOM_CLEAN_UP,
  SET_CURRENT_PATIENT,
  OPEN_CHAT,
  DELETE_USER,
  SET_ROOM_USER_STATUS,
  REMOVE_USER_FROM_ROOM,
  SET_EMAIL_BODY,
  SEND_DOCTOR_NOTE,
  SAVE_SHARED_ROOM,
  SET_ALL_USERS_FOR_ROOM,
  SAVE_SMS_BODY,
  UPDATE_NOTIFICATION_SETTINGS,
} from "@root/src/Redux/constants";

const setPatient = (patients = [], payload) => {
  if (patients.find((item) => item.PatientId === payload.PatientId))
    return patients.map((item) =>
      item.PatientId === payload.PatientId ? payload : item
    );
  return [...patients, payload];
};

const reducer = (state = {}, action) => {
  switch (action.type) {
    case NAVIGATE_TO_ROOM:
      return {
        ...state,
        CurrentAppointment: action.payload,
        CurrentPatientId: action.payload.PatientId,
      };
    case SET_PROVIDER_DETAILS:
      return {
        ...state,
        ProviderProfile: action.payload,
      };
    case LOGOUT:
      return {};
    case SET_ROOMS:
      return {
        ...state,
        Rooms: action.payload,
        CurrentRoomId:
          action.payload && action.payload.length > 0 && action.payload[0].Id,
      };
    case SET_PATIENTS: {
      const patients = setPatient(state.patients, action.payload);
      return {
        ...state,
        patients,
        CurrentPatientId: patients[0].PatientId,
      };
    }
    case REMOVE_PATIENT: {
      const patients = state.patients
        ? state.patients.filter(
            (item) => item.PatientId !== action.payload.PatientId
          )
        : [];
      return {
        ...state,
        patients,
        CurrentPatientId:
          state.CurrentPatientId === action.payload.PatientId
            ? patients[0]?.PatientId
            : state.CurrentPatientId,
      };
    }
    case SET_CURRENT_ROOM:
      return {
        ...state,
        CurrentRoomId: action.payload.Id,
      };
    case SET_ROOM_ELEMENTS:
      return {
        ...state,
        Rooms: state.Rooms.map((item) =>
          item.Id === state.CurrentRoomId
            ? { ...item, Elements: action.payload }
            : item
        ),
      };
    case SET_MEETING_HISTORY:
      return {
        ...state,
        MeetingData: action.payload,
      };
    case SET_CONNECTION_OBJECT:
      return {
        ...state,
        objConnection: action.payload,
      };
    case UPDATE_PROVIDER_DETAILS:
      return {
        ...state,
        ProviderProfile: {
          ...state.ProviderProfile,
          ...action.payload,
        },
      };
    case UPDATE_ROOM_DETAILS:
      return {
        ...state,
        Rooms:
          state.Rooms?.map((item) => {
            if (item.Id === action.payload.Id) {
              return {
                ...item,
                UsePasscode: action.payload.UsePasscode,
                RoomCode: action.payload.RoomCode,
                RoomName: action.payload.RoomName,
                Path: action.payload.Path,
              };
            }
            return item;
          }) || [],
        ProviderProfile: {
          ...state.ProviderProfile,
          DashboardCamEnabled: action.payload.DashboardCamEnabled,
          ProfilePicture: action.payload.ProfilePicture,
        },
      };
    case SET_ALL_USERS:
      return {
        ...state,
        userList: action.payload,
      };
    case SET_USER:
      return {
        ...state,
        userList: [...(state.userList || []), action.payload],
      };
    case SET_PATIENT_PICTURE:
      return {
        ...state,
        patientPicture: action.payload,
      };
    case CLEAR_PATIENT_PICTURE:
      return {
        ...state,
        patientPicture: undefined,
      };
    case ROOM_CLEAN_UP:
      return {
        ...state,
        patientPicture: undefined,
      };
    case SET_CURRENT_PATIENT:
      return {
        ...state,
        CurrentPatientId: action.payload.PatientId,
        OpenChat: action.payload.OpenChat,
        useSecondary: false,
      };
    case OPEN_CHAT:
      return {
        ...state,
        OpenChat: action.payload,
      };
    case DELETE_USER:
      return {
        ...state,
        userList:
          state?.userList?.filter(
            (item) => item.ProviderId !== action.payload.ProviderId
          ) || [],
      };
    case SET_ROOM_USER_STATUS:
      return {
        ...state,
        roomUserStatus: action.payload,
      };
    case REMOVE_USER_FROM_ROOM:
      return {
        ...state,
        roomUserStatus:
          state?.roomUserStatus?.map((item) =>
            item.ProviderId === action.payload.ProviderId
              ? { ...item, Allowed: !item.Allowed }
              : item
          ) || [],
      };
    case SET_EMAIL_BODY:
      return {
        ...state,
        emailBody: action.payload?.body,
      };
    case SEND_DOCTOR_NOTE:
      return {
        ...state,
        MeetingData: {
          ...state.MeetingData,
          Appointments: state.MeetingData.Appointments.map((item) =>
            item.AppointmentId === action.payload.AppointmentId
              ? { ...item, Notes: [...(item.Notes || []), action.payload] }
              : item
          ),
        },
      };
    case SAVE_SHARED_ROOM:
      return {
        ...state,
        Rooms: [...state.Rooms, action.payload],
      };
    case SET_ALL_USERS_FOR_ROOM:
      return {
        ...state,
        usersForCurrentSharedRoom: action.payload,
      };
    case SAVE_SMS_BODY:
      return { ...state, smsBody: action?.payload?.body };
    case UPDATE_NOTIFICATION_SETTINGS:
      return {
        ...state,
        ProviderProfile: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
