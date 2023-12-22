import React, { useEffect, useState } from "react";
import MakeChat from "./MakeChat";
import axios from "axios";
import Loading from "../Loading";

function Chats({ user }) {
    const [rooms, setRooms] = useState([]);
    const [isAddModalShown, setIsAddModalShown] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const handleAddModalShow = () => setIsAddModalShown(true);
    const handleAddModalClose = () => setIsAddModalShown(false);
    const getRooms = () => {
        setIsLoading(true);
        axios.post("http://localhost:3000/allRooms", {
            userId: user._id
        })
            .then((res) => {
                if (res.data.err) {

                } else {
                    setRooms(res.data);
                }
            })
            .finally(() => setIsLoading(false));
    };
    const setRoom = (room) => {
        if (localStorage.getItem('room')) {
            const r = localStorage.getItem('room');
            if (room._id !== r) {
                localStorage.setItem('room', room._id);
                window.location.reload();
            }
        } else {
            localStorage.setItem('room', room._id);
            window.location.reload();
        }
    };
    const isCurrentRoom = (room) => {
        if (localStorage.getItem("room")) {
            const r = localStorage.getItem("room");
            if(r === room){
                return true;
            }
        }
        return false;
    }
    useEffect(() => {
        getRooms();
    }, []);
    return (
        <>
            {isLoading && <Loading />}
            {isAddModalShown && <MakeChat user={user} handleClose={handleAddModalClose} />}
            <div className="chats-container">
                <div className="d-flex align-items-center justify-content-between">
                    <h2>Chats</h2>
                    <button className="add-room-btn" onClick={handleAddModalShow} />
                </div>
                <div className="main-container mt-2">
                    {rooms.length !== 0 && rooms.map(room => {
                        const name = room.members.filter(m => {
                            return m._id === user._id
                        });
                        return (
                            <div className={isCurrentRoom(room._id) ? "room-div selected-chat" : "room-div"} key={room._id} onClick={() => {
                                setRoom(room);
                            }}>
                                <p>{name[0].roomName}</p>
                                <small>{room.members.length}</small>
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}

export default Chats;