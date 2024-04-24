import { all, fork } from "redux-saga/effects"

//public
import AccountSaga from "./auth/register/saga"
import AuthSaga from "./auth/login/saga"
import ForgetSaga from "./auth/forgetpwd/saga"
import ProfileSaga from "./auth/profile/saga"
import LayoutSaga from "./layout/saga"
import ProjectSaga from "./projects/sagas"
import TasksSaga from "./tasks/sagas"
import calendarSaga from "./calendar/sagas"
import adminSaga from "./admin/sagas"

export default function* rootSaga() {
  yield all([
    //public
    AccountSaga(),
    fork(AuthSaga),
    ProfileSaga(),
    ForgetSaga(),
    LayoutSaga(),
    fork(calendarSaga),
    adminSaga(),
    // Private
    ProjectSaga(),
    TasksSaga()
  ])
}
