import { takeEvery, fork, put, all, call } from "redux-saga/effects"

import { REGISTER_USER } from "./actionTypes"
import { registerUserSuccessful, registerUserFailed } from "./actions"
import { login, register } from "../../../helpers/auth_helper"
import { loginSuccess } from "../login/actions";

function* registerUser({ payload: { user,history} }) {
  try {
     if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
      const response = yield call(register, user);
      yield put(registerUserSuccessful(response));
       const res = yield call(login, {
         email: user.email,
         password: user.password,
       });
       localStorage.setItem("authUser", res.data.token);
       localStorage.setItem("user", JSON.stringify(res.data.user));
       yield put(loginSuccess(response));
       history('/dashboard');
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
