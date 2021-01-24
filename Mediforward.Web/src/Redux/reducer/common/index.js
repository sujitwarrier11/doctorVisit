import {
  SET_TOKEN,
  LOGOUT,
  SET_UPLOAD_STATUS,
  CLEAR_FILE,
  SAVE_IMAGE_ELEMENT_DETAILS,
  SET_PROFILE_IMAGE,
  SET_CHAT_MESSAGES,
  ROOM_CLEAN_UP,
  SET_PROVIDER_DETAILS,
  SET_PROVIDER_NAME,
  SET_MESSAGE_READ,
  ENABLE_DISABLE_AUDIO,
} from "@root/src/Redux/constants";

const reducer = (state = {}, action) => {
  switch (action.type) {
    case LOGOUT:
      return { chatMessages: {} };
    case SET_TOKEN:
      return {
        ...state,
        appointmentToken: action.payload,
      };
    case SET_UPLOAD_STATUS:
      return {
        ...state,
        file: action.payload,
      };
    case CLEAR_FILE:
      return {
        ...state,
        file: undefined,
      };
    case SAVE_IMAGE_ELEMENT_DETAILS:
      return {
        ...state,
        imageElements: {
          ...(state.imageElements || {}),
          [action.payload.id]: action.payload.data,
        },
      };
    case SET_PROFILE_IMAGE:
      return {
        ...state,
        ProfileImage: action.payload,
      };
    case SET_CHAT_MESSAGES:
      return {
        ...state,
        chatMessages: {
          ...state.chatMessages,
          [action.payload.AppointmentId]: [
            ...(state.chatMessages[action.payload.AppointmentId] || []),
            action.payload.Msg,
          ],
        },
      };
    case ROOM_CLEAN_UP:
      return {
        ...state,
        file: undefined,
      };
    case SET_PROVIDER_DETAILS:
      return {
        ...state,
        currentLanguage: action.payload.Language,
      };
    case SET_PROVIDER_NAME:
      return {
        ...state,
        currentLanguage: action.payload.Language,
      };
    case SET_MESSAGE_READ:
      return {
        ...state,
        chatMessages: {
          ...state.chatMessages,
          [action.payload.AppointmentId]: state.chatMessages[
            action.payload.AppointmentId
          ]?.map((item) => ({ ...item, read: true })),
        },
      };
    case ENABLE_DISABLE_AUDIO:
      return {
        ...state,
        stopAudioPublish: !state.stopAudioPublish,
      };
    default:
      return state;
  }
};

export default reducer;
