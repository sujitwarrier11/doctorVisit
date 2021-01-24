import { put } from "redux-saga/effects";
import { push } from "connected-react-router";
import callApi from "@root/Utilities/Service";
import {
  setToken,
  setUploadStatus,
  saveImageElementDetails,
  snackBarConfig,
} from "@root/src/Redux/ActionCreators";
import getErrorMessage from "@root/src/Error/ErrorMessaging";

export function* getToken({ payload }) {
  try {
    const response = yield callApi("getToken", payload);
    if (!response.data.error) {
      yield put(setToken(response.data));
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

export function* uploadFile({ payload }) {
  try {
    const formData = new FormData();
    payload?.forEach((file, idx) => formData.append(`file${idx}`, file));
    const response = yield callApi("uploadFile", formData, {
      "Content-Type": "multipart/form-data",
      Accept: "multipart/form-data",
    });
    if (!response.data.error) {
      yield put(
        snackBarConfig({
          open: true,
          variant: "success",
          snackbarText: "Image Uploaded successfully",
        })
      );
      yield put(setUploadStatus(response.data));
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

export function* uploadImageElement({ payload }) {
  try {
    const formData = new FormData();
    formData.append("file", payload.file);
    const response = yield callApi("uploadFile", formData, {
      "Content-Type": "multipart/form-data",
      Accept: "multipart/form-data",
    });
    if (!response.data.error) {
      yield put(
        saveImageElementDetails({ id: payload.id, data: response.data[0] })
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
