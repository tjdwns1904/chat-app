import axios from "axios";
import React, { useState } from "react";
import Loading from "../Loading";

function Profile({ user }) {
    const [updatedUser, setUpdatedUser] = useState(user);
    const [isLoading, setIsLoading] = useState(false);
    const [currPassword, setCurrPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [cPassword, setCPassword] = useState("");
    const [isNameEdit, setIsNameEdit] = useState(false);
    const [isUsernameEdit, setIsUsernameEdit] = useState(false);
    const [isPwEdit, setIsPwEdit] = useState(false);
    const [isPwValid, setIsPwValid] = useState(true);
    const [isUsernameValid, setIsUsernameValid] = useState(true);
    const [isNameValid, setIsNameValid] = useState(true);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedUser(prev => {
            return (
                {
                    ...prev,
                    [name]: value
                }
            );
        });
    };

    const editProfile = () => {
        setIsLoading(true);
        setIsNameValid(true);
        setIsUsernameValid(true);
        if (updatedUser.name !== "" && updatedUser.username !== "") {
            axios.post("http://localhost:3000/user/update", {
                user: user,
                updatedUser: updatedUser
            })
                .then(res => {
                    if (res.data.msg) {
                        if (res.data.msg.endsWith("successfully")) {
                            window.location.reload();
                        } else {
                            console.log(res.data.msg)
                        }
                    }else{
                        console.log(res.data.err);
                    }
                })
                .finally(() => setIsLoading(false));
        } else {
            if (updatedUser.name === "") {
                setIsNameValid(false);
            } else {
                setIsUsernameValid(false);
            }
            setUpdatedUser(user);
            setIsLoading(false);
        }
    };

    const changePassword = () => {
        setIsLoading(true);
        setIsPwValid(true);
        if (newPassword === cPassword) {
            axios.post("http://localhost:3000/user/changepw", {
                user: user,
                currPassword: currPassword,
                newPassword: newPassword
            })
                .then(res => {
                    if (res.data.msg) {
                        if (res.data.msg.endsWith("changed")) {
                            window.location.href = "/";
                        } else {
                            setIsPwValid(false);
                        }
                    }
                })
                .finally(() => setIsLoading(false));
        } else {
            setIsPwValid(false);
            setIsLoading(false);
        }
    };
    return (
        <>
            {isLoading && <Loading />}
            <div className="profile-container">
                <h2>Profile</h2>
                <div className="main-container">
                    <div className="profile-lg-img">
                        <label htmlFor="profile-image">
                            <div className="img-edit-btn" />
                        </label>
                        <input type="file" name="" id="profile-image" />
                    </div>
                    {isNameEdit ?
                        <div className="mt-3">
                            <input type="text" name="name" id="" defaultValue={user.name} onChange={(e) => handleChange(e)} />
                            <button className="update-btn ms-2" onClick={editProfile}>Edit</button>
                            <button className="cancel-btn" onClick={() => {
                                setIsNameEdit(false);
                                setUpdatedUser(user);
                            }}>Cancel</button>
                            <p className={isNameValid ? "hidden" : "invalid-text font-small ms-4"}>Please enter a valid name</p>
                        </div>
                        :
                        <h2 onClick={() => {
                            setIsNameEdit(true);
                            setIsNameValid(true);
                        }}>{user.name}</h2>
                    }
                    <div className="mt-5">
                        <div className="username-container">
                            <p className="section-title">Username</p>
                            <div className="d-flex align-items-center justify-content-between">
                                {isUsernameEdit ?
                                    <div>
                                        <input type="text" name="username" id="" defaultValue={user.username} onChange={(e) => handleChange(e)} />
                                        <p className={isUsernameValid ? "hidden" : "invalid-text font-small"}>Please enter a valid username</p>
                                    </div>
                                    :
                                    <p>{user.username}</p>}
                                {isUsernameEdit ?
                                    <div className="d-flex mb-5">
                                        <button className="update-btn" onClick={editProfile}>Edit</button>
                                        <button className="cancel-btn" onClick={() => {
                                            setIsUsernameEdit(false);
                                            setUpdatedUser(user);
                                        }}>Cancel</button>
                                    </div>
                                    :
                                    <button className="edit-btn" onClick={() => {
                                        setIsUsernameEdit(true);
                                        setIsUsernameValid(true);
                                    }} />
                                }
                            </div>
                        </div>
                        <div className="email-container">
                            <p className="section-title">Email</p>
                            <p>{user.email}</p>
                        </div>
                        <div className="password-container">
                            <p className="section-title">Password</p>
                            {isPwEdit ?
                                <div>
                                    <input className="mb-2" type="password" name="password" id="" placeholder="Current password" onChange={(e) => {
                                        setCurrPassword(e.target.value);
                                    }} />
                                    <input className="mb-2" type="password" name="nPassword" id="" placeholder="New password" onChange={(e) => {
                                        setNewPassword(e.target.value);
                                    }} />
                                    <input type="password" name="cPassword" id="" placeholder="Confirm new password" onChange={(e) => {
                                        setCPassword(e.target.value);
                                    }} />
                                    <p className={isPwValid ? "hidden" : "invalid-text"}>Please enter a valid password</p>
                                    <div className="mt-3">
                                        <button className="update-btn" onClick={changePassword}>Change</button>
                                        <button className="cancel-btn" onClick={() => setIsPwEdit(false)}>Cancel</button>
                                    </div>
                                </div>
                                :
                                <p className="password-edit" onClick={() => {
                                    setIsPwEdit(true);
                                    setIsPwValid(true);
                                }}>Change Password</p>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile;