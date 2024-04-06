import { takeEvery, fork, put, all, call } from "redux-saga/effects"

import { EDIT_PROFILE } from "./actionTypes"
import { profileSuccess, profileError } from "./actions"

function* editProfile({ payload: { user } }) {
  function postJwtProfile() {

  }

  try {
    if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
      const response = yield call(postJwtProfile, "/post-jwt-profile", {
        username: user.username,
        idx: user.idx,
      })
      yield put(profileSuccess(response))
    }
  } catch (error) {
    yield put(profileError(error))
  }
}
export function* watchProfile() {
  yield takeEvery(EDIT_PROFILE, editProfile)
}

function* ProfileSaga() {
  yield all([fork(watchProfile)])
}

export default ProfileSaga
