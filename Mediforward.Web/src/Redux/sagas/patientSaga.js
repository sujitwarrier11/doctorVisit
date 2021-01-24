import { put } from "redux-saga/effects";
import { push } from "connected-react-router";
import callApi from "@root/Utilities/Service";
import {
  setProviderName,
  setLoginData,
  setAppointmentResponse,
  setRoomDetails,
  snackBarConfig,
  toggleLoading,
} from "@root/src/Redux/ActionCreators";
import { getToken } from "@root/src/Redux/sagas/commonSaga";
import getErrorMessage from "@root/src/Error/ErrorMessaging";

export function* getProviderName({ payload }) {
  try {
    const response = yield callApi("getProviderName", payload);
    if (!response.data.error) {
      yield put(setProviderName(response.data));
    } else {
      yield put(
        snackBarConfig({
          open: true,
          variant: "error",
          snackbarText: getErrorMessage(response.data.error),
        })
      );
    }
  } catch (ex) {
    yield put(
      snackBarConfig({
        open: true,
        variant: "error",
        snackbarText: getErrorMessage("0000"),
      })
    );
  }
}

export function* checkIfPatientExists({ payload }) {
  yield put(toggleLoading(true));
  try {
    const response = yield callApi("checkifPatientExists", payload);
    if (!response.data.error) {
      yield put(setLoginData(response.data));
      const appointmentResponse = yield callApi("createAppointment", payload);
      if (!appointmentResponse.data.error) {
        yield put(setAppointmentResponse(appointmentResponse.data));
        yield getToken({
          payload: {
            AppointmentId: parseInt(
              appointmentResponse?.data?.AppointmentId || "0",
              10
            ),
          },
        });
      } else {
        yield put(
          snackBarConfig({
            open: true,
            variant: "error",
            snackbarText: getErrorMessage(response.data.error),
          })
        );
      }
    } else {
      yield put(
        snackBarConfig({
          open: true,
          variant: "error",
          snackbarText: getErrorMessage(response.data.error),
        })
      );
    }
  } catch (ex) {
    yield put(
      snackBarConfig({
        open: true,
        variant: "error",
        snackbarText: getErrorMessage("0000"),
      })
    );
  } finally {
    yield put(toggleLoading(false));
  }
}

export function* getRoomDetails({ payload }) {
  try {
    const response = yield callApi("getRoomDetails", payload);
    if (!response.data.error) {
      yield put(setRoomDetails(response.data));
    } else {
      yield put(
        snackBarConfig({
          open: true,
          variant: "error",
          snackbarText: getErrorMessage(response.data.error),
        })
      );
    }
  } catch (ex) {
    yield put(
      snackBarConfig({
        open: true,
        variant: "error",
        snackbarText: getErrorMessage("0000"),
      })
    );
  }
}
