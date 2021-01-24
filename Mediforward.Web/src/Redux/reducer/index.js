import { combineReducers } from "redux";
import userReducer from "@root/src/Redux/reducer/user";
import providerReducer from "@root/src/Redux/reducer/provider";
import patientReducer from "@root/src/Redux/reducer/patient";
import { connectRouter } from "connected-react-router";
import { persistReducer } from "redux-persist";
import sessionStorage from "redux-persist/lib/storage/session";
import commonReducer from "@root/src/Redux/reducer/common";
import uiReducer from "@root/src/Redux/reducer/ui";

const persistConfig = {
  key: "persist",
  storage: sessionStorage,
};

const createRootReducer = (history) =>
  persistReducer(
    persistConfig,
    combineReducers({
      user: userReducer,
      provider: providerReducer,
      patient: patientReducer,
      common: commonReducer,
      ui: uiReducer,
      router: connectRouter(history),
    })
  );

export default createRootReducer;
