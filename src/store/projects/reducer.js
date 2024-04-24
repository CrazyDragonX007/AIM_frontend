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
  EDIT_MANAGERS_FAIL,
} from "./actionTypes";

const initialState = {
  projects: [],
  currentProject: {},
  error: "",
  loading: false,
};

const Projects = (state=initialState,action) => {
    switch (action.type) {
        case GET_PROJECTS:
            return state = {
                ...state,
                loading: true,
            }
        case GET_PROJECTS_SUCCESS:
            return state = {
                ...state,
                loading: false,
                projects: action.payload,
            }
        case GET_PROJECTS_FAIL:
            return state = {
                ...state,
                loading: false,
                error: action.payload,
            }
        case ADD_PROJECT:
            return state = {
                ...state,
                loading: true,
            }
        case ADD_PROJECT_SUCCESS:
            return state = {
                ...state,
                loading: false,
                projects: [...state.projects,action.payload],
            }
        case ADD_PROJECT_FAIL:
            return state = {
                ...state,
                loading: false,
                error: action.payload,
            }
        case DELETE_PROJECT:
            return state = {
                ...state,
                loading: true,
            }
        case DELETE_PROJECT_SUCCESS:
            return state = {
                ...state,
                loading: false,
                projects: state.projects.filter(project => project.id !== action.payload),
            }
        case DELETE_PROJECT_FAIL:
            return state = {
                ...state,
                loading: false,
                error: action.payload,
            }
        case UPDATE_PROJECT:
            return state = {
                ...state,
                loading: true,
            }
        case UPDATE_PROJECT_SUCCESS:
            return state = {
                ...state,
                loading: false,
                projects: state.projects.map(project => project.id === action.payload.id ? action.payload : project),
                currentProject: action.payload,
            }
        case UPDATE_PROJECT_FAIL:
            return state = {
                ...state,
                loading: false,
                error: action.payload,
            }
        case EDIT_EMPLOYEES:
            return state = {
                ...state,
                loading: true,
            }
        case EDIT_EMPLOYEES_SUCCESS:
            return state = {
                ...state,
                loading: false,
                currentProject: action.payload,
                projects: state.projects.map(project => project._id === action.payload._id ? action.payload : project),
            }
        case EDIT_EMPLOYEES_FAIL:
            return state = {
                ...state,
                loading: false,
                error: action.payload,
            }
        case EDIT_MANAGERS:
            return state = {
                ...state,
                loading: true,
            }
        case EDIT_MANAGERS_SUCCESS:
            return state = {
                ...state,
                loading: false,
                projects: state.projects.map(project => project._id === action.payload._id ? action.payload : project),
                currentProject: action.payload,
            }
        case EDIT_MANAGERS_FAIL:
            return state = {
                ...state,
                loading: false,
                error: action.payload,
            }
        default:
            return state
    }
}

export default Projects;

