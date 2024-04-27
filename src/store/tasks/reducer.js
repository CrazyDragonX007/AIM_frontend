import {
  GET_TASKS_SUCCESS,
  GET_TASKS_FAIL,
  DELETE_TASK,
  DELETE_TASK_SUCCESS,
  DELETE_TASK_FAIL,
  ADD_TASK_SUCCESS,
  ADD_TASK_FAIL,
  UPDATE_TASK_SUCCESS,
  UPDATE_TASK_FAIL,
  GET_TASKS,
  ADD_TASK,
  UPDATE_TASK,
  CHANGE_SECTION,
  CHANGE_SECTION_SUCCESS,
  CHANGE_SECTION_FAIL,
  ADD_SECTION,
  ADD_SECTION_SUCCESS,
  ADD_SECTION_FAIL,
  UPDATE_SECTION,
  UPDATE_SECTION_SUCCESS,
  UPDATE_SECTION_FAIL,
  DELETE_SECTION,
  DELETE_SECTION_FAIL,
  DELETE_SECTION_SUCCESS,
  ASSIGN_TASK,
  ASSIGN_TASK_SUCCESS,
  ASSIGN_TASK_FAIL
} from "./actionTypes"

const INIT_STATE = {
  sections: [],
  error: {},
  loading : true
}

const Tasks = (state = INIT_STATE, action) => {
  switch (action.type) {

    case GET_TASKS:
      return {
        ...state,
        loading : true
      }

    case GET_TASKS_SUCCESS:
      return {
        ...state,
        sections: action.payload,
        loading : false
      }

    case GET_TASKS_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false
      }

    case ADD_TASK:
      return {
        ...state,
        loading : true
      }

    case ADD_TASK_SUCCESS:
      return {
        ...state,
        sections: state.sections.map(s => {
          if (s._id === action.payload.currentSection) {
            return {
              ...s,
              tasks: [...s.tasks, action.payload],
            }
          }
          return s
        }),
      }

    case ADD_TASK_FAIL:
      return {
        ...state,
        error: action.payload,
      }

      case UPDATE_TASK:
      return {
        ...state,
        loading : true
      }

    case UPDATE_TASK_SUCCESS:
      return {
        ...state,
        sections: state.sections.map(s => {
          if (s._id === action.payload.currentSection) {
            return {
              ...s,
              tasks: s.tasks.map(t => t._id.toString() === action.payload._id.toString() ? action.payload : t),
            }
          }
          return s
        }),
      }

    case UPDATE_TASK_FAIL:
      return {
        ...state,
        error: action.payload,
      }

    case DELETE_TASK_SUCCESS:
      return {
        ...state,
        sections: state.sections.map(s => {
          const updatedTasks = s.tasks.filter(
            task => task._id !== action.payload._id
          )
          return { ...s, tasks: updatedTasks }
        }),
        loading: false,
      }

    case DELETE_TASK:
      return {
        ...state,
        loading: true,
      }

    case DELETE_TASK_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      }

      case CHANGE_SECTION:
      return {
        ...state,
        loading : true
      }

      case CHANGE_SECTION_SUCCESS:
        return {
          ...state,
          sections: state.sections.map(s => {
            if(s._id===action.payload.oldSection){
              return {
                ...s,
                tasks: s.tasks.filter(
                  t => t._id.toString() !== action.payload.task._id.toString()
                ),
              }
            }
            if(s._id===action.payload.newSection){
              return {
                ...s,
                tasks: [...s.tasks, action.payload.task],
              }
            }
            return s
          }),
          loading: false,
        }

        case CHANGE_SECTION_FAIL:
          return {
            ...state,
            error: action.payload,
          }

        case ADD_SECTION:
          return {
            ...state,
            loading : true
          }

          case ADD_SECTION_SUCCESS:
            return {
              ...state,
              sections: [...state.sections, action.payload],
              loading: false,
            }

          case ADD_SECTION_FAIL:
            return {
              ...state,
              error: action.payload,
            }

    case UPDATE_SECTION:
      return {
        ...state,
        loading : true
      }

      case UPDATE_SECTION_SUCCESS:
        return {
          ...state,
          sections: state.sections.map(s => {
            if(s._id === action.payload._id){
              s.title = action.payload.newTitle
              return s
            }
            return s
          }),
          loading: false,
        }

        case UPDATE_SECTION_FAIL:
          return {
            ...state,
            error: action.payload,
          }

          case DELETE_SECTION:
            return {
              ...state,
              loading : true
            }

            case DELETE_SECTION_SUCCESS:
              return {
                ...state,
                sections: state.sections.filter(
                  s => s._id.toString() !== action.payload._id.toString()
                ),
                loading: false,
              }

              case DELETE_SECTION_FAIL:
                return {
                  ...state,
                  error: action.payload,
                }
    case ASSIGN_TASK:
      return {
        ...state,
        loading : true
      }
    case ASSIGN_TASK_SUCCESS:
      return {
        ...state,
        sections: state.sections.map(s => {
          if (s._id === action.payload.currentSection) {
            return {
              ...s,
              tasks: s.tasks.map(t => t._id.toString() === action.payload._id.toString() ? action.payload : t),
            }
          }
          return s
        }),
        loading: false,
      }
    case ASSIGN_TASK_FAIL:
      return {
        ...state,
        error: action.payload,
      }

    default:
      return state
  }
}

export default Tasks
