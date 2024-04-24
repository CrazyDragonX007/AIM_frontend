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
  addTask as onAddCardData,
  updateTask as onUpdateCardData,
  deleteTask as OnDeleteKanban, changeSection, addSection
} from "store/tasks/actions"

//redux
import { useSelector, useDispatch } from "react-redux"
import { createSelector } from "reselect"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { Link, useLocation } from "react-router-dom"
// import { AddTeamMember } from "common/data"
import SimpleBar from "simplebar-react"
import Spinners from "components/Common/Spinner"

//Import Action to copy breadcrumb items from local state to redux state
import { setBreadcrumbItems } from "../../store/actions";
import { connect } from "react-redux"

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
  const location = useLocation()
  // eslint-disable-next-line
  const [projectId,setProjectId] = useState(location.state?.projectId);

  const [images, setImages] = useState([])

  const [modal, setModal] = useState(false)
  const toggle = () => {
    if (modal) {
      setModal(false)
      setImages([])
      setTask(null)
    } else {
      setModal(true)
    }
  }

  const selectTasksState = state => state.Tasks
  const TasksKanbanProperties = createSelector(selectTasksState, Tasks => ({
    kanbanTasks: Tasks?.sections,
    loading: Tasks?.loading
  }))

  const { kanbanTasks, loading } = useSelector(TasksKanbanProperties)
  const [isLoading, setLoading] = useState(loading)

  useEffect(() => {
    dispatch(onGetTasks(projectId))
  }, [dispatch,projectId])

  const [sections, setSections] = useState()
  const [currentSection, setCurrentSection] = useState()

  useEffect(() => {
    setSections(kanbanTasks)
  }, [kanbanTasks])

  console.log(sections)

  const onClickDelete = card => {
    if (card && card.id) {
      dispatch(OnDeleteKanban(card.id))
    }
  }

  const [isEdit, setIsEdit] = useState(false)
  const [task, setTask] = useState(null)

  const [sectionModal, setSectionModal] = useState(false)

  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      _id: (task && task.cardId) || "",
      title: (task && task.title) || "",
      description: (task && task.description) || "",
      budget: (task && task.budget) || "",
      userImages: (task && task.userImages) || [],
      badgeText: (task && task.badgeText) || ""
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Please Enter Your Task Title"),
      description: Yup.string().required("Please Enter Your Task Description"),
      // budget: Yup.string().required("Please Enter Your budget"),
      // badgeText: Yup.string().required("Please Enter Your Status"),
      // userImages: Yup.array().required("Select at least one team member")
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updatedCards = {
          _id: task ? task._id : 0,
          currentSection: currentSection,
          cardId: values.id,
          title: values.title,
          description: values.description,
          budget: values.budget,
          // date: moment(new Date()).format("DD MMMM , YYYY"),
          badgeText: values.badgeText,
          badgeColor: values.badgeColor,
          userImages: values.userImages,
        }
        // update Job
        dispatch(onUpdateCardData(updatedCards))
        validation.resetForm()
      } else {
        const user = JSON.parse(localStorage.getItem('user'))
        const newCardData = {
          projectId: projectId,
          createdBy: user.name,
          currentSection: currentSection,
          cardId: values["id"],
          title: values["title"],
          description: values["description"],
          budget: values["budget"],
          // date: moment(new Date()).format("DD MMMM , YYYY"),
          userImages: values["userImages"],
          badgeText: values["badgeText"],
          badgeColor: values["badgeColor"],
        }
        console.log(newCardData)
        dispatch(onAddCardData(newCardData))
        validation.resetForm()
      }
      toggle()
    },
  })

  const sectionValidation = useFormik({
    enableReinitialize: true,
    initialValues: {
      sectionTitle: '',
      projectId: projectId
    },
    validationSchema: Yup.object({
      sectionTitle: Yup.string().required("Please Enter Section Title"),
    }),
    onSubmit: (values) => {
      console.log(values)
      dispatch(addSection(values))
      sectionValidation.resetForm()
      handleSectionModal()
    }

  })

  const handleCardEdit = (arg, line) => {
    setModal(true)
    setTask(arg)
    let task = arg
    setTask({
      _id: task._id,
      title: task.title,
      description: task.description,
      date: task.date,
      budget: task.budget,
      userImages: task.userImages,
      badgeText: task.badgeText,
      badgeColor: task.badgeColor,
    })

    setCurrentSection(line._id)
    setIsEdit(true)

    toggle()
  }
  const handleImage = (image) => {
    const updatedImages = images.includes(image)
      ? images.filter(item => item !== image)
      : [...images, image];

    setImages(updatedImages);
    validation.setFieldValue('userImages', updatedImages)

  }

  // useEffect(() => {
  //   if (task) {
  //     setImages([...task?.userImages])
  //   }
  // }, [task])

  const handleAddNewCard = line => {
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
      dispatch(changeSection({id:movedCard._id,newSection:destinationLine._id,changedBy:JSON.parse(localStorage.getItem('user')).name}))
      setSections(updatedLines)
    }
  }

  const getBadgeColor = (text) => {
    switch (text) {
      case "Waiting":
        return 'secondary';
      case "Approved":
        return 'primary';
      case "Pending":
        return 'warning';
      default:
        return 'success';
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

  return (
    <React.Fragment>
      <div style={{display: 'flex', justifyContent: 'flex-end',marginBottom:10}}>
      <Button onClick={()=>handleSectionModal()}>Add new Section</Button>
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
                            <DropdownItem>Edit</DropdownItem>
                            <DropdownItem>Delete</DropdownItem>
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
                                const badgeColor = getBadgeColor(task?.badgeText)
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
                                                      handleCardEdit(task, section)
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
                                              <div className="float-end ms-2">
                                                <span
                                                  className={`badge rounded-pill badge-soft-${badgeColor} font-size-12`}
                                                  id="task-status"
                                                >
                                                  {task?.badgeText}
                                                </span>
                                              </div>
                                              <div>
                                                <h5 className="font-size-15">
                                                  <Link
                                                    to="#"
                                                    className="text-dark"
                                                    id="task-name"
                                                  >
                                                    {task?.title}
                                                  </Link>
                                                </h5>
                                                <p className="text-muted">
                                                  {task?.date}
                                                </p>
                                              </div>
                                              {
                                                task?.description
                                                // <ul className="ps-3 mb-4 text-muted" id="task-desc">
                                                //   <li className="py-1">{task.taskdesc}</li>
                                                //   <li className="py-1">{task.taskdesc1}</li>
                                                // </ul>
                                              }
                                              {
                                                task?.brandLogo &&
                                                <ul className="list-inine ps-0 mb-4" id="task-desc">
                                                  {
                                                    task?.brandLogo.map((logo, inx) => (
                                                      <li key={inx} className="list-inline-item">
                                                        <Link to="#">
                                                          {
                                                            logo.imges ?
                                                              <div>
                                                                <img src={logo.imges} className="rounded" height={48}
                                                                     alt="" />
                                                              </div>

                                                              :
                                                              <div className="border rounded avatar-sm">
                                                                <span className="avatar-title bg-transparent">
                                                                  <img src={logo.img} className="avatar-xs" alt="" />
                                                                </span>
                                                              </div>

                                                          }
                                                        </Link>
                                                      </li>
                                                    ))
                                                  }
                                                </ul>
                                              }
                                              <div className="avatar-group float-start task-assigne">
                                                {
                                                  task?.userImages && task?.userImages.map(
                                                    (usrimg, key) => (
                                                      usrimg.img &&
                                                      <div key={key}
                                                           className="avatar-group-item">
                                                        <Link
                                                          to="#"
                                                          className="d-inline-block"
                                                          defaultValue="member-4">
                                                          <img src={usrimg.img} alt=""
                                                               className="rounded-circle avatar-xs" />
                                                        </Link>
                                                      </div>
                                                    )
                                                  )
                                                }
                                                {
                                                  task?.kanbanImgtext && task?.kanbanImgtext.map((imgtext, inx) => (
                                                    <div key={inx}
                                                         className="avatar-group-item">
                                                      <Link to="#" className="d-inline-block" defaultValue="member-4">
                                                        <div className="avatar-xs">
                                                          <span
                                                            className={`avatar-title rounded-circle ${task.kanbanImgtextColor} text-white font-size-16`}>
                                                            {imgtext.imageText}
                                                          </span>
                                                        </div>
                                                      </Link>
                                                    </div>
                                                  ))
                                                }

                                              </div>

                                              <div className="text-end">
                                                {/*<h5*/}
                                                {/*  className="font-size-15 mb-1"*/}
                                                {/*  id="task-budget"*/}
                                                {/*>*/}
                                                {/*  $ {task.budget}*/}
                                                {/*</h5>*/}
                                                {/*<p className="mb-0 text-muted">*/}
                                                {/*  Budget*/}
                                                {/*</p>*/}
                                              </div>
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
                        onClick={() => handleAddNewCard(section)}
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
                    validation.touched.title && validation.errors.title
                      ? true
                      : false
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
                Add Team Member<span className="text-danger">*</span>
              </label>
              <SimpleBar style={{ height: "200px" }}>
                <ul
                  className="list-unstyled user-list validate"
                  id="taskassignee"
                >
                  {([]).map((image, index) => {
                    const isChecked = images.some(item => item.id === image.id);
                    return (
                      <li key={index}>
                        <div className="form-check form-check-primary mb-2 d-flex align-items-center">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={"member" + image.id}
                            name="userImages"
                            onBlur={validation.handleBlur}
                            value={validation.values.userImages || ''}
                            onChange={() => handleImage(image)}
                            checked={isChecked}
                          />
                          <label className="form-check-label ms-2" htmlFor={"member" + image.id}>
                            {image.name}
                          </label>
                          <img
                            src={image.img}
                            className="rounded-circle avatar-xs m-1"
                            alt=""
                          />
                        </div>
                      </li>
                    )
                  })}
                  {validation.touched.userImages &&
                  validation.errors.userImages ? (
                    <FormFeedback type="invalid" className="d-block">
                      {validation.errors.userImages}
                    </FormFeedback>
                  ) : null}
                </ul>
              </SimpleBar>
            </div>

            {/*<div className="form-group mb-4">*/}
            {/*  <label className="col-form-label">*/}
            {/*    Status<span className="text-danger">*</span>*/}
            {/*  </label>*/}
            {/*  <div className="col-lg-12">*/}
            {/*    <select*/}
            {/*      className="form-select validate"*/}
            {/*      id="TaskStatus"*/}
            {/*      name="badgeText"*/}
            {/*      onChange={validation.handleChange}*/}
            {/*      onBlur={validation.handleBlur}*/}
            {/*      value={validation.values.badgeText}*/}
            {/*    >*/}
            {/*      <option defaultValue="">Choose..</option>*/}
            {/*      <option defaultValue="secondary">Waiting</option>*/}
            {/*      <option defaultValue="primary">Approved</option>*/}
            {/*      <option defaultValue="warning">Pending</option>*/}
            {/*      <option defaultValue="success">Complete</option>*/}
            {/*    </select>*/}
            {/*    {validation.touched.badgeText &&*/}
            {/*    validation.errors.badgeText ? (*/}
            {/*      <FormFeedback type="invalid" className="d-block">*/}
            {/*        {validation.errors.badgeText}*/}
            {/*      </FormFeedback>*/}
            {/*    ) : null}*/}
            {/*  </div>*/}
            {/*</div>*/}

            {/*<div className="form-group mb-4">*/}
            {/*  <label htmlFor="taskbudget" className="col-form-label">*/}
            {/*    Budget<span className="text-danger">*</span>*/}
            {/*  </label>*/}
            {/*  <Col lg={12}>*/}
            {/*    <input*/}
            {/*      id="taskbudget"*/}
            {/*      name="budget"*/}
            {/*      type="number"*/}
            {/*      placeholder="Enter Task Budget..."*/}
            {/*      className="form-control"*/}
            {/*      onChange={validation.handleChange}*/}
            {/*      onBlur={validation.handleBlur}*/}
            {/*      value={validation.values.budget || ""}*/}
            {/*    />*/}
            {/*    {validation.touched.budget && validation.errors.budget ? (*/}
            {/*      <FormFeedback type="invalid" className="d-block">*/}
            {/*        {validation.errors.budget}*/}
            {/*      </FormFeedback>*/}
            {/*    ) : null}*/}
            {/*  </Col>*/}
            {/*</div>*/}
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

