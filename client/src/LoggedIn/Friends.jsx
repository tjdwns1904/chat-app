import React, { useEffect, useState } from "react";
import AddFriend from "./AddFriend";
import axios from "axios";

function Friends({ user }) {
    const [friends, setFriends] = useState([]);
    const [isModalShown, setIsModalShown] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const handleClose = () => setIsModalShown(false);
    const handleShow = () => setIsModalShown(true);
    const getFriends = () => {
        axios.post("http://localhost:3000/allFriends", {
            userId: user._id
        })
            .then(res => {
                if (res.data.err) {
                    console.log(res.data.err);
                } else {
                    setFriends(res.data);
                }
            });
    }
    const createChat = (friend) => {
        setIsLoading(true);
        axios.post("http://localhost:3000/chat/create", {
            user: user,
            friends: [friend]
        })
            .then((res) => {
                if(res.data.msg){
                    window.location.href = "/chats";
                }else if(res.data.err){
                    console.log(res.data.err);
                }else{
                    localStorage.setItem('room', res.data._id);
                    window.location.href = "/chats";
                }
            })
            .finally(() => {
                setIsLoading(false);
                handleClose();
            });
    };
    useEffect(() => {
        getFriends();
    }, []);
    return (
        <>
            {isModalShown && <AddFriend user={user} handleClose={handleClose} getFriends={getFriends} friends={friends} />}
            <div className="friends-container">
                <h2>Friends</h2>
                <div className="add-friend-btn" onClick={handleShow}>Add friend</div>
                <div className="main-container">
                    {friends.length === 0 ?
                        <p className="empty-text">No friends added</p>
                        :
                        friends.map(friend => {
                            return (
                                <div className="friend-container" key={friend.username}>
                                    <div className="d-flex">
                                        <div className="profile-img" />
                                        <div>
                                            <p>{friend.name}</p>
                                            <p className="username-text">{friend.username}</p>
                                        </div>
                                    </div>
                                    <button className="chat-btn" onClick={() => createChat(friend)}/>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </>
    )
}

export default Friends;