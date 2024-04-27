import React, { useEffect, useState } from "react"
import {
  Card,
  CardBody,
  Col,
  Row,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
  Modal,
  ModalBody,
  ModalHeader,
  Form,
  Label,
  Input,
  FormFeedback, Button
} from "reactstrap"
import { useFormik } from "formik"
import * as Yup from "yup"

import {
  getTasks as onGetTasks,
  addTask as onAddTask,
  updateTask as onUpdateTaskData,
  deleteTask as OnDeleteTask, changeSection, addSection, assignTask, updateSection, deleteSection
} from "store/tasks/actions"

import { useSelector, useDispatch } from "react-redux"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { Link } from "react-router-dom"
import Spinners from "components/Common/Spinner"

import { setBreadcrumbItems } from "../../store/actions";
import { connect } from "react-redux"
import { getAllUsers } from "../../store/admin/actions"
import Select from "react-select"
import { toast, ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';

const Kanban = (props) => {
  document.title = "Project Board | AIM  - All in One Manager"

  const breadcrumbItems = [
    { title: "AIM", link: "/dashboard" },
    { title: "Project Board", link: "#" },
  ]

  useEffect(() => {
    props.setBreadcrumbItems('Project Board', breadcrumbItems)
  })

  const dispatch = useDispatch()
  const project = useSelector(state => state.Projects?.currentProject)
  const  user = useSelector(state => state.Login?.user)
  const users = useSelector(state => state.Admin?.users)

  useEffect(() => {
    if(users.length===0){
      dispatch(getAllUsers(user.teamId))
    }
  }, [dispatch,user,users])

  const [modal, setModal] = useState(false)
  const toggle = () => {
    if (modal) {
      setModal(false)
      setTask(null)
    } else {
      setModal(true)
    }
  }

  const kanbanTasks = useSelector(state=>state.Tasks?.sections)
  const loading = useSelector(state=>state.Tasks?.loading)
  const [isLoading, setLoading] = useState(loading)

  useEffect(() => {
    dispatch(onGetTasks(project._id))
  }, [dispatch,project])

  const [sections, setSections] = useState()
  const [currentSection, setCurrentSection] = useState()

  useEffect(() => {
    setSections(kanbanTasks)
  }, [kanbanTasks])

  const onClickDelete = task => {
    if (task && task._id) {
      dispatch(OnDeleteTask(task._id))
    }
  }

  const [isEdit, setIsEdit] = useState(false)
  const [task, setTask] = useState(null)

  const [sectionModal, setSectionModal] = useState(false)
  const [editSectionModalFlag,setEditSectionModalFlag] = useState(false)

  const options = users.map(user => {
    return {
      value: user.name,
      label: user.name
    }
  })

  const [selectedUser,setSelectedUser] = useState('')
  const [editSectionId,setEditSectionId] = useState('');

  const handleDeleteSection = (id) => {
    if(sections.find(section=>section._id===id).tasks.length>0){
      toast("Kindly reassign tasks in this section before deleting",{type:"error"})
      return
    }
    dispatch(deleteSection(id))
  }

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      title: (task && task.title) || "",
      description: (task && task.description) || "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Please Enter Your Task Title"),
      description: Yup.string().required("Please Enter Your Task Description"),
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updatedCards = {
          _id: task._id,
          title: values.title,
          description: values.description,
        }
        dispatch(onUpdateTaskData(updatedCards))
        if(selectedUser.value!==task.assignedTo){
          dispatch(assignTask({id:task._id,newAssign:selectedUser.value}))
        }
        validation.resetForm()
      } else {
        const newCardData = {
          projectId: project._id,
          createdBy: user.name,
          currentSection: currentSection,
          title: values["title"],
          description: values["description"],
          assignedTo: selectedUser.value
        }
        console.log(newCardData)
        dispatch(onAddTask(newCardData))
        validation.resetForm()
      }
      toggle()
    },
  })

  const sectionValidation = useFormik({
    enableReinitialize: true,
    initialValues: {
      sectionTitle: '',
      projectId: project._id
    },
    validationSchema: Yup.object({
      sectionTitle: Yup.string().required("Enter Section Title"),
    }),
    onSubmit: (values) => {
      dispatch(addSection(values))
      sectionValidation.resetForm()
      handleSectionModal()
    }
  })

  const editSectionValidation = useFormik({
    enableReinitialize: true,
    initialValues: {
      sectionTitle: '',
    },
    validationSchema: Yup.object({
      sectionTitle: Yup.string().required("Enter New Section Title"),
    }),
    onSubmit: (values) => {
      dispatch(updateSection({title:values.sectionTitle,id:editSectionId}))
      editSectionValidation.resetForm()
      handleEditSectionModal()
    }
  })

  const handleTaskEdit = (arg, line) => {
    setModal(true)
    setTask(arg)
    setCurrentSection(line._id)
    setIsEdit(true)
    setSelectedUser({value:arg.assignedTo,label:arg.assignedTo})
    toggle()
  }

  const handleAddNewTask = line => {
    console.log(line)
    setTask("")
    setIsEdit(false)
    toggle()
    setCurrentSection(line._id)
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return // If dropped outside a valid drop area, do nothing

    const { source, destination } = result
    // Reorder cards within the same card line
    if (source.droppableId === destination.droppableId) {
      const line = sections.find(line => line._id === source.droppableId)
      const reorderedCards = Array.from(line.tasks)
      const [movedCard] = reorderedCards.splice(source.index, 1)
      reorderedCards.splice(destination.index, 0, movedCard)

      const updatedLines = sections.map(line => {
        if (line._id === source.droppableId) {
          return { ...line, tasks: reorderedCards }
        }
        return line
      })
      setSections(updatedLines)
    } else {
      // Move card between different card lines
      const sourceLine = sections.find(line => line._id === source.droppableId)
      const destinationLine = sections.find(
        line => line._id === destination.droppableId
      )
      const sourceTasks = Array.from(sourceLine.tasks)
      const destinationTasks = Array.from(destinationLine.tasks)
      const [movedCard] = sourceTasks.splice(source.index, 1)
      destinationTasks.splice(destination.index, 0, movedCard)
      const updatedLines = sections.map(line => {
        if (line._id === source.droppableId) {
          return { ...line, tasks: sourceTasks }
        } else if (line._id === destination.droppableId) {
          return { ...line, tasks: destinationTasks }
        }
        return line
      })
      dispatch(changeSection({id:movedCard._id,newSection:destinationLine._id,changedBy:user.name}))
      setSections(updatedLines)
    }
  }

  const handleSectionModal = () => setSectionModal(!sectionModal)

  const newSectionModal = (
    <Modal
      size="lg"
      isOpen={sectionModal}
      toggle={() => {
        handleSectionModal()
      }}
    >
      <div className="modal-header">
        <h5
          className="modal-title mt-0"
          id="myLargeModalLabel"
        >
          Create New Section
        </h5>
        <button
          onClick={() => {
            setSectionModal(false)
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
          sectionValidation.handleSubmit();
          return false;
        }}>
          <div className="form-group">
            <Label htmlFor="sectionTitle">Section Title</Label>
            <Input
              id="sectionTitle"
              name="sectionTitle"
              className="form-control"
              placeholder="Enter section title"
              type="text"
              onChange={sectionValidation.handleChange}
              onBlur={sectionValidation.handleBlur}
              value={sectionValidation.values.sectionTitle || ""}
              invalid={
                !!(sectionValidation.touched.sectionTitle && sectionValidation.errors.sectionTitle)
              }
            />
            {sectionValidation.touched.sectionTitle && sectionValidation.errors.sectionTitle ? (
              <FormFeedback type="invalid">{sectionValidation.errors.sectionTitle}</FormFeedback>
            ) : null}
          </div>
          <div className="mt-4">
            <button type="submit" className="btn btn-primary w-md">Submit</button>
          </div>
        </Form>
      </div>
    </Modal>
  )

  const handleEditSectionModal = (sectionId) => {
    if(sectionId) setEditSectionId(sectionId)
    setEditSectionModalFlag(!editSectionModalFlag)
  }

  const editSectionModal = (
    <Modal
      size="lg"
      isOpen={editSectionModalFlag}
      toggle={() => {
        handleEditSectionModal()
      }}
    >
      <div className="modal-header">
        <h5
          className="modal-title mt-0"
          id="myLargeModalLabel"
        >
          Edit Section
        </h5>
        <button
          onClick={() => {
            setEditSectionModalFlag(false)
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
          editSectionValidation.handleSubmit();
          return false;
        }}>
          <div className="form-group">
            <Label htmlFor="sectionTitle">Section Title</Label>
            <Input
              id="sectionTitle"
              name="sectionTitle"
              className="form-control"
              placeholder="Enter new section title"
              type="text"
              onChange={editSectionValidation.handleChange}
              onBlur={editSectionValidation.handleBlur}
              value={editSectionValidation.values.sectionTitle || ""}
              invalid={
                !!(editSectionValidation.touched.sectionTitle && editSectionValidation.errors.sectionTitle)
              }
            />
            {editSectionValidation.touched.sectionTitle && editSectionValidation.errors.sectionTitle ? (
              <FormFeedback type="invalid">{editSectionValidation.errors.sectionTitle}</FormFeedback>
            ) : null}
          </div>
          <div className="mt-4">
            <button type="submit" className="btn btn-primary w-md">Submit</button>
          </div>
        </Form>
      </div>
    </Modal>
  )

  return (
    <React.Fragment>
      <ToastContainer />
      <div style={{display: 'flex', justifyContent: 'flex-end',marginBottom:10}}>
      <Button onClick={handleSectionModal}>Add new Section</Button>
        {newSectionModal}
      </div>
      {
        isLoading ? <Spinners setLoading={setLoading} /> :
          <div style={{overflowX:'auto'}}>
          <Row>
            <DragDropContext onDragEnd={handleDragEnd}>
              <div style={{display:'flex',flexDirection:'row',gap:20}}>
              {(sections || []).map(section => {
                return (
                  <Col lg={3} className="order-lg-first" key={section._id}>
                    <Card>
                      <CardBody>
                        <UncontrolledDropdown className="float-end">
                          <DropdownToggle
                            className="arrow-none"
                            tag="a"
                            color="white"
                          >
                            <i className="mdi mdi-dots-vertical m-0 text-muted h5"></i>
                          </DropdownToggle>
                          <DropdownMenu className="dropdown-menu-end">
                            <DropdownItem onClick={()=>handleEditSectionModal(section._id)}>Edit</DropdownItem>
                            {editSectionModal}
                            <DropdownItem onClick={()=>handleDeleteSection(section._id)}>Delete</DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                        <h4 className="card-title mb-4">{section.title}</h4>
                        <Droppable droppableId={section._id}>
                          {provided => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                            >
                              {(section.tasks.length>0 ? section.tasks : [{_id:(Math.random()*1000).toString(),title:"This section is Empty"}]).map((task, index) => {
                                return (
                                  <Draggable
                                    key={task?._id}
                                    draggableId={task?._id}
                                    index={index}
                                  >
                                    {provided => {
                                      return (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          // className="task task-list"
                                          className="pb-1 task-list"
                                          // style={{display:showTask?'':'none'}}
                                          id={section.title + "-task"}
                                        >
                                          <div className="card task-box" id="uptask-1">
                                            <CardBody>
                                              <UncontrolledDropdown className="float-end">
                                                <DropdownToggle
                                                  className="arrow-none"
                                                  tag="a"
                                                  color="white"
                                                >
                                                  <i className="mdi mdi-dots-vertical m-0 text-muted h5"></i>
                                                </DropdownToggle>
                                                <DropdownMenu className="dropdown-menu-end">
                                                  <DropdownItem
                                                    className="edittask-details"
                                                    onClick={() =>
                                                      handleTaskEdit(task, section)
                                                    }
                                                  >
                                                    Edit
                                                  </DropdownItem>
                                                  <DropdownItem
                                                    className="deletetask"
                                                    onClick={() =>
                                                      onClickDelete(task)
                                                    }
                                                  >
                                                    Delete
                                                  </DropdownItem>
                                                </DropdownMenu>
                                              </UncontrolledDropdown>
                                              <div>
                                                <h5 className="font-size-20">
                                                  <Link
                                                    to="#"
                                                    id="task-name"
                                                  >
                                                    {task?.title}
                                                  </Link>
                                                </h5>
                                              </div>
                                              Description: {task?.description}
                                              <br/><br/>
                                              <h6>
                                              Assigned To: {task?.assignedTo}
                                              </h6>
                                            </CardBody>
                                          </div>
                                        </div>
                                      )
                                    }}
                                  </Draggable>
                                )
                              })}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </CardBody>
                    </Card>
                    <div className="text-center d-grid">
                      <Link
                        to="#"
                        className="btn btn-primary waves-effect waves-light addtask-btn"
                        data-bs-toggle="modal"
                        data-bs-target=".bs-example-modal-lg"
                        data-id="#upcoming-task"
                        onClick={() => handleAddNewTask(section)}
                      >
                        <i className="mdi mdi-plus me-1"></i> Add New
                      </Link>
                    </div>
                  </Col>
                )
              })}
              </div>
            </DragDropContext>
              </Row>
          </div>
              }
                <Modal id="modalForm" isOpen={modal} toggle={toggle} centered={true} size="lg">
              <ModalHeader toggle={toggle}>
                {!!isEdit ? "Update Task" : "Add New Task"}
              </ModalHeader>
              <ModalBody>
                <Form
                  onSubmit={e => {
                    e.preventDefault()
                    validation.handleSubmit()
                    return false
                  }}
                >
                  <div className="form-group mb-3">
              <Label htmlFor="taskname" className="col-form-label">
                Task Name<span className="text-danger">*</span>
              </Label>
              <Col lg={12}>
                <Input
                  id="taskname"
                  name="title"
                  type="text"
                  className="form-control validate"
                  placeholder="Enter Task Title..."
                  validate={{ required: { value: true } }}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.title || ""}
                  invalid={
                    !!(validation.touched.title && validation.errors.title)
                  }
                />
                {validation.touched.title && validation.errors.title ? (
                  <FormFeedback type="invalid">
                    {validation.errors.title}
                  </FormFeedback>
                ) : null}
              </Col>
            </div>
            <div className="form-group mb-3">
              <label className="col-form-label">Task Description</label>
              <Col lg={12}>
                <textarea
                  id="taskdesc"
                  className="form-control"
                  placeholder="Enter Task Description"
                  name="description"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.description || ""}
                ></textarea>
                {validation.touched.description &&
                validation.errors.description ? (
                  <FormFeedback type="invalid" className="d-block">
                    {validation.errors.description}
                  </FormFeedback>
                ) : null}
              </Col>
            </div>

            <div className="form-group mb-3">
              <label className="col-form-label">
                Assign Team Member<span className="text-danger">*</span>
              </label>
              <Select options={options} value={selectedUser} onChange={(e)=>setSelectedUser(e)}/>
            </div>
            <Row>
              <Col lg={10}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  id="updatetaskdetail"
                >
                  {!!isEdit ? "Update Task" : "Create Task"}
                </button>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>

    </React.Fragment>
  )
}

export default connect(null, { setBreadcrumbItems })(Kanban)

