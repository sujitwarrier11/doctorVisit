import {
  SET_PROVIDER_NAME,
  SET_APPOINTMENT_RESPONSE,
  LOGOUT,
  SET_ROOM_DETAILS,
  SET_PATIENT_CONNECTION,
  SET_SECONDARY_PATIENT,
  OPEN_PATIENT_CHAT,
} from "@root/src/Redux/constants";

const reducer = (state = {}, action) => {
  switch (action.type) {
    case SET_APPOINTMENT_RESPONSE:
      return {
        ...state,
        appointmentData: action.payload,
      };
    case LOGOUT:
      return {};
    case SET_PROVIDER_NAME:
      return {
        ...state,
        providerDetails: action.payload,
      };
    case SET_ROOM_DETAILS:
      return {
        ...state,
        RoomData: action.payload,
      };
    case SET_PATIENT_CONNECTION:
      return {
        ...state,
        patientConnection: action.payload,
      };
    case SET_SECONDARY_PATIENT:
      return {
        ...state,
        groupCallAppointment: action.payload,
      };
    case OPEN_PATIENT_CHAT:
      return { ...state, OpenPatientChat: action.payload };
    default:
      return state;
  }
};

export default reducer;
