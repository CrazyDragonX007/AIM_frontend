import { EDIT_PROFILE_ERROR, EDIT_PROFILE_SUCCESS, EDIT_PROFILE, RESET_PROFILE_FLAG, CHANGE_PASSWORD, CHANGE_PASSWORD_SUCCESS, CHANGE_PASSWORD_ERROR } from "./actionTypes"

export const editProfile = user => {
  return {
    type: EDIT_PROFILE,
    payload:  user ,
  }
}

export const editProfileSuccess = msg => {
  return {
    type: EDIT_PROFILE_SUCCESS,
    payload: msg,
  }
}

export const editProfileError = error => {
  return {
    type: EDIT_PROFILE_ERROR,
    payload: error,
  }
}

export const resetProfileFlag = error => {
  return {
    type: RESET_PROFILE_FLAG,
  }
}

export const changePassword = data => {
  return {
    type: CHANGE_PASSWORD,
    payload: data,
  }
}

export const changePasswordSuccess = data => {
  return {
    type: CHANGE_PASSWORD_SUCCESS,
    payload: data,
  }
}

export const changePasswordError = data => {
  return {
    type: CHANGE_PASSWORD_ERROR,
    payload: data,
  }
}
