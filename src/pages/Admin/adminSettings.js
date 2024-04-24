import React, { useEffect, useState } from "react"

import { connect, useDispatch, useSelector } from "react-redux"

//Import Action to copy breadcrumb items from local state to redux state
import { setBreadcrumbItems } from "../../store/actions";
import { Button, Form, Input, Label, Modal } from "reactstrap"
import { changeUserRole, getAllUsers, inviteUser, removeUser } from "../../store/admin/actions"

const AdminSettings = (props) => {
  const dispatch = useDispatch()

  document.title = "Admin Settings | AIM - All in One Manager";

  const breadcrumbItems = [
    { title: "AIM", link: "/dashboard" },
    { title: "Admin Settings", link: "#" },
  ]

  useEffect(() => {
    props.setBreadcrumbItems('Admin Settings', breadcrumbItems)
  })

  useEffect(() => {
    const teamId = JSON.parse(localStorage.getItem('user')).teamId;
    dispatch(getAllUsers(teamId))
  }, [dispatch])

  const [newUsers, setNewUsers] = useState([]);
  const existingUsers = useSelector(state => state.Admin?.users)
  const [editModalFlag, setEditModalFlag] = useState(false)
  const [editUser, setEditUser] = useState({})

  const addEmail = () => {
    const email = document.getElementById('email').value;
    const role = document.getElementById('role').value;
    const teamId = JSON.parse(localStorage.getItem('user')).teamId;
    setNewUsers([...newUsers, { email, role, teamId }])
  }

  const removeEmail = (index) => {
    setNewUsers(newUsers.filter((user, i) => i !== index))
  }

  const handleSubmit = () => {
    dispatch(inviteUser(newUsers))
    setNewUsers([]);
  }

  const handleRemove = (userId) => {
    setEditModalFlag(false);
    dispatch(removeUser(userId));
  }

  const showEditModal = (user) => {
    setEditModalFlag(!editModalFlag)
    setEditUser(user)
  }

  const handleRoleChange = () => {
    const role = document.getElementById('edit_role').value;
    dispatch(changeUserRole( editUser._id, role ))
  }

  const editModal = () => {
    return (
      <Modal isOpen={editModalFlag} toggle={showEditModal}>
        <div className="modal-header">
          <h5 className="modal-title mt-0" id="myModalLabel">Edit or Remove User from Team</h5>
          <button onClick={showEditModal} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div className="modal-body">
          <Form>
          <div className="mb-3">
              <Label for="role" className="form-label">Change Role for {editUser.name}</Label>
              <Input type="select" id="edit_role" className="form-select">
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Employee">Employee</option>
              </Input>
            </div>
            <Button type="submit" onClick={handleRoleChange} className="btn btn-primary">Change Role</Button>
            </Form>
            <div className="mt-2">
            <Button onClick={()=>handleRemove(editUser._id)} className="btn btn-danger">Remove User</Button>
          </div>
        </div>
      </Modal>
    )
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">Invite Users to your team on AIM</h4>
                  <p>Enter user's email address whom you wish to invite</p>
                  <ul>
                    {newUsers.map((user, index) => (
                      <li key={index}>
                        {user.email} - {user.role}
                        <Button onClick={() => removeEmail(index)} className="m-lg-1">Remove</Button>
                      </li>
                    ))}
                  </ul>
                  <div className="input-group w-50">
                    <input type="email" id="email" className="form-control mb-2" style={{marginRight:10}} placeholder="Email" />
                    <select id='role' className="form-select mb-2">
                      <option value="Admin">Admin</option>
                      <option value="Manager">Manager</option>
                      <option value="Employee">Employee</option>
                    </select>
                  </div>
                  <Button onClick={addEmail} className="btn btn-primary m-1">Add</Button>
                  <br/>
                  <Button onClick={handleSubmit} className="btn btn-success">Submit</Button>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">Team Members</h4>
                  <p>View and manage your team members</p>
                  <div className="table-responsive">
                    <table className="table table-centered table-nowrap table-hover mb-0">
                      <thead>
                        <tr>
                          <th scope="col">Name</th>
                          <th scope="col">Role</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                      {existingUsers?.map((user, index) => (
                        <tr key={index}>
                          <td>
                            <h5 className="font-14 my-1">{user.name}</h5>
                          </td>
                          <td>
                            <h5 className="font-14 my-1">{user.role}</h5>
                          </td>
                          {/*<td>*/}
                          {/*  <Button onClick={()=>handleRemove(user._id)} className="btn btn-danger">Remove</Button>*/}
                          {/*</td>*/}
                          <td>
                            <Button onClick={()=>showEditModal(user)} className="btn btn-primary">Edit</Button>
                          </td>
                        </tr>
                      ))}
                      {editModal()}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default connect(null, { setBreadcrumbItems })(AdminSettings);