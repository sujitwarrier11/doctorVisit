import { put } from "redux-saga/effects";
import { push } from "connected-react-router";
import callApi from "@root/Utilities/Service";
import {
  setProviderDetails,
  setRooms,
  setLoginData,
  setRoomElements,
  setMeetingHistory,
  snackBarConfig,
  setAllUsers,
  setUser,
  setRoomUserStatus,
  setEmailBody,
  toggleLoading,
  saveSharedRoom,
  setAllUsersForRoom,
  saveSmsBody,
} from "@root/src/Redux/ActionCreators";
import { getToken } from "@root/src/Redux/sagas/commonSaga";
import getErrorMessage from "@root/src/Error/ErrorMessaging";

export function* getProviderProfile() {
  try {
    const response = yield callApi("getProviderProfile", {}, {});
    if (response && !response.data.error) {
      yield put(setProviderDetails(response.data));
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

export function* getRooms() {
  try {
    const response = yield callApi("getRooms", {}, {});
    if (response && !response.data.error) {
      yield put(setRooms(response.data));
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

export function* registerProvider({ payload }) {
  try {
    const response = yield callApi("registerProvider", payload, {});
    if (response.data.error) {
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
        snackbarText: getErrorMessage("0000"),
      })
    );
  }
}

export function* navigateToRoom({ payload }) {
  yield getToken({
    payload: {
      AppointmentId: parseInt(payload.AppointmentId, 10),
    },
  });
  if (!payload.reload) {
    yield put(push(`${payload.room}`));
  }
}

export function* saveRoomElements({ payload }) {
  try {
    const response = yield callApi("saveElements", payload);
    if (!response.data.error) {
      yield put(setRoomElements(response.data));
      yield put(
        snackBarConfig({
          open: true,
          variant: "success",
          snackbarText: "Room details updated.",
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

export function* getMeetingHistory({ payload }) {
  yield put(toggleLoading(true));
  try {
    const response = yield callApi("getMeetingHistory", {
      PageNo: parseInt(payload, 10),
    });
    if (!response.data.error) {
      yield put(setMeetingHistory(response.data));
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

export function* updateProviderDetails({ payload }) {
  try {
    yield callApi("updateProviderDetails", payload);
    yield put(
      snackBarConfig({
        open: true,
        variant: "success",
        snackbarText: "Provider details updated.",
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
  }
}

export function* updateRoomDetails({ payload }) {
  try {
    yield callApi("updateRoomDetails", payload);
    yield put(
      snackBarConfig({
        open: true,
        variant: "success",
        snackbarText: "Room details updated.",
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
  }
}

export function* addNewUser({ payload }) {
  try {
    const response = yield callApi("addNewUser", payload);
    if (!response.data.error) {
      yield put(setUser(response.data));
      yield put(
        snackBarConfig({
          open: true,
          variant: "success",
          snackbarText: "New user added successfully",
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

export function* getAllUsers() {
  try {
    const response = yield callApi("getAllUsers");
    if (!response.data.error) {
      yield put(setAllUsers(response.data));
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

export function* deleteUser({ payload }) {
  try {
    yield callApi("deleteUser", payload);
    yield put(
      snackBarConfig({
        open: true,
        variant: "success",
        snackbarText: "User Deleted successfully.",
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
  }
}

export function* getRoomUserStatus({ payload }) {
  try {
    const response = yield callApi("getUserStatusForRoom", payload);
    if (!response.data.error) {
      yield put(setRoomUserStatus(response.data));
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

export function* removeUserFromRoom({ payload }) {
  try {
    yield callApi("addRemoveUserFromRoom", payload);
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

export function* getEmailBody({ payload }) {
  try {
    const response = yield callApi("getEmailBody", payload);
    if (!response.data.error) {
      yield put(setEmailBody(response.data));
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

export function* sendInviteEmail({ payload }) {
  try {
    yield callApi("sendInivteEmail", payload);
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
  }
}

export function* sendDoctorNotes({ payload }) {
  try {
    const response = yield callApi("sendDoctorNotes", payload);
    if (response.data.error) {
      yield put(
        snackBarConfig({
          open: true,
          variant: "error",
          snackbarText: getErrorMessage("0000"),
        })
      );
    } else {
      yield put(
        snackBarConfig({
          open: true,
          variant: "success",
          snackbarText: "Note sent successfully.",
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

export function* addNewSharedRoom({ payload }) {
  try {
    const response = yield callApi("createSharedRoom", payload);
    if (response?.data?.error) {
      yield put(
        snackBarConfig({
          open: true,
          variant: "error",
          snackbarText:
            getErrorMessage(response.data.error) || response.data.error,
        })
      );
    } else {
      yield put(saveSharedRoom(response?.data));
      yield put(
        snackBarConfig({
          open: true,
          variant: "success",
          snackbarText: "Room Created.",
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

export function* getSharedRoomUserStatus({ payload }) {
  try {
    const response = yield callApi("getUserStatusForRoom", payload);
    if (!response.data.error) {
      yield put(setAllUsersForRoom(response.data));
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

export function* getSmsBody({ payload }) {
  try {
    const response = yield callApi("getSmsBody", payload);
    if (response.data.error) {
      yield put(
        snackBarConfig({
          open: true,
          variant: "error",
          snackbarText: getErrorMessage(response.data.error),
        })
      );
    } else {
      yield put(saveSmsBody(response.data));
    }
  } catch (ex) {
    console.log("ex", ex);
    yield put(
      snackBarConfig({
        open: true,
        variant: "error",
        snackbarText: getErrorMessage("0000"),
      })
    );
  }
}

export function* sendSMS({ payload }) {
  try {
    yield callApi("sendSMS", payload);
    yield put(
      snackBarConfig({
        open: true,
        variant: "success",
        snackbarText: "SMS Sent.",
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
  }
}

export function* updateNotificationSettings({ payload }) {
  yield put(toggleLoading(true));
  try {
    yield callApi("updateNotificationSettings", payload);
    yield put(
      snackBarConfig({
        open: true,
        variant: "success",
        snackbarText: "Settings Updated.",
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
