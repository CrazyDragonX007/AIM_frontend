import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardText,
  CardTitle,
  Col,
  Form,
  FormFeedback,
  Input,
  Label, Modal,
  Row
} from "reactstrap"
import { getAllUsers } from "../../store/admin/actions"
import { useDispatch, useSelector } from "react-redux"
import { editEmployees, editManagers, updateProject } from "../../store/projects/actions"
import { useFormik } from "formik"
import * as Yup from "yup"

const Details = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const project = useSelector(state => state.Projects?.currentProject)

  useEffect(() => {
    dispatch(getAllUsers(project?.teamId))
  }, [dispatch,project])

  const currentUser = useSelector(state => state.Login?.user)

  const users = useSelector(state => state.Admin?.users)
  const [projectManagers,setProjectManagers] = useState(project?.assignedManagers)
  const [projectEmployees,setProjectEmployees] = useState(project?.assignedEmployees)
  const managersInTeam = users.filter(user => user.role === "Manager")
  const employeesInTeam = users.filter(user => user.role === "Employee")
  const currentUserRole = currentUser.role
  const [editProjectModalFlag, setEditProjectModalFlag] = useState(false)

  useEffect(() => {
    setProjectManagers(project?.assignedManagers)
    setProjectEmployees(project?.assignedEmployees)
  },[project])

  const validation = useFormik({
    // enableReinitialize : use this  flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      title: project?.title,
      description: project?.description,
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Please Enter Project Title"),
    }),
    onSubmit: (values) => {
      dispatch(updateProject({...values,id:project._id}))
      setEditProjectModalFlag(false);
    }
  });

  const showBoard = () => {
    navigate("/project-board", { state: { projectId:project._id } })
  }

  const showEditProject = () => {
    setEditProjectModalFlag(!editProjectModalFlag)
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

  const editProjectModal = (
    <Modal
      size="lg"
      isOpen={editProjectModalFlag}
      toggle={() => {
        showEditProject()
      }}
    >
      <div className="modal-header">
        <h5
          className="modal-title mt-0"
          id="myLargeModalLabel"
        >
          Edit Project
        </h5>
        <button
          onClick={() => {
            setEditProjectModalFlag(false)
          }}
          type="button"
          className="close"
          data-dismiss="modal"
          aria-label="Close"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
        <Form onSubmit={(e) => {
          e.preventDefault();
          validation.handleSubmit();
          return false;
        }}>
          <div className="form-group">
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              name="title"
              className="form-control"
              placeholder="Enter project title"
              type="text"
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.title || ""}
              invalid={
                !!(validation.touched.title && validation.errors.title)
              }
            />
            {validation.touched.title && validation.errors.title ? (
              <FormFeedback type="invalid">{validation.errors.title}</FormFeedback>
            ) : null}
          </div>
          <div className="form-group mt-4">
            <Label htmlFor="description">Project Description</Label>
            <Input
              id="description"
              name="description"
              className="form-control"
              placeholder="Enter project description"
              type="textarea"
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.description || ""}
              invalid={
                !!(validation.touched.description && validation.errors.description)
              }
            />
            {validation.touched.description && validation.errors.description ? (
              <FormFeedback type="invalid">{validation.errors.description}</FormFeedback>
            ) : null}
          </div>
          <div className="mt-4">
            <button type="submit" className="btn btn-primary w-md">Submit</button>
          </div>
        </Form>
      </div>
    </Modal>
  )

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
        <Button className="align-content-right" style={{ marginLeft: 10 }} onClick={() => navigate("/calendar", { state: { projectId: project._id } })}>Shifts Calendar</Button>
      </div>
      <Row>
        <Col>
          <Card>
            <div style={{display:"flex",justifyContent: "flex-end", marginBottom: 10 }}>
            <CardHeader className="card-header h4 font-16 mt-0" style={{flex:1}}>{project?.title}</CardHeader>
            {currentUserRole === "Admin" && <div>
              <Button className="align-content-right" onClick={showEditProject}>Edit project details</Button>
              {editProjectModal}
            </div>}
            </div>
            <CardBody>
              <CardTitle className="h4 mb-4">Created by: {project?.createdBy}</CardTitle>
              <CardTitle className="h4">Description: </CardTitle>
              <CardText>{project?.description || "No description available"}</CardText>
              <br />
              {currentUserRole === "Admin" && managerSection}
              <br />
              {(currentUserRole === "Admin") &&
                <Button onClick={submitManagerChanges} className="btn btn-primary">Submit Manager Changes</Button>}
              <br /><br />
              {(currentUserRole === "Admin" || currentUserRole === "Manager") && employeeSection}
              <br />
              {(currentUserRole === "Admin" || currentUserRole === "Manager") &&
                <Button onClick={submitEmployeeChanges} className="btn btn-primary">Submit Employee Changes</Button>}
              <br /><br />
              <CardText>
                <small className="text-muted">Created on: {new Date(project?.createdOn).toDateString()}</small>
              </CardText>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default Details;