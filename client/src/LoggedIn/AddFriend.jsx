import React, { useEffect, useState } from "react";
import axios from 'axios';
import Loading from "../Loading";

function AddFriend({ user, handleClose, friends, getFriends }) {
    const [allUsers, setAllUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const getUsers = () => {
        setIsLoading(true);
        axios.post("http://localhost:3000/allUsers", {
            userId: user._id
        })
            .then(res => {
                if (res.data.err) {
                    console.log(res.data.err);
                } else {
                    const friendNames = friends.map(f => { return f.username });
                    const filteredUsers = res.data.filter(friend => {
                        return !friendNames.includes(friend.username);
                    });
                    setAllUsers(filteredUsers);
                }
            })
            .finally(() => setIsLoading(false));
    };
    const addFriend = (id) => {
        setIsLoading(true);
        axios.post("http://localhost:3000/user/addFriend", {
            userId: user._id,
            friendId: id
        })
            .then((res) => {
                if (res.data.msg) {
                    getFriends();
                }
            })
            .finally(() => setIsLoading(false));
    };
    useEffect(() => {
        getUsers();
    }, [friends]);
    return (
        <>
            {isLoading && <Loading />}
            <div className="modal-background" onClick={handleClose}>
            </div>
            <div className="modal-container">
                <h3>People who you might know</h3>
                <div className="scroll">
                    {allUsers.length !== 0 && allUsers.map(friend => {
                        return (
                            <div className="main-container" key={friend._id}>
                                <div className="d-flex">
                                    <div className="profile-img" />
                                    <div>
                                        <p>{friend.name}</p>
                                        <p className="username-text">{friend.username}</p>
                                    </div>
                                </div>
                                <button className="follow-btn" onClick={() => addFriend(friend._id)} />
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}

export default AddFriend;