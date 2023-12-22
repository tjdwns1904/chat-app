import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import ChatInfo from "./ChatInfo";

function ChatRoom({ user, roomId }) {
    const [msg, setMsg] = useState("");
    const [chats, setChats] = useState([]);
    const [isInfoShown, setIsInfoShown] = useState(false);
    const [isConfirmShown, setIsConfirmShown] = useState(false);
    const lastChat = useRef(null);
    const [room, setRoom] = useState({});
    const [roomName, setRoomName] = useState("");
    const getRoom = () => {
        axios.post("http://localhost:3000/room", {
            roomId: roomId
        })
            .then((res) => {
                if (res.data.err) {
                    console.log(res.data.err);
                } else {
                    const name = res.data.members.filter(m => {
                        return m._id === user._id
                    })[0].roomName;
                    setRoomName(name);
                    setRoom(res.data);
                }
            })
    }
    const checkDate = (chat) => {
        if (lastChat.current) {
            if (new Date(lastChat.current.time).toLocaleDateString() !== new Date(chat.time).toLocaleDateString()) {
                lastChat.current = chat;
                return false;
            }
        }
        return true;
    };
    const sendMsg = () => {
        if (msg !== "") {
            const date = new Date();
            const now = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " "
                + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
            axios.post("http://localhost:3000/chat/send", {
                room: room,
                sender: user,
                time: new Date(now),
                msg: msg
            })
                .then((res) => {
                    setMsg("");
                    if (res.data.msg) {
                        getChats();
                    }
                });
        }
    };
    const getChats = () => {
        axios.post("http://localhost:3000/chat/getChats", {
            room: roomId,
            user: user._id
        })
            .then((res) => {
                if (res.data.err) {
                    console.log(res.data.err);
                } else {
                    const sortedChats = res.data.sort((a, b) => new Date(a.time) - new Date(b.time));
                    if (sortedChats.length !== 0) {
                        lastChat.current = sortedChats[0];
                    }
                    setChats(sortedChats);
                }
            })
    };
    const leaveRoom = () => {
        axios.post("http://localhost:3000/chat/leave", {
            room: room,
            user: user._id
        })
            .then((res) => {
                if (res.data.err) {
                    console.log(res.data.err);
                } else {
                    localStorage.removeItem('room');
                    window.location.reload();
                }
            });
    };
    const handleShow = () => setIsConfirmShown(true);
    const handleClose = () => setIsConfirmShown(false);
    const handleToggle = () => setIsInfoShown(prev => !prev);
    useEffect(() => {
        getRoom();
        getChats();
        const interval = setInterval(() => {
            getChats();
        }, 5000);
        return () => clearInterval(interval);
    }, []);
    return (
        <>
            {isConfirmShown &&
                <div>
                    <div className="modal-background" onClick={handleClose} />
                    <div className="modal-container">
                        <p className="py-3">Do you really want to leave a chat?</p>
                        <button className="cancel-btn me-1" onClick={leaveRoom}>Yes</button>
                        <button className="update-btn" onClick={handleClose}>Cancel</button>
                    </div>
                </div>
            }
            <div className="room-container">
                <div className="room-main-container">
                    <div className="chat-header">
                        <h3 className="mb-4">{roomName}</h3>
                        <button className={isInfoShown ? "more-btn active" : "more-btn"} onClick={handleToggle} />
                    </div>
                    <div className="chat-container">
                        {chats.length !== 0 && chats.map((chat) => {
                            return (
                                <div key={chat._id}>
                                    {!checkDate(chat) &&
                                        <div>
                                            <p className="date-displayer">{new Date(chat.time).toDateString()}</p>
                                        </div>
                                    }
                                    {chat.sender._id === user._id ?
                                        <div className="chat-box-container right">
                                            <small className="unread-num me-1">{chat.unread.length !== 0 && chat.unread.length}</small>
                                            <small className="time-sent me-1">{new Date(chat.time).toLocaleTimeString().slice(0, new Date(chat.time).toLocaleTimeString().lastIndexOf(":"))}</small>
                                            <p className="sender">{chat.content}</p>
                                        </div>
                                        :
                                        <div className="chat-box-container">
                                            <div className="profile-img" />
                                            <div>
                                                <small className="ms-2">{chat.sender.name}</small>
                                                <p className="receiver">{chat.content}</p>
                                            </div>
                                            <small className="time-sent ms-1">{new Date(chat.time).toLocaleTimeString().slice(0, new Date(chat.time).toLocaleTimeString().lastIndexOf(":"))}</small>
                                            <small className="unread-num ms-1">{chat.unread.length !== 0 && chat.unread.length}</small>
                                        </div>
                                    }
                                </div>
                            )
                        })}
                    </div>
                    <div className="msg-box">
                        <button className="attachment-btn" />
                        <input type="text" name="msg" id="" placeholder="Message..." value={msg} onChange={(e) => setMsg(e.target.value)} />
                        <button className="send-btn" onClick={sendMsg} />
                    </div>
                </div>

            </div>

            {isInfoShown && <ChatInfo room={room} user={user} leaveRoom={handleShow} />}
        </>
    )
}

export default ChatRoom;