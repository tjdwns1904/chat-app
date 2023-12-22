const { ObjectId } = require('mongodb');
const db = require('../config/database');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const addFriend = (req, res) => {
    const { userId, friendId } = req.body;
    db.then((db, err) => {
        if (err) res.json({ err: err });
        const collection = db.collection("users");
        const user_id = new ObjectId(userId);
        const friend_id = new ObjectId(friendId);
        collection.updateOne({ _id: user_id }, { $push: { friends: friend_id } });
        res.json({ msg: "Added successfully" });
    })
};

const deleteFriend = (req, res) => {
    //보류
};

const editProfile = (req, res) => {
    const { user, updatedUser } = req.body;
    const id = new ObjectId(user._id);
    db.then((db, err) => {
        if (err) res.json({ err: err });
        const collection = db.collection("users");
        if (user.name !== updatedUser.name) {
            collection.updateOne({ _id: id }, {
                $set: {
                    name: updatedUser.name
                }
            });
            req.session.user = [updatedUser];
            res.json({ msg: "Updated successfully" });
        }
        else if (user.username !== updatedUser.username) {
            collection.find({ username: updatedUser.username }).toArray().then((list) => {
                if (list.length === 0) {
                    collection.updateOne({ _id: id }, {
                        $set: {
                            username: updatedUser.username
                        }
                    });
                    req.session.user = [updatedUser];
                    res.json({ msg: "Updated successfully" });
                } else {
                    res.json({ msg: "Username already exists" });
                }
            });
        }
    });
};

const changePassword = (req, res) => {
    const { user, currPassword, newPassword } = req.body;
    bcrypt.compare(currPassword, user.password).then((match) => {
        if (match) {
            db.then((db, err) => {
                if (err) res.json({ err: err });
                bcrypt.hash(newPassword, saltRounds).then(hash => {
                    const collection = db.collection("users");
                    collection.updateOne({ username: user.username }, { $set: { password: hash } });
                    res.clearCookie('username');
                    req.session.destroy();
                    res.json({ msg: "Password changed" });
                })
            });
        } else {
            res.json({ msg: "Current password doesn't match" });
        }
    })
};

const getUser = (req, res) => {
    const { memberIds } = req.body;
    const memberIDs = memberIds.map(member => {
        return new ObjectId(member._id);
    });
    db.then((db, err) => {
        if (err) res.json({ err: err });
        const collection = db.collection("users");
        collection.find({ _id: { $in: memberIDs } }, { projection: { name: 1 } }).toArray()
            .then((users, err) => {
                if (err) res.json({ err: err });
                res.json(users);
            });
    });
};

module.exports = { addFriend, deleteFriend, editProfile, changePassword, getUser };