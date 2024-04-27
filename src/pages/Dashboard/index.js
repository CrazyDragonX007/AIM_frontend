import React, { useEffect, useState } from "react"

import { connect, useDispatch, useSelector } from "react-redux"

//Import Action to copy breadcrumb items from local state to redux state
import { setBreadcrumbItems } from "../../store/actions"
import { addProject, deleteProject, setCurrentProject } from "../../store/projects/actions"
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardText,
  CardTitle,
  Col,
  Form, FormFeedback,
  Input,
  Label,
  Modal,
  Row,
  Spinner
} from "reactstrap"
import {  useNavigate } from "react-router-dom"
import { useFormik } from "formik"
import * as Yup from "yup"
import { getAllUsers } from "../../store/admin/actions"

const Dashboard = (props) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  document.title = "Dashboard | AIM - All in One Manager"

  const breadcrumbItems = [
    { title: "AIM", link: "#" },
    { title: "Dashboard", link: "/" }
  ]

  const user = useSelector(state=>state.Login?.user)

  useEffect(() => {
    dispatch(getAllUsers(user.teamId));
    props.setBreadcrumbItems("Dashboard", breadcrumbItems)
  })

  const projects = useSelector(state => state.Projects?.projects)
  const [createModal, setCreateModal] = useState(false);
  const loading = useSelector(state => state.Projects?.loading)

  const showProjectModal = () => {
    setCreateModal(!createModal)
  }

  const validation = useFormik({
    // enableReinitialize : use this  flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      title: '',
      description: '',
      createdBy: user.name,
      teamId: user.teamId
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Please Enter Project Title"),
    }),
    onSubmit: (project) => {
      dispatch(addProject(project));
      setCreateModal(false);
    }
  });

  const newProjectModal = (
    <Modal
      size="lg"
      isOpen={createModal}
      toggle={() => {
        showProjectModal()
      }}
    >
      <div className="modal-header">
        <h5
          className="modal-title mt-0"
          id="myLargeModalLabel"
        >
          Create New Project
        </h5>
        <button
          onClick={() => {
            setCreateModal(false)
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

  if (loading) {
    return <Spinner color="primary" />
  }

  if (projects && projects.length === 0) {
    return (
      <React.Fragment>
        <div className="mt-5 text-center">
          <h1>Welcome to AIM</h1>
          <h3>Create a project to get started.</h3>
          <Button size="lg block" onClick={() => showProjectModal()}>+</Button>
          {newProjectModal}
        </div>
      </React.Fragment>
    )
  }

  const removeProject = (projectId) => {
    dispatch(deleteProject(projectId))
  }

  const setProject = (projectId) => {
    const project = projects?.filter(project => project._id === projectId)[0]
    dispatch(setCurrentProject(project))
  }

  const showDetails = (projectId) => {
    setProject(projectId)
    navigate('/project-details')
  }

  const showBoard = (projectId) => {
    setProject(projectId)
    navigate("/project-board", { state: { projectId: projectId } })
  }

  const showCalendar = (projectId) => {
    setProject(projectId)
    navigate("/calendar", { state: { projectId: projectId } })
  }

  return (
      <React.Fragment>
        {user.role === "Admin" &&
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 0 }}>
            <Button size="lg block" onClick={() => showProjectModal()}>+</Button>
            {newProjectModal}
          </div>
        }
        <Row>
          {projects?.map(project => {
              if(user.role === "Admin" || project.assignedEmployees.includes(user._id) || project.assignedManagers.includes(user._id)) {
                return (
                  <Col key={project._id} mg={6} lg={6} xl={3}>
                    <Card>
                      <CardHeader className="card-header h4 font-16 mt-0" style={{ display: 'flex' }}>
                        <div style={{ flex: 1 }}>
                          {project.title}
                        </div>
                        {user.role === "Admin" && <div style={{ justifyContent: 'flex-end', margin: 0, padding: 0 }}>
                          <Button onClick={() => removeProject(project._id)} className="bg-danger">Delete</Button>
                        </div>}
                      </CardHeader>
                      <CardBody>
                        <CardTitle className="h4">Created by: {project.createdBy}</CardTitle>
                        <CardText>{project.description || "No description available"}</CardText>
                        <Button onClick={() => showDetails(project._id)} className="btn btn-primary">View
                          Details</Button>
                        <Button style={{ marginLeft: 10 }} onClick={() => showBoard(project._id)}>View Board</Button>
                        <Button style={{ marginLeft: 10 }} onClick={() => showCalendar(project._id)}>Shifts
                          Calendar</Button>
                      </CardBody>
                    </Card>
                  </Col>)
              }else return null
          })}
        </Row>
      </React.Fragment>
    )
}

export default connect(null, { setBreadcrumbItems })(Dashboard);