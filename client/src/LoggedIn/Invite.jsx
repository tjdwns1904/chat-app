import React, { useEffect, useState } from "react";
import FriendCard from "./FriendCard";
import axios from "axios";

function Invite({ user, room, handleClose }) {
    const [friends, setFriends] = useState([]);
    const [newMembers, setNewMembers] = useState([]);
    const [name, setName] = useState("");
    const [fullFriends, setFullFriends] = useState([]);
    const getFriends = () => {
        axios.post("http://localhost:3000/allFriends", {
            userId: user._id
        })
            .then((res) => {
                if (res.data.err) {

                } else {
                    const memberIDs = room.members.map(m => {
                        return m._id;
                    });
                    const filteredFriends = res.data.filter(friend => {
                        return !memberIDs.includes(friend._id);
                    });
                    setFriends(filteredFriends);
                    setFullFriends(filteredFriends);
                }
            });
    };
    const addMember = (friend) => {
        setNewMembers([...newMembers, friend]);
    };
    const removeMember = (friend) => {
        const newList = newMembers.filter(m => {
            return m._id !== friend._id;
        });
        setNewMembers(newList);
    }
    const inviteFriends = () => {
        axios.post("http://localhost:3000/chat/invite", {
            room: room,
            newMembers: newMembers
        })
            .then((res) => {
                if (res.data.msg) {
                    window.location.reload();
                }else{  
                    console.log(res.data.err);
                }
            })
    };
    const searchByName = () => {
        const filteredFriends = fullFriends.filter(f => {
            return f.name.toLowerCase().includes(name.toLowerCase());
        });
        setFriends(filteredFriends);
    };
    const handleChange = (e) => setName(e.target.value);
    useEffect(() => {
        getFriends();
    }, []);
    return (
        <>
            <div className="modal-background" onClick={handleClose} />
            <div className="modal-container">
                <h3>Invite friend</h3>
                <div className="d-flex">
                    {newMembers.length !== 0 && newMembers.map(friend => {
                        return (
                            <div className="text-center mb-3" key={friend._id}>
                                <div className="profile-img centered" />
                                {friend.name}
                            </div>
                        )
                    })}
                </div>
                <div className="search-bar-container">
                    <input className="search-bar" type="text" name="name" placeholder="Search" autoComplete="off" onChange={(e) => handleChange(e)}/>
                    <button className="search-btn" onClick={searchByName} />
                </div>
                <div className={friends.length > 5 ? "scroll" : ""}>
                    {friends.length !== 0 && friends.map(friend => {
                        return (
                            <FriendCard member={newMembers} friend={friend} addMember={addMember} deleteMember={removeMember} key={friend._id} />
                        )
                    })}
                </div>
                <div className="create-chat-btn-container">
                    <button className={newMembers.length !== 0 ? "create-btn me-2" : "create-btn me-2 disabled-btn"} onClick={() => {
                        if (newMembers.length !== 0) {
                            inviteFriends();
                        }
                    }}>
                        Invite
                    </button>
                    <button className="cancel-btn" onClick={handleClose}>Cancel</button>
                </div>
            </div>
        </>
    )
}

export default Invite;