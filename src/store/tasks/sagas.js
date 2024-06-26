import { call, put, takeEvery } from "redux-saga/effects"

// Crypto Redux States
import {
  GET_TASKS,
  DELETE_TASK,
  ADD_TASK,
  UPDATE_TASK,
  CHANGE_SECTION,
  ADD_SECTION,
  UPDATE_SECTION,
  DELETE_SECTION,
  ASSIGN_TASK
} from "./actionTypes"
import {
  getTasksSuccess,
  getTasksFail,
  deleteTaskSuccess,
  deleteTaskFail,
  addTaskSuccess,
  addTaskFail,
  updateTaskSuccess,
  updateTaskFail,
  changeSectionSuccess,
  changeSectionFail,
  addSectionSuccess,
  addSectionFail,
  updateSectionFail,
  updateSectionSuccess,
  deleteSectionFail,
  deleteSectionSuccess,
  assignTaskSuccess, assignTaskFail
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
  return axios.delete(url,{params:{id:taskid},headers: {Authorization: token}})
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
    yield put(deleteTaskSuccess(response.data.task))
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
    const {oldAssign,newAssign} = task;
    delete task.oldAssign;
    delete task.newAssign;
    const response = yield call(updateTask, task)
    yield put(updateTaskSuccess(response.data))
    if(oldAssign !== newAssign){
      yield call(assignTask, {payload:{id:task._id,newAssign:newAssign}})
    }
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
    yield put(changeSectionSuccess(response.data.change))
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
    const response = yield axios.post(url, {id:data},{
      headers: {
        Authorization: token
      }
    })
    yield put(deleteSectionSuccess(response.data))
  } catch (error) {
    yield put(deleteSectionFail(error))
  }
}

function* assignTask({payload: data}) {
  try {
    const url = process.env.REACT_APP_BACKEND_URL + "/tasks/assign";
    const response = yield axios.post(url, data,{
      headers: {
        Authorization: token
      }
    })
    yield put(assignTaskSuccess(response.data.task))
  } catch (error) {
    yield put(assignTaskFail(error))
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
  yield takeEvery(ASSIGN_TASK, assignTask)
}

export default tasksSaga
