import {
  GET_SHIFTS,
  GET_SHIFTS_FAIL,
  GET_SHIFTS_SUCCESS,
  ADD_NEW_SHIFT,
  ADD_SHIFT_SUCCESS,
  ADD_SHIFT_FAIL,
  UPDATE_SHIFT,
  UPDATE_SHIFT_SUCCESS,
  UPDATE_SHIFT_FAIL,
  DELETE_SHIFT,
  DELETE_SHIFT_SUCCESS,
  DELETE_SHIFT_FAIL, GET_PROJECT_TASKS, GET_PROJECT_TASKS_SUCCESS
} from "./actionTypes"

export const getShifts = projectId => ({
  type: GET_SHIFTS,
  payload: projectId,
})

export const getShiftsSuccess = events => ({
  type: GET_SHIFTS_SUCCESS,
  payload: events,
})

export const getShiftsFail = error => ({
  type: GET_SHIFTS_FAIL,
  payload: error,
})

export const addNewShift = event => ({
  type: ADD_NEW_SHIFT,
  payload: event,
})

export const addShiftSuccess = event => ({
  type: ADD_SHIFT_SUCCESS,
  payload: event,
})

export const addShiftFail = error => ({
  type: ADD_SHIFT_FAIL,
  payload: error,
})

export const updateShift = event => ({
  type: UPDATE_SHIFT,
  payload: event,
})

export const updateShiftSuccess = event => ({
  type: UPDATE_SHIFT_SUCCESS,
  payload: event,
})

export const updateShiftFail = error => ({
  type: UPDATE_SHIFT_FAIL,
  payload: error,
})

export const deleteShift = event => ({
  type: DELETE_SHIFT,
  payload: event,
})

export const deleteShiftSuccess = event => ({
  type: DELETE_SHIFT_SUCCESS,
  payload: event,
})

export const deleteShiftFail = error => ({
  type: DELETE_SHIFT_FAIL,
  payload: error,
})

export const getProjectTasks = projectId => ({
  type: GET_PROJECT_TASKS,
  payload: projectId,
})

export const getProjectTasksSuccess = tasks => ({
  type: GET_PROJECT_TASKS_SUCCESS,
  payload: tasks,
})

export const getProjectTasksFail = error => ({
  type: GET_SHIFTS_FAIL,
  payload: error,
})
