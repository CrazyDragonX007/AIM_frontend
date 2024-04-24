import {
  CHANGE_USER_ROLE, CHANGE_USER_ROLE_FAIL, CHANGE_USER_ROLE_SUCCESS,
  GET_ALL_USERS, GET_ALL_USERS_FAIL, GET_ALL_USERS_SUCCESS,
  INVITE_REGISTER_USER, INVITE_REGISTER_USER_FAIL,
  INVITE_REGISTER_USER_SUCCESS,
  INVITE_USER,
  INVITE_USER_FAIL,
  INVITE_USER_SUCCESS, REMOVE_USER, REMOVE_USER_FAIL, REMOVE_USER_SUCCESS
} from "./actionTypes"

export const inviteUser = (emails) => {
  return {
    type: INVITE_USER,
    payload: emails,
  };
}

export const inviteUserSuccess = (message) => {
  return {
    type: INVITE_USER_SUCCESS,
    payload: message,
  };
}

export const inviteUserFail = (error) => {
  return {
    type: INVITE_USER_FAIL,
    payload: error,
  };
}

export const inviteRegisterUser = (user,history) => {
  return {
    type: INVITE_REGISTER_USER,
    payload: { user,history },
  }
}

export const inviteRegisterUserSuccess = user => {
  return {
    type: INVITE_REGISTER_USER_SUCCESS,
    payload: user,
  }
}

export const inviteRegisterUserFail = err => {
  return {
    type: INVITE_REGISTER_USER_FAIL,
    payload: err,
  }
}

export const getAllUsers = teamId => {
  return {
    type: GET_ALL_USERS,
    payload: teamId,
  }
}

export const getAllUsersSuccess = users => {
  return {
    type: GET_ALL_USERS_SUCCESS,
    payload: users,
  }
}

export const getAllUsersFail = error => {
  return {
    type: GET_ALL_USERS_FAIL,
    payload: error,
  }
}

export const changeUserRole = (userId, role) => {
  return {
    type: CHANGE_USER_ROLE,
    payload: { userId, role },
  }
}

export const changeUserRoleSuccess = message => {
  return {
    type: CHANGE_USER_ROLE_SUCCESS,
    payload: message,
  }
}

export const changeUserRoleFail = error => {
  return {
    type: CHANGE_USER_ROLE_FAIL,
    payload: error,
  }
}

export const removeUser = (userId) => {
  return {
    type: REMOVE_USER,
    payload: userId,
  }
}

export const removeUserSuccess = message => {
  return {
    type: REMOVE_USER_SUCCESS,
    payload: message,
  }
}

export const removeUserFail = error => {
  return {
    type: REMOVE_USER_FAIL,
    payload: error,
  }
}
