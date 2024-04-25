import { put, takeEvery, all, fork } from "redux-saga/effects";
import axios from "axios"
import {
  addProjectFail,
  addProjectSuccess,
  deleteProjectFail,
  deleteProjectSuccess,
  editEmployeesFail,
  editEmployeesSuccess,
  editManagersFail,
  editManagersSuccess,
  getProjectsFail,
  getProjectsSuccess,
  updateProjectFail,
  updateProjectSuccess
} from "./actions"
import { ADD_PROJECT, DELETE_PROJECT, EDIT_EMPLOYEES, EDIT_MANAGERS, GET_PROJECTS, UPDATE_PROJECT } from "./actionTypes"

const token = localStorage.getItem("authUser");
function* getProjects({payload:teamId}) {
  try {
    const url = process.env.REACT_APP_BACKEND_URL + "/projects/all_projects";
    const response = yield axios.get(url, {
      params: { teamId },
      headers: {
        Authorization: token
      }
    });
   yield put(getProjectsSuccess(response.data))
  } catch (error) {
    yield put(getProjectsFail(error))
  }
}

function* updateProject({payload:project}) {
  try {
    const url = process.env.REACT_APP_BACKEND_URL + "/projects/edit";
    const response = yield axios.put(url,project, {
      headers: {
        Authorization: token
      }
    });
    yield put(updateProjectSuccess(response.data.project))
  } catch (error) {
    yield put(updateProjectFail(error))
  }
}

function* addProject({ payload:  project  }) {
  try {
    const url = process.env.REACT_APP_BACKEND_URL + "/projects/create";
    const response = yield axios.post(url, project, {
      headers: {
        Authorization: token
      }
    })
    yield put(addProjectSuccess(response.data.project))
  } catch (error) {
    yield put(addProjectFail(error))
  }
}

function* deleteProject({ payload:  id }) {
  try {
    const url = process.env.REACT_APP_BACKEND_URL + "/projects/delete"
    yield axios.delete(url, {
      params: { id },
      headers: {
        Authorization: token
      }
    })
    yield put(deleteProjectSuccess(id))
  } catch (error) {
    yield put(deleteProjectFail(error))
  }
}

function* editEmployees({ payload: { id,employees } }) {
  try {
    const url = process.env.REACT_APP_BACKEND_URL + "/projects/edit_employees"
    const response = yield axios.put(url, {id,assignedEmployees:employees}, {
      headers: {
        Authorization: token
      }
    })
   yield put(editEmployeesSuccess(response.data.project))
  } catch (error) {
    yield put(editEmployeesFail(error))
  }
}

function* editManagers({ payload: { id, managers } }) {
  try {
    const url = process.env.REACT_APP_BACKEND_URL + "/projects/edit_managers"
    const response = yield axios.put(url, { id, assignedManagers:managers }, {
      headers: {
        Authorization: token
      }
    })
    yield put(editManagersSuccess(response.data.project))
  } catch (error) {
    yield put(editManagersFail(error))
  }
}

export function* watchEditManagers() {
  yield takeEvery(EDIT_MANAGERS, editManagers);
}

export function* watchEditEmployees() {
  yield takeEvery(EDIT_EMPLOYEES, editEmployees);
}

export function* watchDeleteProject() {
  yield takeEvery(DELETE_PROJECT, deleteProject);
}

export function* watchAddProject() {
  yield takeEvery(ADD_PROJECT, addProject);
}

export function* watchGetProjects() {
  yield takeEvery(GET_PROJECTS, getProjects);
}

export function* watchUpdateProject() {
  yield takeEvery(UPDATE_PROJECT, updateProject);
}

function* projectsSaga() {
  yield all([
    fork(watchGetProjects),
    fork(watchUpdateProject),
    fork(watchAddProject),
    fork(watchDeleteProject),
    fork(watchEditEmployees),
    fork(watchEditManagers)
  ])
}

export default projectsSaga;