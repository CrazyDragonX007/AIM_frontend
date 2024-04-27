import React, { useEffect, useState, useRef } from "react"
import PropTypes from "prop-types"
import { connect, useDispatch, useSelector } from "react-redux"
import { isEmpty } from "lodash"
import { setBreadcrumbItems } from '../../store/actions';

import {
  Col,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap"
import { AvField, AvForm } from "availity-reactstrap-validation"

import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"
import BootstrapTheme from "@fullcalendar/bootstrap"
import listPlugin from '@fullcalendar/list';

import {
  addNewShift,
  deleteShift, getProjectTasks,
  getShifts,
  updateShift
} from "../../store/calendar/actions"
import DeleteModal from "./DeleteModal"
import { useLocation } from "react-router-dom"

// TODO: Change modal to add fields: Title, description, date(selectedDay), start, end, location, assignTo and assignToTask

const Calender = props => {

  document.title = "Calendar | AIM - All in One Manager";

  const dispatch = useDispatch()
  const { shifts, onGetShifts } = props
  const [setCalenderView, updatedCalenderView] = useState("dayGridMonth")
  const [modal, setModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [event, setEvent] = useState({})
  // const [selectedDay, setSelectedDay] = useState(0)
  const [isEdit, setIsEdit] = useState(false)
  const user = useSelector(state => state.Login?.user)

  const location = useLocation()
  const projectId = location?.state?.projectId
  const allUsers = useSelector(state => state.Admin?.users)
  const project = useSelector(state => state.Projects?.currentProject)
  const projectTasks = useSelector(state => state.calendar?.tasks)
  const [usersInProject,setUsersInProject] = useState([])

  useEffect(() => {
      dispatch(getProjectTasks(projectId))
  }, [projectId,dispatch])

  useEffect(() => {
    if(project && allUsers){
      const managers = project.assignedManagers?.map(m=>allUsers?.find(u=>u._id===m))
      const employees = project.assignedEmployees?.map(e=>allUsers?.find(u=>u._id===e))
      if(managers && employees) {
        setUsersInProject([...managers, ...employees])
      }
    }
  }, [project,allUsers])

  const calendarRef = useRef();
  const getApi = () => {
    const { current: calendarDom } = calendarRef;

    return calendarDom ? calendarDom.getApi() : null;
  }

  const changeView = (view, API) => {
    API && API.changeView(view);
  };

  useEffect(() => {
    onGetShifts(projectId)
    getInitialView()
    const api = getApi();
    changeView(setCalenderView, api);
  }, [onGetShifts, setCalenderView,projectId])

  useEffect(() => {
    if (!modal && !isEmpty(event) && !!isEdit) {
      setTimeout(() => {
        setEvent({})
        setIsEdit(false)
      }, 500)
    }
  }, [modal, event, isEdit])

  /**
   * Handling the modal state
   */
  const toggle = () => {
    setModal(!modal)
  }

  /**
   * Handling date click on calendar
   */
  const handleDateClick = arg => {
    // setSelectedDay(arg)
    toggle()
   }

  /**
   * Handling click on event on calendar
   */
  const handleEventClick = arg => {
    const event = arg.event
    const temp = event.startStr?.split('T')
    const start = temp[1].split('-')[0]
    const end = event.endStr?.split('T')[1]?.split('-')[0]
    setEvent({
      id: event.extendedProps._id,
      title: event.title,
      start: start,
      end: end || '00:00',
      date:temp[0],
      assignedTo: event.extendedProps.assignedTo
    })
    setIsEdit(true)
    toggle()
  }

  /**
   * Handling submit event on event form
   */
  const handleValidEventSubmit = (e, values) => {
    const start = new Date(values.date + " " + values.start)
    const end = new Date(values.date + " " + values.end)
    const { onAddNewShift, onUpdateShift } = props
    if (isEdit) {
      const updatedShift = {
        id: event.id,
        title: values.title,
        description: values.description,
        date: values.date,
        start: start,
        end: end,
        assignedTo: values.assignedTo,
      }
      // update event
      onUpdateShift(updatedShift)
    } else {
      const newShift = {
        title: values.title,
        description: values.description,
        date: values.date,
        start: start,
        end: end,
        createdBy: user.name,
        assignedTo: values.assignedTo,
        projectId: projectId,
      }
      onAddNewShift(newShift)
    }
    toggle()
  }

  const handleDeleteEvent = () => {
    const { onDeleteShift } = props
    onDeleteShift(event.id)
    setDeleteModal(false)
    toggle()
  }

  const getInitialView = () => {
    if (window.innerWidth >= 768 && window.innerWidth < 1200) {
      updatedCalenderView('dayGridWeek')
    } else if (window.innerWidth <= 768) {
      updatedCalenderView('listWeek')
    } else {
      updatedCalenderView('dayGridMonth')
    }
  }

  //BreadCrumd add
  const breadcrumbItems = [
    { title: "AIM", link: "#" },
    { title: "Calendar", link: "#" },
  ]

  useEffect(() => {
    props.onSetBreadCrumbs('Calendar', breadcrumbItems)
  });

  return (

    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteEvent}
        onCloseClick={() => setDeleteModal(false)}
      />

      <Row className="mb-4">
        <Col className="col-xl-12">
          <div className="card mt-4 mt-xl-0 mb-0">
            <div className="card-body">
              {/* fullcalendar control */}
              {shifts &&
              <FullCalendar
                plugins={[
                  BootstrapTheme,
                  dayGridPlugin,
                  interactionPlugin,
                  listPlugin
                ]}
                slotDuration={"00:15:00"}
                handleWindowResize={true}
                themeSystem="bootstrap"
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,dayGridWeek,dayGridDay,listWeek",
                }}
                events={shifts}
                editable={true}
                selectable={true}
                dateClick={handleDateClick}
                eventClick={handleEventClick}
                ref={calendarRef}
                initialView={setCalenderView}
                windowResize={getInitialView}
              />
              }
              {/* New/Edit event modal */}
              <Modal isOpen={modal} className={props.className}>
                <ModalHeader toggle={toggle} tag="h4">
                  {!!isEdit ? "Edit Shift" : "Add Shift"}
                </ModalHeader>
                <ModalBody>
                  <AvForm onValidSubmit={handleValidEventSubmit}>
                    <Row form>
                      <Col className="col-12 mb-3">
                        <AvField
                          name="title"
                          label="Shift title"
                          type="text"
                          errorMessage="Invalid name"
                          validate={{
                            required: { value: true },
                          }}
                          value={event ? event.title : ""}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col className="col-6 mb-3">
                        <AvField
                          name="date"
                          label="Date"
                          type="date"
                          errorMessage="Invalid date"
                          validate={{
                            required: { value: true },
                          }}
                          value={event ? event.date : null}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col className="col-6 mb-3">
                        <AvField
                          name="start"
                          label="Start Time"
                          type="time"
                          errorMessage="Invalid time"
                          validate={{
                            required: { value: true },
                          }}
                          value={event ? event.start : ""}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col className="col-6 mb-3">
                        <AvField
                          name="end"
                          label="End Time"
                          type="time"
                          errorMessage="Invalid time"
                          validate={{
                            required: { value: true },
                          }}
                          value={event ? event.end : ""}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col className="col-6 mb-3">
                        <AvField type='select' name='assignedTo' value={event?event.assignedTo:''} label='Assign Shift to user' validate={{required:true}} errorMessage='Select a user to assign the shift.'>
                          <option value=''>Select User</option>
                          {usersInProject.map((option) => (
                            <option key={option.name} value={option._id}>
                              {option.name}
                            </option>
                          ))}
                        </AvField>
                      </Col>
                    </Row>
                    {/*<Row>*/}
                    {/*  <Col className="col-6 mb-3">*/}
                    {/*    <AvField type='select' name='assignedToTask' value={event?event.assignedToTask:''} label='Assign Shift to a Task'>*/}
                    {/*      <option value=''>Select Task</option>*/}
                    {/*      {projectTasks.map((option) => (*/}
                    {/*        <option key={option.title} value={option._id}>*/}
                    {/*          {option.title}*/}
                    {/*        </option>*/}
                    {/*      ))}*/}
                    {/*    </AvField>*/}
                    {/*  </Col>*/}
                    {/*</Row>*/}
                    <Row>
                      <Col>
                        <div className="text-end">
                          <button
                            type="button"
                            className="btn btn-light me-2"
                            onClick={toggle}
                          >
                            Close
                          </button>
                          {!!isEdit && (
                            <button
                              type="button"
                              className="btn btn-danger me-2"
                              onClick={() => setDeleteModal(true)}
                            >
                              Delete
                            </button>
                          )}
                          <button
                            type="submit"
                            className="btn btn-success save-event"
                          >
                            Save
                          </button>
                        </div>
                      </Col>
                    </Row>
                  </AvForm>
                </ModalBody>
              </Modal>
            </div>
          </div>
        </Col>
      </Row>
    </React.Fragment>
  )
}

Calender.propTypes = {
  shifts: PropTypes.array,
  className: PropTypes.string,
  onGetShifts: PropTypes.func,
  onGetProjectTasks: PropTypes.func,
  onAddNewShifts: PropTypes.func,
  onUpdateShifts: PropTypes.func,
  onDeleteShift: PropTypes.func,
  c: PropTypes.func,
  onSetBreadCrumbs: PropTypes.func,
}

const mapStateToProps = ({ calendar }) => ({
  shifts: calendar.shifts,
})

const mapDispatchToProps = dispatch => ({
  onGetShifts: projectId => dispatch(getShifts(projectId)),
  onGetProjectTasks: projectId => dispatch(getProjectTasks(projectId)),
  onAddNewShift: shift => dispatch(addNewShift(shift)),
  onUpdateShift: shift => dispatch(updateShift(shift)),
  onDeleteShift: shift => dispatch(deleteShift(shift)),
  onSetBreadCrumbs: (title, breadcrumbItems) => dispatch(setBreadcrumbItems(title, breadcrumbItems)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Calender)
