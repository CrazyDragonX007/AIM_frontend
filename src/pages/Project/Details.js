import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Button, Card, CardBody, CardHeader, CardText, CardTitle, Col, Row } from "reactstrap"
import { getAllUsers } from "../../store/admin/actions"
import { useDispatch, useSelector } from "react-redux"
import { editEmployees, editManagers } from "../../store/projects/actions"

const Details = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const project = location.state?.project
  console.log(project)

  useEffect(() => {
    dispatch(getAllUsers(project.teamId))
  }, [dispatch,project])

  const users = useSelector(state => state.Admin?.users)
  const [projectManagers,setProjectManagers] = useState(project.assignedManagers)
  const [projectEmployees,setProjectEmployees] = useState(project.assignedEmployees)
  const managersInTeam = users.filter(user => user.role === "Manager")
  const employeesInTeam = users.filter(user => user.role === "Employee")
  const currentUserRole = JSON.parse(localStorage.getItem('user')).role
  console.log(users)
  console.log(projectManagers,projectEmployees)
  console.log(managersInTeam,employeesInTeam)

  const showBoard = () => {
    navigate("/project-board", { state: { projectId:project._id } })
  }

  const removeManagerFromProject = (manager) => {
    setProjectManagers(projectManagers.filter(m => m !== manager))
  }

  const addManagerToProject = (manager) => {
    setProjectManagers([...projectManagers, manager])
  }

  const addEmployeeToProject = (employee) => {
    console.log(employee);
    setProjectEmployees([...projectEmployees, employee])
  }

  const removeEmployeeFromProject = (employee) => {
    setProjectEmployees(projectEmployees.filter(e => e !== employee))
  }

  const submitManagerChanges = () => {
    dispatch(editManagers(project._id,projectManagers))
  }

  const submitEmployeeChanges = () => {
    dispatch(editEmployees(project._id,projectEmployees))
  }

  const managerSection = (
    <React.Fragment >
      <h3 style={{marginBottom:30}}>Manager Section</h3>
      <h5>Managers Assigned to Project</h5>
      {projectManagers?.length === 0 ? <p>No managers assigned to project</p> :
        <div className="table-responsive">
          <table className="table table-centered table-nowrap table-hover mb-0">
            <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Action</th>
            </tr>
            </thead>
            <tbody>
            {projectManagers?.map((manager, index) => (
              <tr key={index}>
                <td>
                  {managersInTeam.find(user => user._id === manager)?.name}
                </td>
                <td>
                  <Button onClick={() => removeManagerFromProject(manager)}>Remove</Button>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      }
      <br /><br/>
      <h5>Remaining Managers in Team</h5>
      {managersInTeam?.length === 0 ? <p>Currently, there are no managers added to this team</p> :
        <div className="table-responsive">
          <table className="table table-centered table-nowrap table-hover mb-0">
            <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Action</th>
            </tr>
            </thead>
            <tbody>
            {managersInTeam.map((manager, index) => {
              if (projectManagers?.includes(manager._id)) return null
              return (
              <tr key={index}>
                <td>
                  {manager.name}
                </td>
                <td>
                  <Button onClick={() => addManagerToProject(manager._id)}>Add</Button>
                </td>
              </tr>
            )})}
            </tbody>
          </table>
        </div>
      }
    </React.Fragment>
  )

  const employeeSection = (
    <React.Fragment>
      <h3 style={{marginBottom:30}}>Employee Section</h3>
      <h5>Employees Assigned to Project</h5>
      {projectEmployees?.length === 0 ? <p>No employees assigned to project</p> :
        <div className="table-responsive">
          <table className="table table-centered table-nowrap table-hover mb-0">
            <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Action</th>
            </tr>
            </thead>
            <tbody>
            {projectEmployees?.map((employee, index) => (
              <tr key={index}>
                <td>
                  {employeesInTeam.find(user => user._id === employee)?.name}
                </td>
                <td>
                  <Button onClick={()=>removeEmployeeFromProject(employee)}>Remove</Button>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      }
      <br/><br/>
      <h5>Remaining Employees in Team</h5>
      {employeesInTeam.length === 0 ? <p>Currently, there are no employees added to this team</p> :
      <div className="table-responsive">
          <table className="table table-centered table-nowrap table-hover mb-0">
            <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Action</th>
            </tr>
            </thead>
            <tbody>
            {employeesInTeam?.map((employee, index) => {
              if (projectEmployees?.includes(employee._id)) return null
              return (
              <tr key={index}>
                <td>
                  {employee.name}
                </td>
                <td>
                  <Button onClick={()=>addEmployeeToProject(employee._id)}>Add</Button>
                </td>
              </tr>
            )})}
            </tbody>
          </table>
        </div>
      }
    </React.Fragment>
  )

  return (
    <React.Fragment>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
        <Button className="align-content-right" onClick={showBoard}>View Board</Button>
      </div>
      <Row>
        <Col>
          <Card>
            <CardHeader className="card-header h4 font-16 mt-0">{project.title}</CardHeader>
            <CardBody>
              <CardTitle className="h4">Created by: {project.createdBy}</CardTitle>
              <CardTitle className="h4">Description: </CardTitle>
              <CardText>{project.description || "No description available"}</CardText>
              <br/>
              {currentUserRole === "Admin" && managerSection}
              <br/>
              {(currentUserRole === "Admin") && <Button onClick={submitManagerChanges} className="btn btn-primary">Submit Manager Changes</Button>}
              <br/><br/>
              {(currentUserRole === "Admin" || currentUserRole === "Manager") && employeeSection}
              <br/>
              {(currentUserRole === "Admin" || currentUserRole === "Manager") && <Button onClick={submitEmployeeChanges} className="btn btn-primary">Submit Employee Changes</Button>}
              <br/><br/>
              <CardText>
                <small className="text-muted">Created on: {new Date(project.createdOn).toDateString()}</small>
              </CardText>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default Details;