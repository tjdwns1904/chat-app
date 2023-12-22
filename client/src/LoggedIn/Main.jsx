import React, { useEffect, useState } from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import ChatRoom from "./ChatRoom";

function Main({ user }) {
    const [room, setRoom] = useState(null);
    useEffect(() => {
        setRoom(localStorage.getItem("room"));
    }, []);
    return (
        <div className="d-flex">
            <Header user={user} />
            <Outlet />
            {(localStorage.getItem("room") && room) && <ChatRoom user={user} roomId={room} />}
        </div>
    )
}

export default Main;