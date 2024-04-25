import { takeEvery, fork, put, all } from "redux-saga/effects"

import { EDIT_PROFILE, CHANGE_PASSWORD } from "./actionTypes"
import { changePasswordError, changePasswordSuccess, editProfileError } from "./actions"
import axios from "axios"

function* editProfile({ payload:  user  }) {
  try {
    const url = process.env.REACT_APP_BACKEND_URL + "/users/edit";
    const response = yield axios.put(url, user)
    console.log(response)
  }catch (error) {
    yield put(editProfileError(error))
  }
}

function* updatePassword({ payload:  data  }) {
  try {
    const url = process.env.REACT_APP_BACKEND_URL + "/users/change_password";
    const response = yield axios.put(url, data)
    yield put(changePasswordSuccess(response.data.message))
  }catch (error) {
    console.log(error)
    yield put(changePasswordError(error.response.data.message))
  }
}

export function* watchProfile() {
  yield takeEvery(EDIT_PROFILE, editProfile)
}

export function* watchChangePassword() {
  yield takeEvery(CHANGE_PASSWORD, updatePassword)
}

function* ProfileSaga() {
  yield all([fork(watchProfile), fork(watchChangePassword)])
}

export default ProfileSaga
