import React, { useEffect, useState } from "react";

function FriendCard({ friend, addMember, deleteMember, member }) {
    const [isSelected, setIsSelected] = useState(false);
    const handleToggle = () => {
        setIsSelected(prev => !prev);
    }
    useEffect(() => {
        if (member.length !== 0) {
            member.forEach(m => {
                if(m._id === friend._id){
                    setIsSelected(true);
                }
            })
        }
    }, []);
    return (
        <div className="friend-container hover-div" key={friend.username} onClick={() => {
            if (isSelected) {
                deleteMember(friend);
            } else {
                addMember(friend);
            }
            handleToggle();
        }}>
            <div className="d-flex">
                <div className="profile-img" />
                <div>
                    <p>{friend.name}</p>
                    <p>{friend.username}</p>
                </div>
            </div>
            <div className={isSelected ? "radio-btn radio-checked" : "radio-btn"} />
        </div>
    )
}

export default FriendCard;