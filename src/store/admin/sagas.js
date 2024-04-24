import { put, takeEvery, all, fork } from "redux-saga/effects";
import {
  inviteUserSuccess,
  inviteUserFail,
  inviteRegisterUserSuccess,
  inviteRegisterUserFail,
  getAllUsersSuccess,
  getAllUsersFail,
  changeUserRoleFail, changeUserRoleSuccess, removeUserSuccess, removeUserFail
} from "./actions"
import axios from "axios"
import { CHANGE_USER_ROLE, GET_ALL_USERS, INVITE_REGISTER_USER, INVITE_USER, REMOVE_USER } from "./actionTypes"

const token = localStorage.getItem("authUser");

function* inviteUsers({ payload:  emails  }) {
  try {
    console.log(emails)
    const url = process.env.REACT_APP_BACKEND_URL + "/users/invite";
    const response = yield axios.post(url, { invites:emails }, {
      headers: {
        Authorization: token
      }
    });
    yield put(inviteUserSuccess(response.data))
  } catch (error) {
    yield put(inviteUserFail(error))
  }
}

function* inviteRegisterUser({ payload:  {user, history} }) {
  try {
    const url = process.env.REACT_APP_BACKEND_URL + "/users/invite-register";
    const loginUrl = process.env.REACT_APP_BACKEND_URL + "/users/login";
    const response = yield axios.post(url, user);
    yield put(inviteRegisterUserSuccess(response.data));
    const res = yield axios.post(loginUrl, {
      email: user.email,
      password: user.password,
    });
    localStorage.setItem("authUser", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    history("/dashboard")
  }catch (error) {
    yield put(inviteRegisterUserFail(error))
  }
}

function* getAllUsers({payload:teamId}) {
  try {
    console.log(teamId)
    const url = process.env.REACT_APP_BACKEND_URL + "/users/all_users";
    const response = yield axios.get(url, {
      params: { teamId },
      headers: {
        Authorization: token
      }
    });
    yield put(getAllUsersSuccess(response.data))
  } catch (error) {
    yield put(getAllUsersFail(error))
  }
}

function* changeUserRole({payload:{userId,role}}) {
  try {
    const url = process.env.REACT_APP_BACKEND_URL + "/users/change_role";
    const response = yield axios.put(url, {userId,role}, {
      headers: {
        Authorization: token
      }
    });
    yield put(changeUserRoleSuccess(response.data))
  } catch (error) {
    yield put(changeUserRoleFail(error))
  }
}

function* removeUser({payload:userId}) {
  try {
    const url = process.env.REACT_APP_BACKEND_URL + "/users/delete";
    const response = yield axios.post(url, {userId}, {
      headers: {
        Authorization: token
      }
    });
    yield put(removeUserSuccess(response.data.user))
  } catch (error) {
    yield put(removeUserFail(error))
  }
}

export function* watchInviteUser() {
  yield takeEvery(INVITE_USER, inviteUsers)
}

export function* watchInviteRegisterUser() {
  yield takeEvery(INVITE_REGISTER_USER, inviteRegisterUser)
}

export function* watchGetAllUsers() {
  yield takeEvery(GET_ALL_USERS, getAllUsers)
}

export function* watchChangeUserRole() {
  yield takeEvery(CHANGE_USER_ROLE, changeUserRole)
}

export function* watchRemoveUser() {
  yield takeEvery(REMOVE_USER, removeUser)

}

export default function* adminSaga() {
  yield all([
    fork(watchInviteUser),
    fork(watchInviteRegisterUser),
    fork(watchGetAllUsers),
    fork(watchChangeUserRole),
    fork(watchRemoveUser)
  ])
}
