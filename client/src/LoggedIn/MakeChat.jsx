import axios from "axios";
import React, { useEffect, useState } from "react";
import Loading from "../Loading";
import FriendCard from "./FriendCard";

function MakeChat({ user, handleClose }) {
    const [friends, setFriends] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [member, setMember] = useState([]);
    const [name, setName] = useState("");
    const [fullFriends, setFullFriends] = useState([]);
    const addMember = (friend) => {
        setMember([...member, friend]);
    };
    const deleteMember = (friend) => {
        const newMember = member.filter(m => {
            return friend._id !== m._id
        });
        setMember(newMember);
    };

    const getFriends = () => {
        setIsLoading(true);
        axios.post("http://localhost:3000/allFriends", {
            userId: user._id
        })
            .then((res) => {
                if (res.data.err) {

                } else {
                    setFriends(res.data);
                    setFullFriends(res.data);
                }
            })
            .finally(() => setIsLoading(false));
    };
    const createChat = () => {
        setIsLoading(true);
        axios.post("http://localhost:3000/chat/create", {
            user: user,
            friends: member
        })
            .then((res) => {
                if(res.data.msg){
                    window.location.reload();
                }else if(res.data.err){
                    console.log(res.data.err);
                }else{
                    localStorage.setItem('room', res.data._id);
                    window.location.reload();
                }
            })
            .finally(() => {
                setIsLoading(false);
                handleClose();
            });
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
            {isLoading && <Loading />}
            <div className="modal-background" onClick={handleClose} />
            <div className="modal-container">
                <h3>New Chat</h3>
                <div className="d-flex">
                    {member.length !== 0 && member.map(friend => {
                        return (
                            <div className="text-center mb-3" key={friend._id}>
                                <div className="profile-img centered" />
                                {friend.name}
                            </div>
                        )
                    })}
                </div>
                <div className="search-bar-container">
                    <input className="search-bar" type="text" name="name" placeholder="Search" autoComplete="off" onChange={(e) => handleChange(e)} />
                    <button className="search-btn" onClick={searchByName}/>
                </div>
                <div className={friends.length > 5 ? "scroll" : ""}>
                    {friends.length !== 0 && friends.map(friend => {
                        return (
                            <FriendCard member={member} friend={friend} addMember={addMember} deleteMember={deleteMember} key={friend._id} />
                        )
                    })}
                </div>
                <div className="create-chat-btn-container">
                    <button className={member.length !== 0 ? "create-btn me-2" : "create-btn me-2 disabled-btn"} onClick={() => {
                        if (member.length !== 0) {
                            createChat();
                        }
                    }}>
                        Create
                    </button>
                    <button className="cancel-btn" onClick={handleClose}>Cancel</button>
                </div>
            </div>
        </>
    )
}

export default MakeChat;