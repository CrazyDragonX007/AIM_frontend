import {
  GET_MESSAGES_SUCCESS,
  GET_MESSAGES_FAIL,
  POST_ADD_MESSAGE_SUCCESS,
  POST_ADD_MESSAGE_FAIL, GET_MESSAGES, RECEIVE_MESSAGE
} from "./actionTypes"

const INIT_STATE = {
  messages: [],
  error: {},
  loading: true
}

const Chat = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_MESSAGES:
      return{
        ...state,
        loading:true
      }
    case GET_MESSAGES_SUCCESS:
      return {
        ...state,
        messages: action.payload,
        loading: false
      }

    case GET_MESSAGES_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false
      }

    case POST_ADD_MESSAGE_SUCCESS:
      return {
        ...state,
        messages: [...state.messages, action.payload],
      }
    case POST_ADD_MESSAGE_FAIL:
      return {
        ...state,
        error: action.payload,
      }

    case RECEIVE_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload],
      }

    default:
      return state
  }
}

export default Chat
