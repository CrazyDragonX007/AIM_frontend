import { takeEvery, put, call } from "redux-saga/effects"

// Calender Redux States
import {
  ADD_NEW_SHIFT,
  DELETE_SHIFT, GET_PROJECT_TASKS,
  GET_SHIFTS,
  UPDATE_SHIFT
} from "./actionTypes"
import {
  getShiftsSuccess,
  getShiftsFail,
  addShiftFail,
  addShiftSuccess,
  updateShiftSuccess,
  updateShiftFail,
  deleteShiftSuccess,
  deleteShiftFail, getProjectTasksSuccess, getProjectTasksFail
} from "./actions"
import axios from "axios"

const token = localStorage.getItem("authUser");

const getShifts = async (projectId) => {
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

const addNewShift = async shift => {
  const url = process.env.REACT_APP_BACKEND_URL + "/shifts/create";
  const response = await axios.post(url, shift, {
    headers: {
      Authorization: token
    }
  });
  return response.data;
}

const updateShift = async shift => {
  const url = process.env.REACT_APP_BACKEND_URL + "/shifts/edit";
  const response = await axios.put(url, shift, {
    headers: {
      Authorization: token
    }
  });
 return response.data;
}

const deleteShift = async shiftId => {
  const url = process.env.REACT_APP_BACKEND_URL + "/shifts/delete";
  const response = await axios.delete(url, {
    params: {
      id: shiftId
    },
    headers: {
      Authorization: token
    }
  });
  return response.data;

}

function* fetchShifts({payload:projectId}) {
  try {
    const response = yield call(getShifts,projectId)
    yield put(getShiftsSuccess(response))
  } catch (error) {
    yield put(getShiftsFail(error))
  }
}

function* onAddNewEvent({ payload: shift }) {
  try {
    const response = yield call(addNewShift, shift)
    yield put(addShiftSuccess(response.shift))
  } catch (error) {
    yield put(addShiftFail(error))
  }
}

function* onUpdateEvent({ payload: shift }) {
  try {
    const response = yield call(updateShift, shift)
    yield put(updateShiftSuccess(response.shift))
  } catch (error) {
    yield put(updateShiftFail(error))
  }
}

function* onDeleteEvent({ payload: id }) {
  try {
    const response = yield call(deleteShift, id)
    yield put(deleteShiftSuccess(response.shift))
  } catch (error) {
    yield put(deleteShiftFail(error))
  }
}

function* getProjectTasks({payload:projectId}) {
  try {
    const url = process.env.REACT_APP_BACKEND_URL + "/tasks/project_tasks";
    const response = yield axios.get(url, {
      params: {
        projectId: projectId
      }
    });
    yield put(getProjectTasksSuccess(response.data));
  }catch(error){
    yield put(getProjectTasksFail(error))
    console.log(error)
  }
}

function* calendarSaga() {
  yield takeEvery(GET_SHIFTS, fetchShifts)
  yield takeEvery(ADD_NEW_SHIFT, onAddNewEvent)
  yield takeEvery(UPDATE_SHIFT, onUpdateEvent)
  yield takeEvery(DELETE_SHIFT, onDeleteEvent)
  yield takeEvery(GET_PROJECT_TASKS, getProjectTasks)
}

export default calendarSaga
