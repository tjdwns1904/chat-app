import React, { useState } from "react";
import { Link } from "react-router-dom";
import Loading from "../Loading";
import axios, { } from 'axios';

function SignUp() {
    const [user, setUser] = useState({
        email: "",
        name: "",
        password: "",
        username: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [cPassword, setCPassword] = useState("");
    const [isHidden, setIsHidden] = useState(true);
    const [isCHidden, setIsCHidden] = useState(true);
    const [isNameValid, setIsNameValid] = useState(true);
    const [isUNameValid, setIsUNameValid] = useState(true);
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isPwValid, setIsPwValid] = useState(true);
    const [isCPwValid, setIsCPwValid] = useState(true);
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
    const handleCPwToggle = () => {
        setIsCHidden(prev => !prev);
    };
    const register = () => {
        setIsLoading(true);
        axios.post("http://localhost:3000/auth/signup", {
            user: user
        })
            .then(res => {
                if (res.data.msg) {
                    console.log(res.data.msg);
                    if (res.data.msg.endsWith("successfully")) {
                        window.location.href = "/";
                    }
                } else {
                    console.log(res.data.err);
                }
            })
            .finally(() => {
                setIsLoading(false);
                setIsDisabled(false);
            });
    }
    const validation = () => {
        setIsDisabled(true);
        setIsUNameValid(true);
        setIsNameValid(true);
        setIsPwValid(true);
        setIsCPwValid(true);
        setIsEmailValid(true);
        const emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (user.email !== "" && user.name !== "" && user.password !== "" && cPassword !== "" && user.username != "") {
            if (user.password !== cPassword) {
                setIsCPwValid(false);
                return;
            }
            if (!user.email.match(emailFormat)) {
                setIsEmailValid(false);
                return;
            }
            setIsLoading(true);
            register();
        } else {
            if (user.name === "") {
                setIsNameValid(false);
            } else if (user.username === "") {
                setIsUNameValid(false);
            } else if (user.email === "") {
                setIsEmailValid(false);
            } else if (user.password === "") {
                if (!user.email.match(emailFormat)) {
                    setIsEmailValid(false);
                } else {
                    setIsPwValid(false);
                }
            } else if (cPassword === "") {
                if (!user.email.match(emailFormat)) {
                    setIsEmailValid(false);
                } else {
                    setIsCPwValid(false);
                }
            }
        }
        setIsDisabled(false);
    }
    return (
        <>
            {isLoading && <Loading />}
            <div className="d-flex align-items-center p-5">
                <div className="auth-form">
                    <form action="post">
                        <h2 className="mb-4">Create Account</h2>
                        <div className={isNameValid ? "input-field" : "input-field invalid-input"}>
                            <label>Name</label>
                            <div>
                                <input type="text" name="name" placeholder="Name" autoComplete="off" onChange={(e) => handleChange(e)} />
                            </div>
                        </div>
                        <p className={isNameValid ? "hidden" : "invalid-text"}>Please enter a valid name</p>
                        <div className={isUNameValid ? "input-field" : "input-field invalid-input"}>
                            <label>Username</label>
                            <div>
                                <input type="text" name="username" placeholder="Username" autoComplete="off" onChange={(e) => handleChange(e)} />
                            </div>
                        </div>
                        <p className={isUNameValid ? "hidden" : "invalid-text"}>Please enter a valid username</p>
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
                        <div className={isCPwValid ? "input-field" : "input-field invalid-input"}>
                            <label>Confirm Password</label>
                            <div className="pw-container">
                                <input type={isCHidden ? "password" : "text"} name="cPassword" placeholder="Confirm password" onChange={(e) => setCPassword(e.target.value)} />
                                <button className={isCHidden ? "show-btn" : "hide-btn"} onClick={(e) => {
                                    e.preventDefault();
                                    handleCPwToggle();
                                }} />
                            </div>
                        </div>
                        <p className={isCPwValid ? "hidden" : "invalid-text"}>Passwords don't match</p>
                        <button className={isDisabled ? "auth-btn disabled-btn" : "auth-btn"} onClick={(e) => {
                            e.preventDefault();
                            if(!isDisabled){ validation(); }
                        }}>Sign up</button>
                        <p className="auth-link">Already a member? <Link to={'/'}>Log in</Link> here!</p>
                    </form>
                </div>
                <div className="chat-image-container" />
            </div>
        </>
    )
}

export default SignUp;