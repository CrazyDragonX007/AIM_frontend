import React , {useEffect} from "react"

import { connect } from "react-redux";



//Import Action to copy breadcrumb items from local state to redux state
import { setBreadcrumbItems } from "../../store/actions";

const Dashboard = (props) => {

  document.title = "Dashboard | AIM - All in One Manager";


  const breadcrumbItems = [
    { title: "AIM", link: "#" },
    { title: "Dashboard", link: "/" }
  ]

  useEffect(() => {
    props.setBreadcrumbItems('Dashboard' , breadcrumbItems)
  },)

 

  return (
    <React.Fragment>
      <div className="center">
    <h1>Welcome to AIM</h1>
      <h3>Create a project to get started.</h3>
      </div>
    </React.Fragment>
  )
}

export default connect(null, { setBreadcrumbItems })(Dashboard);