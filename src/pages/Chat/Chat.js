import React, { useEffect, useRef, useState } from "react"
import { connect, useDispatch, useSelector } from "react-redux"
import { io } from "socket.io-client"
//Import Action to copy breadcrumb items from local state to redux state
import { setBreadcrumbItems } from "../../store/actions"
import SimpleBar from "simplebar-react/dist"
import { Button, Card, Col, Row } from "reactstrap"
import { Link } from "react-router-dom"

import {
    addMessage as onAddMessage,
    getMessages as onGetMessages,
    receiveMessage
} from "store/chat/actions"
import Spinners from "components/Common/Spinner"
import { getAllUsers } from "../../store/admin/actions"

const Chat = (props) => {
    document.title = "Chat | AIM - All in One Manager";

    const breadcrumbItems = [
        { title: "AIM", link: "/" },
        { title: "Messages", link: "#" },
    ]

    useEffect(() => {
        props.setBreadcrumbItems('Messages', breadcrumbItems)
    })

    const dispatch = useDispatch();
    const socket = useRef();
    const loggedInUser = useSelector(state => state.Login?.user);
    let allUsers = useSelector(state => state.Admin?.users);
    allUsers = allUsers.filter((user) =>user._id!==loggedInUser._id)

    useEffect(() => {
      if(!allUsers.length>0){
          dispatch(getAllUsers(loggedInUser.teamId))
      }
    })

    useEffect(() => {
        if (loggedInUser) {
            socket.current = io(process.env.REACT_APP_BACKEND_URL);
            socket.current.emit("add-user", loggedInUser._id);
        }
    }, [loggedInUser]);

    const { messages, loading } = useSelector(state => state.Chat);
    const [messagesData, setMessagesData] = useState();
    const [isLoading, setLoading] = useState(loading)

    const [currentRoomId, setCurrentRoomId] = useState(1);
    const [Chat_Box_Username, setChat_Box_Username] = useState('Select a team member to start messaging');

    const [curMessage, setCurMessage] = useState("");
    const [isDisabled, setIsDisabled] = useState(false);

    useEffect(() => {
        if (socket.current) {
            socket.current.on("msg-receive", (data) => {
                dispatch(receiveMessage({fromSelf:false,message:data.message}))
            });
        }
        //eslint-disable-next-line
    },[]);

    useEffect(() => {
        if (messages) {
            setMessagesData(messages);
        }
    },[messages]);

    const userChatOpen = (chat) => {
        setChat_Box_Username(chat.name);
        setCurrentRoomId(chat._id);
        dispatch(onGetMessages({from:loggedInUser._id,to:chat._id}));
    };

    const addMessage = () => {
        const message = {
            to: currentRoomId,
            from: loggedInUser._id,
            message:curMessage,
        }
        socket.current.emit("send-msg", message);
        if (curMessage !== "") {
            dispatch(onAddMessage(message));
            setCurMessage("");
            setIsDisabled(false)
        }
    };

    const onKeyPress = e => {
        const { key, value } = e;
        if (key === "Enter") {
            setCurMessage(value);
            setIsDisabled(true)
            addMessage();
        }
    };

    const getImageSrc = () => {
        const url = "https://ui-avatars.com/api/?background=random"
        return `${url}&name=${Chat_Box_Username}`
    }

    // scroll simple bar
    const scrollRef = useRef(null);
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.getScrollElement().scrollTop = scrollRef.current.getScrollElement().scrollHeight;
        }
    }, [messagesData,scrollRef])

    return (
        <React.Fragment>
            <div className="d-lg-flex">
                <Card className="chat-leftsidebar">
                    <div className="chat-leftsidebar-nav">
                                <SimpleBar className="chat-message-list">
                                    <div className="pt-3">
                                        <div className="px-3 ms-5">
                                            <h5 className="font-size-24 mb-3">Team Members</h5>
                                        </div>
                                        <ul className="list-unstyled chat-list p-3">
                                            {isLoading ? <Spinners setLoading={setLoading} /> :
                                                    <SimpleBar>
                                                        {allUsers.map((chat) => (
                                                          <li key={chat?._id || Math.random()} className={currentRoomId === chat?._id ? "active" : ""} style={{marginBottom:5}}>
                                                              <Link to="#" onClick={() => {userChatOpen(chat)}}>
                                                                  <div className="d-flex align-items-center">
                                                                      <div className="flex-grow-1 overflow-hidden">
                                                                          <h5
                                                                            className="text-truncate font-size-15 mb-0">{chat?.name}</h5>
                                                                      </div>
                                                                  </div>
                                                              </Link>
                                                          </li>
                                                          ))}
                                                          </SimpleBar>}
                                                    </ul>
                                    </div>
                                </SimpleBar>
                    </div>
                </Card>
                <div className="w-100 user-chat mt-4 mt-sm-0 ms-lg-3">
                    <Card>
                        <div className="p-3 px-lg-4 border-bottom">
                            <Row>
                                <Col xl={4} className="col-7">
                                    <div className="d-flex align-items-center">
                                        <div className="flex-shrink-0 avatar me-3 d-sm-block d-none">
                                            <img src={getImageSrc()} alt="" className="img-fluid d-block avatar rounded-circle" />
                                        </div>
                                        <div className="flex-grow-1">
                                            <h5 className="font-size-16 mb-1 text-truncate"><Link to="#" className="text-reset">{Chat_Box_Username}</Link></h5>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        <SimpleBar ref={scrollRef} className="chat-conversation p-4">
                            {isLoading ? (<Spinners setLoading={setLoading} />) : (
                                <ul className="list-unstyled mb-0">
                                    {messagesData && (messagesData || []).map((message,index) => {
                                                return (
                                                    <li key={index} className={!message.fromSelf ? "left" : "right"}>
                                                        <div className="conversation-list">
                                                            <div className="d-flex">
                                                                <div className="flex-1 ms-3">
                                                                    <div className="d-flex justify-content-between">
                                                                    </div>
                                                                    <div className="ctext-wrap">
                                                                        <div className="ctext-wrap-content">
                                                                            <p className="mb-0">
                                                                                {message.message}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                )
                                            })
                                        }
                                </ul>
                            )}
                        </SimpleBar>
                        <div className="p-3 border-top">
                            <div className="row">
                                <div className="col">
                                    <div className="position-relative">
                                        <input type="text"
                                            value={curMessage}
                                            onKeyPress={onKeyPress}
                                            onChange={e => { setCurMessage(e.target.value); setIsDisabled(true) }}
                                             className="form-control border chat-input" placeholder="Enter Message..." />
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <Button
                                    type="button"
                                    color="primary" 
                                    disabled={!isDisabled}
                                    onClick={() => addMessage()}
                                    className="chat-send w-md waves-effect waves-light">
                                        <span className="d-none d-sm-inline-block me-2">
                                            Send</span> <i className="mdi mdi-send float-end"></i></Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

            </div>
        </React.Fragment>
    )
}

export default connect(null, { setBreadcrumbItems })(Chat);
