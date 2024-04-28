import { takeEvery, put } from "redux-saga/effects";

// Chat Redux States
import {
  GET_MESSAGES,
  POST_ADD_MESSAGE,
} from "./actionTypes";
import {
  getMessagesFail,
  addMessageSuccess,
  addMessageFail, getMessagesSuccess
} from "./actions"
import axios from "axios"

function* onGetMessages({ payload: roomId }) {
  try {
    const url = process.env.REACT_APP_BACKEND_URL + "/messages/get_messages";
    const response = yield axios.post(url, roomId );
    yield put(getMessagesSuccess(response.data));
  } catch (error) {
    yield put(getMessagesFail(error));
  }
}

function* onAddMessage({ payload: message }) {
  try {
    const url = process.env.REACT_APP_BACKEND_URL + "/messages/add_message";
    const response = yield axios.post(url, message);
    yield put(addMessageSuccess(response.data));
  } catch (error) {
    yield put(addMessageFail(error));
  }
}

function* chatSaga() {
  yield takeEvery(GET_MESSAGES, onGetMessages);
  yield takeEvery(POST_ADD_MESSAGE, onAddMessage);
}

export default chatSaga;
