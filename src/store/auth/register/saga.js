import { takeEvery, fork, put, all, call } from "redux-saga/effects"

import { REGISTER_USER } from "./actionTypes"
import { registerUserSuccessful, registerUserFailed } from "./actions"
import { register } from "../../../helpers/auth_helper";

function* registerUser({ payload: { user,history } }) {
  try {
     if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
      console.log(user);
      const response = yield call(register, user);
      console.log(response);
      yield put(registerUserSuccessful(response));
       history('/login');
     }
  } catch (error) {
    yield put(registerUserFailed(error))
  }
}

export function* watchUserRegister() {
  yield takeEvery(REGISTER_USER, registerUser)
}

function* accountSaga() {
  yield all([fork(watchUserRegister)])
}

export default accountSaga
