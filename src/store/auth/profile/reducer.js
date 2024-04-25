import { EDIT_PROFILE_ERROR, EDIT_PROFILE_SUCCESS, EDIT_PROFILE, RESET_PROFILE_FLAG, CHANGE_PASSWORD,CHANGE_PASSWORD_SUCCESS,CHANGE_PASSWORD_ERROR } from "./actionTypes"

const initialState = {
  error: "",
  success: "",
}

const profile = (state = initialState, action) => {
  switch (action.type) {
    case EDIT_PROFILE:
      return state = { ...state }
    case EDIT_PROFILE_SUCCESS:
      return state = { ...state, success: action.payload }
    case EDIT_PROFILE_ERROR:
      return state = { ...state, error: action.payload }
    case RESET_PROFILE_FLAG :
      return state = { ...state, success: null }
    case CHANGE_PASSWORD:
      return state = { ...state }
    case CHANGE_PASSWORD_SUCCESS:
      return state = { ...state, success: action.payload }
    case CHANGE_PASSWORD_ERROR:
      return state = { ...state, error: action.payload }
    default:
      state = { ...state }
  }
  return state
}

export default profile
