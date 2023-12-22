import React, { useState } from "react";
import { Link } from "react-router-dom";
import Loading from "../Loading";
import axios from "axios";

function Login() {
    axios.defaults.withCredentials = true;
    const [user, setUser] = useState({
        email: "",
        password: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isValid, setIsValid] = useState(true);
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isPwValid, setIsPwValid] = useState(true);
    const [isHidden, setIsHidden] = useState(true);
    const [isDisabled, setIsDisabled] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => {
            return (
                {
                    ...prev,
                    [name]: value
                }
            )
        });
    };
    const handlePwToggle = () => {
        setIsHidden(prev => !prev);
    };
    const login = () => {
        setIsLoading(true);
        axios.post("http://localhost:3000/auth/login", {
            user: user
        })
        .then((res) => {
            if(res.data.msg){
                console.log(res.data.msg);
                if(res.data.msg.startsWith("Welcome")){
                    localStorage.clear();
                    window.location.href = "/";
                }else{
                    setIsValid(false);
                }
            }else{
                console.log("err: " + res.data.err);
            }
        })
        .finally(() => setIsLoading(false));
    }
    const validation = () => {
        setIsEmailValid(true);
        setIsPwValid(true);
        setIsValid(true);
        const emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (user.email !== "" && user.password !== "") {
            if (user.email.match(emailFormat)) {
                setIsLoading(true);
                login();
            } else {
                setIsEmailValid(false);
            };
        } else {
            if (user.email === "") {
                setIsEmailValid(false);
            } else {
                setIsPwValid(false);
            }
        }
    };
    return (
        <>
            {isLoading && <Loading />}
            <div className="d-flex align-items-center p-5">
                <div className="auth-form">
                    <h2>Log in</h2>
                    <form action="post">
                        <div className={isEmailValid ? "input-field" : "input-field invalid-input"}>
                            <label>Email</label>
                            <div>
                                <input type="email" id="email" name="email" placeholder="Email" autoComplete="off" onChange={(e) => handleChange(e)} />
                            </div>
                        </div>
                        <p className={isEmailValid ? "hidden" : "invalid-text"}>Please enter a valid email</p>
                        <div className={isPwValid ? "input-field" : "input-field invalid-input"}>
                            <label>Password</label>
                            <div className="pw-container">
                                <input type={isHidden ? "password" : "text"} name="password" placeholder="Password" onChange={(e) => handleChange(e)} />
                                <button className={isHidden ? "show-btn" : "hide-btn"} onClick={(e) => {
                                    e.preventDefault();
                                    handlePwToggle();
                                }} />
                            </div>
                        </div>
                        <p className={isPwValid ? "hidden" : "invalid-text"}>Please enter a valid password</p>
                        <p className={isValid ? "hidden" : "invalid-text"}>Account doesn't exist. Try again with other account.</p>
                        <button className={isDisabled ? "auth-btn disabled-btn" : "auth-btn"} onClick={(e) => {
                            e.preventDefault();
                            if(!isDisabled){ validation(); }
                        }}>Log in</button>
                        <p className="auth-link">No accounts yet? <Link to={'/signup'}>Sign up</Link> here!</p>
                    </form>
                </div>
                <div className="chat-image-container" />
            </div>
        </>
    )
}

export default Login;