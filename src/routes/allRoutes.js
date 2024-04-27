import React from "react"
import { Navigate } from "react-router-dom"

// Profile
import UserProfile from "../pages/Authentication/user-profile"


// Authentication related pages
import Login from "../pages/Authentication/Login"
import Logout from "../pages/Authentication/Logout"
import Register from "../pages/Authentication/Register"
import ForgetPwd from "../pages/Authentication/ForgetPassword"

// Dashboard
import Dashboard from "../pages/Dashboard/index"


//Extra Pages
import PagesBlank from "../pages/Extra Pages/pages-blank";
import Pages404 from "../pages/Extra Pages/pages-404";
import Pages500 from "../pages/Extra Pages/pages-500";
import Board from "../pages/Project/Board"

// Project
import Details from "../pages/Project/Details";
import Calendar from "../pages/Calendar"
import AdminSettings from "../pages/Admin/adminSettings"
import Invite from "../pages/Admin/invite"

const userRoutes = [
  { path: "/dashboard", component: <Dashboard /> },
  { path: "/profile", component: <UserProfile /> },
  { path: "/pages-blank", component: <PagesBlank /> },
  {path:"/project-details",component:<Details/>},
  {path:"/project-board",component:<Board/>},
  {path:"/calendar",component:<Calendar/>},
  {path:'/admin-settings',component:<AdminSettings/>},

  // this route should be at the end of all other routes
  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },
]

const authRoutes = [
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPwd /> },
  { path: "/register", component: <Register /> },
  {path:'/invite/*',component:<Invite/>},
  { path: "/pages-404", component: <Pages404 /> },
  { path: "/pages-500", component: <Pages500 /> },
]

export { userRoutes, authRoutes }