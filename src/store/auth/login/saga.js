import { call, put, takeEvery } from "redux-saga/effects";

import { LOGIN_USER, LOGOUT_USER } from "./actionTypes";
import { apiError, loginSuccess, logoutUserSuccess } from "./actions";
import{login} from "../../../helpers/auth_helper";


function* loginUser({ payload: { user, history } }) {
  try {
    if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
      const response = yield call(login, {
        email: user.email,
        password: user.password,
      });
      if (!response) {
        yield put(apiError("An error occurred. Please try again later."));
        history('/login');
        console.log("No response");
      } else {
        const token = localStorage.getItem("authUser");
        if (token) {
          localStorage.removeItem("authUser");
        }
        const existingUser = localStorage.getItem("user");
        if (existingUser) {
          localStorage.removeItem("user");
        }
        localStorage.setItem("authUser", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        yield put(loginSuccess(response.data.user));
      }
      history('/dashboard');
    }
  } catch (error) {
    console.log(error)
    yield put(apiError(error));
  }
}

function* logoutUser({ payload: { history } }) {
  try {
    localStorage.removeItem("authUser");
    localStorage.removeItem("user");
    history('/login');
    yield put(logoutUserSuccess());
  } catch (error) {
    yield put(apiError(error));
  }
}

function* authSaga() {
  yield takeEvery(LOGIN_USER, loginUser);
  // yield takeLatest(SOCIAL_LOGIN, socialLogin);
  yield takeEvery(LOGOUT_USER, logoutUser);
}

export default authSaga;
