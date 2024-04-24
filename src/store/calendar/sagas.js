import { takeEvery, put, call } from "redux-saga/effects"

// Calender Redux States
import {
  ADD_NEW_EVENT,
  DELETE_EVENT,
  GET_CATEGORIES,
  GET_EVENTS,
  UPDATE_EVENT,
} from "./actionTypes"
import {
  getEventsSuccess,
  getEventsFail,
  addEventFail,
  addEventSuccess,
  updateEventSuccess,
  updateEventFail,
  deleteEventSuccess,
  deleteEventFail,
  getCategoriesSuccess,
  getCategoriesFail,
} from "./actions"
import axios from "axios"

const token = localStorage.getItem("authUser");

const getEvents = async (projectId) => {
  // const meetings_url = process.env.REACT_APP_BACKEND_URL + "/meetings/all_meetings";
  // const meetingsResponse = await axios.get(meetings_url, {
  //   params:{
  //     projectId: "6625eccf4b00905d20684776"
  //   },
  //   headers: {
  //     Authorization: token
  //   }
  // });
  // }
  const shifts_url = process.env.REACT_APP_BACKEND_URL + "/shifts/all_shifts";
  const shiftsResponse = await axios.get(shifts_url, {
    params:{
      projectId: projectId
    },
    headers: {
      Authorization: token
    }
  });
  return shiftsResponse.data;
}

const addNewEvent = async event => {

}

const updateEvent = async event => {

}

const deleteEvent = async event => {

}

const getCategories = async () => {

}

function* fetchEvents({payload:projectId}) {
  try {
    console.log(projectId)
    const response = yield call(getEvents,projectId)
    yield put(getEventsSuccess(response))
  } catch (error) {
    yield put(getEventsFail(error))
  }
}

function* onAddNewEvent({ payload: event }) {
  try {
    const response = yield call(addNewEvent, event)
    yield put(addEventSuccess(response))
  } catch (error) {
    yield put(addEventFail(error))
  }
}

function* onUpdateEvent({ payload: event }) {
  try {
    const response = yield call(updateEvent, event)
    yield put(updateEventSuccess(response))
  } catch (error) {
    yield put(updateEventFail(error))
  }
}

function* onDeleteEvent({ payload: event }) {
  try {
    const response = yield call(deleteEvent, event)
    yield put(deleteEventSuccess(response))
  } catch (error) {
    yield put(deleteEventFail(error))
  }
}

function* onGetCategories() {
  try {
    const response = yield call(getCategories)
    yield put(getCategoriesSuccess(response))
  } catch (error) {
    yield put(getCategoriesFail(error))
  }
}

function* calendarSaga() {
  yield takeEvery(GET_EVENTS, fetchEvents)
  yield takeEvery(ADD_NEW_EVENT, onAddNewEvent)
  yield takeEvery(UPDATE_EVENT, onUpdateEvent)
  yield takeEvery(DELETE_EVENT, onDeleteEvent)
  yield takeEvery(GET_CATEGORIES, onGetCategories)
}

export default calendarSaga
