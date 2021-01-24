import { put } from "redux-saga/effects";
import {
  setLoginData,
  setThemeData,
  snackBarConfig,
  toggleLoading,
} from "@root/src/Redux/ActionCreators";
import { push } from "connected-react-router";
import callApi from "@root/Utilities/Service";
import getErrorMessage from "@root/src/Error/ErrorMessaging";

export function* login({ payload }) {
  yield put(toggleLoading(true));
  try {
    yield put(
      snackBarConfig({
        open: false,
      })
    );
    const { username, password } = payload;
    const response = yield callApi("login", {
      Username: username,
      Password: password,
    });
    if (response.data.error) {
      yield put(toggleLoading(false));
      yield put(
        snackBarConfig({
          open: true,
          variant: "error",
          snackbarText: getErrorMessage(response.data.error),
        })
      );
    } else {
      yield put(setLoginData(response.data));
      yield put(push("/account/dashboard"));
    }
  } catch (ex) {
    yield put(
      snackBarConfig({
        open: true,
        variant: "error",
        snackbarText: "Incorrect username or password.",
      })
    );
  }
}

export function* getTheme({ payload }) {
  try {
    yield put(toggleLoading(true));
    const response = yield callApi("getTheme", { HostName: payload });
    if (!response.data.error) {
      yield put(setThemeData(response.data));
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

export function* updateEmail({ payload }) {
  try {
    const response = yield callApi("updateEmail", payload);
    if (!response.data.error) {
      yield put(setLoginData(response.data));
      yield put(
        snackBarConfig({
          open: true,
          variant: "success",
          snackbarText: "Email updated.",
        })
      );
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

export function* updatePassword({ payload }) {
  try {
    const response = yield callApi("updatePassword", payload);
    if (!response.data.error) {
      yield put(
        snackBarConfig({
          open: true,
          variant: "success",
          snackbarText: "Password updated.",
        })
      );
      yield put(setLoginData(response.data));
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

export function* generateForgotPasswordEmail({ payload }) {
  yield put(toggleLoading(true));
  try {
    yield callApi("generateForgotPasswordEmail", payload);
    yield put(
      snackBarConfig({
        open: true,
        variant: "success",
        snackbarText: "Email Sent.",
      })
    );
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

export function* resetUserPassword({ payload }) {
  yield put(toggleLoading(true));
  try {
    const response = yield callApi("resetPassword", payload);
    if (!response.data.error) {
      yield put(
        snackBarConfig({
          open: true,
          variant: "success",
          snackbarText: "Password successfully changed.",
        })
      );
      yield put(push("/"));
    } else {
      yield put(
        snackBarConfig({
          open: true,
          variant: "error",
          snackbarText: getErrorMessage("response.data.error"),
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
