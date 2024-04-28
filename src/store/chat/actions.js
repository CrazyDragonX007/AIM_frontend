import {
  GET_MESSAGES,
  GET_MESSAGES_FAIL,
  GET_MESSAGES_SUCCESS,
  POST_ADD_MESSAGE,
  POST_ADD_MESSAGE_FAIL,
  POST_ADD_MESSAGE_SUCCESS, RECEIVE_MESSAGE
} from "./actionTypes"

export const getMessages = roomId => ({
  type: GET_MESSAGES,
  payload: roomId,
})

export const getMessagesSuccess = messages => ({
  type: GET_MESSAGES_SUCCESS,
  payload: messages,
})

export const getMessagesFail = error => ({
  type: GET_MESSAGES_FAIL,
  payload: error,
})

export const addMessage = message => ({
  type: POST_ADD_MESSAGE,
  payload: message,
})

export const addMessageSuccess = message => ({
  type: POST_ADD_MESSAGE_SUCCESS,
  payload: message,
})

export const addMessageFail = error => ({
  type: POST_ADD_MESSAGE_FAIL,
  payload: error,
})

export const receiveMessage = message => ({
  type: RECEIVE_MESSAGE,
  payload: message,
})

