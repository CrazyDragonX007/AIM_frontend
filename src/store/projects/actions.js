import {
  GET_PROJECTS,
  GET_PROJECTS_SUCCESS,
  GET_PROJECTS_FAIL,
  ADD_PROJECT_SUCCESS,
  ADD_PROJECT_FAIL,
  ADD_PROJECT,
  DELETE_PROJECT_SUCCESS,
  DELETE_PROJECT_FAIL,
  DELETE_PROJECT,
  UPDATE_PROJECT_SUCCESS,
  UPDATE_PROJECT_FAIL,
  UPDATE_PROJECT,
  EDIT_EMPLOYEES,
  EDIT_EMPLOYEES_SUCCESS,
  EDIT_EMPLOYEES_FAIL,
  EDIT_MANAGERS,
  EDIT_MANAGERS_SUCCESS,
  EDIT_MANAGERS_FAIL, SET_CURRENT_PROJECT
} from "./actionTypes"

export const getProjects = (teamId) => {
  return {
    type: GET_PROJECTS,
    payload: teamId,
  };
}

export const getProjectsSuccess = (projects) => {
  return {
    type: GET_PROJECTS_SUCCESS,
    payload: projects,
  };
}

export const getProjectsFail = (error) => {
  return {
    type: GET_PROJECTS_FAIL,
    payload: error,
  };
}

export const addProject = (project) => {
  return {
    type: ADD_PROJECT,
    payload: project,
  };
}

export const addProjectSuccess = (project) => {
  return {
    type: ADD_PROJECT_SUCCESS,
    payload: project,
  };
}

export const addProjectFail = (error) => {
  return {
    type: ADD_PROJECT_FAIL,
    payload: error,
  };
}

export const updateProject = (project) => {
  return {
    type: UPDATE_PROJECT,
    payload: project,
  };
}

export const updateProjectSuccess = (project) => {
  return {
    type: UPDATE_PROJECT_SUCCESS,
    payload: project,
  };
}

export const updateProjectFail = (error) => {
  return {
    type: UPDATE_PROJECT_FAIL,
    payload: error,
  };
}

export const deleteProject = (id) => {
  return {
    type: DELETE_PROJECT,
    payload: id,
  };
}

export const deleteProjectSuccess = (id) => {
  return {
    type: DELETE_PROJECT_SUCCESS,
    payload: id,
  };
}

export const deleteProjectFail = (error) => {
  return {
    type: DELETE_PROJECT_FAIL,
    payload: error,
  };
}

export const editEmployees = (id,employees) => {
  return {
    type: EDIT_EMPLOYEES,
    payload: {id,employees},
  };
}

export const editEmployeesSuccess = (project) => {
  return {
    type: EDIT_EMPLOYEES_SUCCESS,
    payload: project,
  };
}

export const editEmployeesFail = (error) => {
  return {
    type: EDIT_EMPLOYEES_FAIL,
    payload: error,
  };
}

export const editManagers = (id,managers) => {
  return {
    type: EDIT_MANAGERS,
    payload: {id,managers},
  };
}

export const editManagersSuccess = (project) => {
  return {
    type: EDIT_MANAGERS_SUCCESS,
    payload: project,
  };
}

export const editManagersFail = (error) => {
  return {
    type: EDIT_MANAGERS_FAIL,
    payload: error,
  };
}

export const setCurrentProject = (project) => {
  return {
    type: SET_CURRENT_PROJECT,
    payload: project,
  };
}

