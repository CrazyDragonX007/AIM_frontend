import {
  REGISTER_USER,
  REGISTER_USER_SUCCESSFUL,
  REGISTER_USER_FAILED,
} from "./actionTypes"

const initialState = {
  registrationError: null,
  message: null,
  loading: false,
  user: null,
}

const account = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_USER:
      return state = {
        ...state,
        loading: true,
        registrationError: null,
      }
    case REGISTER_USER_SUCCESSFUL:
      return state = {
        ...state,
        loading: false,
        user: action.payload,
        registrationError: null,
      }

    case REGISTER_USER_FAILED:
      return state = {
        ...state,
        user: null,
        loading: false,
        registrationError: action.payload,
      }

    default:
      return state = { ...state }
  }
}

export default account
