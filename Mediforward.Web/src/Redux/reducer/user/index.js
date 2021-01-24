import {
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  SET_FILES,
  SET_THEME,
  CHECK_PATIENT_EXISTANCE,
  LOGOUT,
  CLEAR_PATIENT_DETAILS,
} from "@root/src/Redux/constants";

const getThemeObject = (payload) => {
  if (!payload) return payload;
  if (!payload.Elements) return undefined;
  return payload.Elements.reduce((acc, item) => {
    acc[item.Type] = item.Content;
    return acc;
  }, {});
};

const reducer = (state = {}, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        ...action.payload,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    case SET_FILES:
      return {
        ...state,
        files: action.payload,
      };
    case SET_THEME:
      return {
        ...state,
        userTheme: getThemeObject(action.payload),
      };
    case LOGOUT:
      return {
        userTheme: state.userTheme,
      };
    case CHECK_PATIENT_EXISTANCE:
      return {
        ...state,
        patientDetails: action.payload,
      };
    case CLEAR_PATIENT_DETAILS:
      return {
        ...state,
        patientDetails: undefined,
      };
    default:
      return state;
  }
};

export default reducer;
