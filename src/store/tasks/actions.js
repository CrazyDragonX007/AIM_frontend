import {
  GET_TASKS,
  GET_TASKS_FAIL,
  GET_TASKS_SUCCESS,
  DELETE_TASK_SUCCESS,
  DELETE_TASK_FAIL,
  DELETE_TASK,
  ADD_TASK,
  ADD_TASK_SUCCESS,
  ADD_TASK_FAIL,
  UPDATE_TASK,
  UPDATE_TASK_SUCCESS,
  UPDATE_TASK_FAIL,
  CHANGE_SECTION,
  CHANGE_SECTION_SUCCESS,
  CHANGE_SECTION_FAIL,
  ADD_SECTION,
  ADD_SECTION_FAIL,
  ADD_SECTION_SUCCESS,
  DELETE_SECTION,
  DELETE_SECTION_SUCCESS,
  DELETE_SECTION_FAIL,
  UPDATE_SECTION_FAIL,
  UPDATE_SECTION_SUCCESS,
  UPDATE_SECTION,
  ASSIGN_TASK_FAIL,
  ASSIGN_TASK_SUCCESS, ASSIGN_TASK
} from "./actionTypes"


export const getTasks = projectId => {
  return ({
    type: GET_TASKS,
    payload: projectId,
  })
}

export const getTasksSuccess = tasks => ({
  type: GET_TASKS_SUCCESS,
  payload: tasks,
})

export const getTasksFail = error => ({
  type: GET_TASKS_FAIL,
  payload: error,
})

export const deleteTask = taskId => ({
  type: DELETE_TASK,
  payload: taskId,
})

export const deleteTaskSuccess = task => ({
  type: DELETE_TASK_SUCCESS,
  payload: task,

})

export const deleteTaskFail = task => ({
  type: DELETE_TASK_FAIL,
  payload: task,
})

export const addTask = data => ({
  type: ADD_TASK,
  payload: data,
})

export const addTaskSuccess = task => ({
  type: ADD_TASK_SUCCESS,
  payload: task,
})

export const addTaskFail = error => ({
  type: ADD_TASK_FAIL,
  payload: error,
})

export const updateTask = task => ({
  type: UPDATE_TASK,
  payload: task,
})

export const updateTaskSuccess = task => ({
  type: UPDATE_TASK_SUCCESS,
  payload: task,
})

export const updateTaskFail = error => ({
  type: UPDATE_TASK_FAIL,
  payload: error,
})

export const changeSection = data => ({
  type: CHANGE_SECTION,
  payload: data,
})

export const changeSectionSuccess = data => ({
  type: CHANGE_SECTION_SUCCESS,
  payload: data,
})

export const changeSectionFail = error => ({
  type: CHANGE_SECTION_FAIL,
  payload: error,
})

export const addSection = data => ({
  type: ADD_SECTION,
  payload: data,
})

export const addSectionSuccess = data => ({
  type: ADD_SECTION_SUCCESS,
  payload: data,
})

export const addSectionFail = error => ({
  type: ADD_SECTION_FAIL,
  payload: error,
})

export const deleteSection = data => ({
  type: DELETE_SECTION,
  payload: data,
})

export const deleteSectionSuccess = data => ({
  type: DELETE_SECTION_SUCCESS,
  payload: data,
})

export const deleteSectionFail = error => ({
  type: DELETE_SECTION_FAIL,
  payload: error,
})

export const updateSection = data => ({
  type: UPDATE_SECTION,
  payload: data,
})

export const updateSectionSuccess = data => ({
  type: UPDATE_SECTION_SUCCESS,
  payload: data,
})

export const updateSectionFail = error => ({
  type: UPDATE_SECTION_FAIL,
  payload: error,
})

export const assignTask = data => ({
  type: ASSIGN_TASK,
  payload: data,
})

export const assignTaskSuccess = data => ({
  type: ASSIGN_TASK_SUCCESS,
  payload: data,
})

export const assignTaskFail = error => ({
  type: ASSIGN_TASK_FAIL,
  payload: error,
})

