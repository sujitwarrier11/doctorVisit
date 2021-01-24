import { SET_SNACKBAR_STATE, TOGGLE_LOADING } from "@root/src/Redux/constants";

const reducer = (state = {}, action) => {
  switch (action?.type) {
    case SET_SNACKBAR_STATE:
      return {
        ...state,
        snackbarConfig: action.payload,
      };
    case TOGGLE_LOADING:
      return {
        ...state,
        loader: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
