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
      localStorage.setItem("authUser", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      yield put(loginSuccess(response.data.user));
    }
    history('/dashboard');
  } catch (error) {
    yield put(apiError(error));
  }
}

function* logoutUser({ payload: { history } }) {
  try {
    localStorage.removeItem("authUser");
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
