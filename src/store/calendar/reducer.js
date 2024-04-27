import {
  GET_SHIFTS_SUCCESS,
  GET_SHIFTS_FAIL,
  ADD_SHIFT_SUCCESS,
  ADD_SHIFT_FAIL,
  UPDATE_SHIFT_SUCCESS,
  UPDATE_SHIFT_FAIL,
  DELETE_SHIFT_SUCCESS,
  DELETE_SHIFT_FAIL,
  GET_SHIFTS, GET_PROJECT_TASKS, GET_PROJECT_TASKS_SUCCESS, GET_PROJECT_TASKS_FAIL
} from "./actionTypes"

const INIT_STATE = {
  shifts: [],
  categories: [],
  error: {},
  tasks:[]
}

const Calendar = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_SHIFTS:
      return {
        ...state,
      }

    case GET_SHIFTS_SUCCESS:
      return {
        ...state,
        shifts: action.payload,
      }

    case GET_SHIFTS_FAIL:
      return {
        ...state,
        error: action.payload,
      }

    case ADD_SHIFT_SUCCESS:
      return {
        ...state,
        shifts: [...state.shifts, action.payload],
      }

    case ADD_SHIFT_FAIL:
      return {
        ...state,
        error: action.payload,
      }

    case UPDATE_SHIFT_SUCCESS:
      return {
        ...state,
        shifts: state.shifts.map(shift => shift._id.toString() === action.payload._id.toString() ? action.payload : shift),
      }

    case UPDATE_SHIFT_FAIL:
      return {
        ...state,
        error: action.payload,
      }

    case DELETE_SHIFT_SUCCESS:
      return {
        ...state,
        shifts: state.shifts.filter(shift => shift._id.toString() !== action.payload._id.toString()),
      }

    case DELETE_SHIFT_FAIL:
      return {
        ...state,
        error: action.payload,
      }

    case GET_PROJECT_TASKS:
      return {
        ...state,
      }

    case GET_PROJECT_TASKS_SUCCESS:
      return {
        ...state,
        tasks: action.payload,
      }

    case GET_PROJECT_TASKS_FAIL:
      return {
        ...state,
        error: action.payload,
      }

    default:
      return state
  }
}

export default Calendar
