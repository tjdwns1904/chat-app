import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Hover from "./Hover";

function Header({user}) {
    const [ showHover, setShowHover ] = useState(false);
    const [content, setContent] = useState("");
    const [point, setPoint] = useState({
        x: 0,
        y: 0
    });
    const logout = () => {
        axios.get("http://localhost:3000/auth/logout")
        .then((res) => {
            localStorage.clear();
            window.location.href = '/';
        })
    }
    
    return (
        <div className="header-container">
            {showHover && <Hover content={content} point={point}/>}
            <div className="main-container">
                <div className="friends-header">
                    <Link to={"/"} className="friends-link" onMouseMoveCapture={(e) => {
                        setShowHover(true);
                        setPoint({
                            x: e.clientX,
                            y: e.clientY
                        });
                        setContent("Friends");
                    }} onMouseOutCapture={() => setShowHover(false)}>
                    </Link>
                </div>
                <div className="chats-header">
                    <Link to={"/chats"} className="chats-link" onMouseMoveCapture={(e) => {
                        setShowHover(true);
                        setPoint({
                            x: e.clientX,
                            y: e.clientY
                        });
                        setContent("Chats");
                    }} onMouseOutCapture={() => setShowHover(false)}></Link>
                </div>
            </div>
            <div className="footer-container">
                <div className="profile-link-container">
                    <Link to={"/profile"} className="profile-link" onMouseMoveCapture={(e) => {
                        setShowHover(true);
                        setPoint({
                            x: e.clientX,
                            y: e.clientY
                        });
                        setContent("Profile");
                    }} onMouseOutCapture={() => setShowHover(false)}></Link>
                </div>
                <button className="signout-btn" onClick={logout} onMouseMoveCapture={(e) => {
                        setShowHover(true);
                        setPoint({
                            x: e.clientX,
                            y: e.clientY
                        });
                        setContent("Sign out");
                    }} onMouseOutCapture={() => setShowHover(false)}></button>
            </div>
        </div>
    )
}

export default Header;