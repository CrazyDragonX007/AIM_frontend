import { combineReducers } from "redux"

// Front
import Layout from "./layout/reducer"

import Breadcrumb from "./Breadcrumb/reducer";  

// Authentication
import Login from "./auth/login/reducer"
import Account from "./auth/register/reducer"
import ForgetPassword from "./auth/forgetpwd/reducer"
import Profile from "./auth/profile/reducer"

// ...
import Projects from "./projects/reducer"
import Tasks from "./tasks/reducer"
import calendar from "./calendar/reducer"
import Admin from "./admin/reducer"
import Chat from "./chat/reducer"

const rootReducer = combineReducers({
  // public
  Layout,
   //Breadcrumb items
   Breadcrumb,
  // Projects
  Projects,
  Tasks,
  calendar,
  Chat,
  // Authentication
  Admin,
  Login,
  Account,
  ForgetPassword,
  Profile
})

export default rootReducer
