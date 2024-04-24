import {
  CHANGE_USER_ROLE, CHANGE_USER_ROLE_FAIL, CHANGE_USER_ROLE_SUCCESS,
  GET_ALL_USERS, GET_ALL_USERS_FAIL, GET_ALL_USERS_SUCCESS,
  INVITE_REGISTER_USER, INVITE_REGISTER_USER_FAIL,
  INVITE_REGISTER_USER_SUCCESS,
  INVITE_USER,
  INVITE_USER_FAIL,
  INVITE_USER_SUCCESS, REMOVE_USER, REMOVE_USER_FAIL, REMOVE_USER_SUCCESS
} from "./actionTypes"

const initialState = {
  emails: [],
  message: "",
  loading: false,
  users:[]
}

const Admin = (state = initialState, action) => {
  switch (action.type) {
    case INVITE_USER:
      return state = {
        ...state,
        loading: true,
      }
    case INVITE_USER_SUCCESS:
      return state = {
        ...state,
        loading: false,
        message: action.payload,
      }
    case INVITE_USER_FAIL:
      return state = {
        ...state,
        loading: false,
        error: action.payload,
      }
    case INVITE_REGISTER_USER:
      return state = {
        ...state,
        loading: true,
      }
    case INVITE_REGISTER_USER_SUCCESS:
      return state = {
        ...state,
        loading: false,
        message: action.payload,
      }
    case INVITE_REGISTER_USER_FAIL:
      return state = {
        ...state,
        loading: false,
        error: action.payload,
      }
    case GET_ALL_USERS:
      return state = {
        ...state,
        loading: true,
      }
      case GET_ALL_USERS_SUCCESS:
        return state = {
          ...state,
          loading: false,
          users: action.payload,
        }
        case GET_ALL_USERS_FAIL:
          return state = {
            ...state,
            loading: false,
            error: action.payload,
          }
    case CHANGE_USER_ROLE:
      return state = {
        ...state,
        loading: true,
      }
    case CHANGE_USER_ROLE_SUCCESS:
      return state = {
        ...state,
        loading: false,
        message: action.payload,
      }
    case CHANGE_USER_ROLE_FAIL:
      return state = {
        ...state,
        loading: false,
        error: action.payload,
      }
      case REMOVE_USER:
        return state = {
          ...state,
          loading: true
        }
    case REMOVE_USER_SUCCESS:
      return state = {
        ...state,
        users: state.users.filter(user => user._id !== action.payload._id),
        loading: false
      }
    case REMOVE_USER_FAIL:
      return state = {
        ...state,
        error: action.payload,
        loading: false
      }
    default:
      return state
  }
}

export default Admin