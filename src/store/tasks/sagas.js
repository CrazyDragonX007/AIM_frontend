import { call, put, takeEvery } from "redux-saga/effects"

// Crypto Redux States
import {
  GET_TASKS, DELETE_TASK, ADD_TASK, UPDATE_TASK, CHANGE_SECTION, ADD_SECTION, UPDATE_SECTION, DELETE_SECTION
} from "./actionTypes"
import {
  getTasksSuccess,
  getTasksFail,
  deleteTaskSuccess,
  deleteTaskFail,
  addTaskSuccess,
  addTaskFail,
  updateTaskSuccess,
  updateTaskFail, changeSectionSuccess, changeSectionFail,
  addSectionSuccess, addSectionFail, updateSectionFail, updateSectionSuccess, deleteSectionFail, deleteSectionSuccess
} from "./actions"

import { toast } from "react-toastify"
import axios from "axios"

const token = localStorage.getItem("authUser");
const getProjectTasks =  (projectId) => {
  const url = process.env.REACT_APP_BACKEND_URL + "/tasks/all_tasks";
  return axios.get(url,{headers: { Authorization: token},params:{projectId} })
}

const deleteTask = (taskid) => {
  const url = process.env.REACT_APP_BACKEND_URL + `/tasks/delete`;
  return axios.delete(url,{headers: {Authorization: token}})
}

const addTask = (task) => {
  const url = process.env.REACT_APP_BACKEND_URL + "/tasks/create";
  return axios.post(url,task,{headers: {Authorization: token}})
}

const updateTask = (task) => {
  const url = process.env.REACT_APP_BACKEND_URL + "/tasks/edit";
  return axios.put(url,task,{headers: {Authorization: token}})
}

function* fetchTasks({payload:projectId}) {
  try {
    const response = yield call(getProjectTasks,projectId)
    yield put(getTasksSuccess(response.data))
  } catch (error) {
    console.log(error)
    yield put(getTasksFail(error))
  }
}

function* onDeleteTask({ payload: taskId }) {
  try {
    const response = yield call(deleteTask,taskId)
    yield put(deleteTaskSuccess(response))
    toast.success("Task Deleted Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(deleteTaskFail(error))
    toast.error("Task Deletion Failed", { autoClose: 2000 });
  }
}

function* onAddTask({ payload: task }) {
  try {
    const response = yield call(addTask, task)
    yield put(addTaskSuccess(response.data.task))
    toast.success("Task Added Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(addTaskFail(error))
    toast.error("Task Addition Failed", { autoClose: 2000 });
  }
}

function* onUpdateTask({ payload: task }) {
  try {
    const response = yield call(updateTask, task)
    yield put(updateTaskSuccess(response))
    toast.success("Task Updated Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(updateTaskFail(error))
    toast.error("Failed to Update Task", { autoClose: 2000 });
  }
}

function* changeTaskSection({ payload: data }) {
  try {
    const url = process.env.REACT_APP_BACKEND_URL + "/tasks/change_section";
    const response = yield axios.put(url, data,{
      headers: {
        Authorization: token
      }
    })
    yield put(changeSectionSuccess(response.data))
    // toast.success("Task Updated Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(changeSectionFail(error))
    // toast.error("Failed to Update Task", { autoClose: 2000 });
  }
}

function* createSection({ payload: data }) {
  try {
    const url = process.env.REACT_APP_BACKEND_URL + "/sections/create";
    const response = yield axios.post(url, data,{
      headers: {
        Authorization: token
      }
    })
    yield put(addSectionSuccess(response.data))
  } catch (error) {
    yield put(addSectionFail(error))
  }
}

function* editSection({ payload: data }) {
  try {
    const url = process.env.REACT_APP_BACKEND_URL + "/sections/edit";
    const response = yield axios.put(url, data,{
      headers: {
        Authorization: token
      }
    })
    yield put(updateSectionSuccess(response.data))
  } catch (error) {
    yield put(updateSectionFail(error))
  }
}

function* deleteSection({ payload: data }) {
  try {
    const url = process.env.REACT_APP_BACKEND_URL + "/sections/delete";
    const response = yield axios.post(url, data,{
      headers: {
        Authorization: token
      }
    })
    yield put(deleteSectionSuccess(response.data))
  } catch (error) {
    yield put(deleteSectionFail(error))
  }
}

function* tasksSaga() {
  yield takeEvery(GET_TASKS, fetchTasks)
  yield takeEvery(UPDATE_TASK, onUpdateTask)
  yield takeEvery(DELETE_TASK, onDeleteTask)
  yield takeEvery(ADD_TASK, onAddTask)
  yield takeEvery(CHANGE_SECTION, changeTaskSection)
  yield takeEvery(ADD_SECTION, createSection)
  yield takeEvery(UPDATE_SECTION, editSection)
  yield takeEvery(DELETE_SECTION, deleteSection)
}

export default tasksSaga
