import axios from "axios";
import React, { useEffect, useState } from "react";
import Invite from "./Invite";

function ChatInfo({ room, user, leaveRoom }) {
    const [friends, setFriends] = useState([]);
    const [chatName, setChatName] = useState("");
    const [nameEdit, setNameEdit] = useState(false);
    const [isModalShown, setIsModalShown] = useState(false);
    const roomName = room.members.filter(m => {
        return m._id === user._id
    })[0].roomName;
    const addFriend = (id) => {
        axios.post("http://localhost:3000/user/addFriend", {
            userId: user._id,
            friendId: id
        })
            .then((res) => {
                if (res.data.msg) {
                    window.location.reload();
                }
            })
    };
    const getFriends = () => {
        axios.post("http://localhost:3000/allFriends", {
            userId: user._id
        })
            .then(res => {
                if (res.data.err) {
                    console.log(res.data.err);
                } else {
                    const friendIds = res.data.map((friend) => {
                        return friend._id;
                    });
                    setFriends(friendIds);
                }
            });
    };
    const editChat = () => {
        if (chatName !== "" && chatName !== roomName) {
            axios.post("http://localhost:3000/chat/edit", {
                roomId: room._id,
                userId: user._id,
                name: chatName
            })
                .then((res) => {
                    if (res.data.msg) {
                        window.location.reload();
                    } else {
                        console.log(res.data.err);
                    }
                })
        };
    };
    const handleClose = () => setIsModalShown(false);
    const handleOpen = () => setIsModalShown(true);
    useEffect(() => {
        getFriends();
    }, []);
    return (
        <>
            {isModalShown && <Invite user={user} room={room} handleClose={handleClose} />}
            <div className="info-container">
                <h3>Chat settings</h3>
                <div className="my-4">
                    <div className="chat-thumb" />
                    {nameEdit ?
                        <div className="mt-3">
                            <input type="text" name="name" id="" defaultValue={roomName} onChange={(e) => setChatName(e.target.value)} />
                            <button className="update-btn ms-2" onClick={editChat}>Edit</button>
                            <button className="cancel-btn" onClick={() => {
                                setNameEdit(false);
                                setChatName("");
                            }}>Cancel</button>
                        </div>
                        :
                        <div className="d-flex justify-content-center">
                            <p>{roomName}</p>
                            <button className="edit-btn mt-1 ms-2" onClick={() => setNameEdit(true)} />
                        </div>
                    }
                </div>
                <div className="invite ms-2" onClick={handleOpen}>
                    <div className="invite-img" />
                    <p className="mb-0 text-primary">Invite friend</p>
                </div>
                <div className="member-list">
                    <div className="d-flex my-2 align-items-center">
                        <div className="profile-img" />
                        <div>
                            <p className="mb-0">{user.name}</p>
                            <small>{user.username}</small>
                        </div>
                    </div>
                    {room.members.map((member) => {
                        if (member._id !== user._id) {
                            return (
                                <div className="d-flex my-2 justify-content-between align-items-center" key={member._id}>
                                    <div className="d-flex">
                                        <div className="profile-img" />
                                        <div>
                                            <p className="mb-0">{member.name}</p>
                                            <small>{member.username}</small>
                                        </div>
                                    </div>
                                    {(member._id !== user._id && !friends.includes(member._id)) && <button className="follow-btn" onClick={() => addFriend(member._id)} />}
                                </div>
                            )
                        }
                    })}
                </div>

                <div className="info-footer">
                    <button className="leave-chat-btn" onClick={leaveRoom}>Leave chat</button>
                </div>
            </div>
        </>
    )
}

export default ChatInfo;