const { ObjectId } = require('mongodb');
const db = require('../config/database');

const createChat = (req, res) => {
    const { user, friends } = req.body;
    const friendIds = friends.map(friend => {
        return new ObjectId(friend._id);
    })
    const members = [new ObjectId(user._id), ...friendIds];
    db.then((db, err) => {
        if (err) res.json({ err: err });
        const userCollection = db.collection("users");
        userCollection.find({ _id: { $in: members } }, { projection: { name: 1, username: 1 } }).toArray()
            .then((users, err) => {
                if (err) res.json({ err: err });
                const memberNames = users.map(user => {
                    return user.name
                });
                const roomName = memberNames.join(", ");
                const finalMembers = users.map(user => {
                    return { ...user, roomName: roomName }
                });
                const collection = db.collection("rooms");
                collection.find({ members: finalMembers, name: roomName }).toArray()
                    .then((rooms, err) => {
                        if (err) res.json({ err: err });
                        if (rooms.length !== 0) {
                            res.json(rooms[0]);
                        } else {
                            collection.insertOne({ members: finalMembers, name: roomName })
                                .then(() => res.json({ msg: "Created successfully" }))
                                .catch((err) => res.json({ err: err }));
                        }
                    })
            })
    });
};

const sendMsg = (req, res) => {
    const { room, time, msg, sender } = req.body;
    const roomID = new ObjectId(room._id);
    const members = room.members.filter(m => {
        return m._id !== sender._id
    });
    const memberIDs = members.map(m => { return new ObjectId(m._id) });
    const senderID = new ObjectId(sender._id);
    db.then((db, err) => {
        if (err) res.json({ err: err });
        const collection = db.collection("chats");
        collection.insertOne({ roomId: roomID, sender: { _id: senderID, name: sender.name, username: sender.username }, time: time, content: msg, unread: memberIDs })
            .then(() => res.json({ msg: "Sent successfully" }));
    });
};

const getChats = (req, res) => {
    const { room, user } = req.body;
    const roomID = new ObjectId(room);
    const userID = new ObjectId(user);
    db.then((db, err) => {
        if (err) res.json({ err: err });
        const collection = db.collection("chats");
        collection.updateMany({ roomId: roomID, unread: userID }, { $pull: { unread: userID } });
        collection.find({ roomId: roomID }).toArray()
            .then((chats, err) => {
                if (err) res.json({ err: err });
                res.json(chats);
            });
    });
};

const editChat = (req, res) => {
    const { roomId, name, userId } = req.body;
    const roomID = new ObjectId(roomId);
    const userID = new ObjectId(userId);
    db.then((db, err) => {
        if (err) res.json({ err: err });
        const collection = db.collection("rooms");
        collection.findOne({ _id: roomID }, { projection: { _id: 0, members: 1 } })
            .then((room, err) => {
                if (err) res.json({ err: err });
                const newMembers = room.members.map(m => {
                    if (userID.equals(m._id)) {
                        return { ...m, roomName: name };
                    }
                    return m;
                });
                collection.updateOne({ _id: roomID }, { $set: { members: newMembers } });
                res.json({ msg: "Good" });
            })
    })
};

const inviteFriend = (req, res) => {
    const { room, newMembers } = req.body;
    const roomID = new ObjectId(room._id);
    const newMemberList = newMembers.map(m => { return { _id: new ObjectId(m._id), name: m.name, username: m.username, roomName: room.name } });
    const ogs = room.members.map(m => {return { ...m, _id: new ObjectId(m._id) }});
    const members = [...newMemberList, ...ogs];
    const newRoomName = members.map(m => {return m.name}).join(", ");
    const finalMembers = members.map(m => {
        if(m.roomName === room.name){
            return (
                { ...m, roomName: newRoomName }
            )
        }
        return m;
    });
    db.then((db, err) => {
        if(err) res.json({err: err});
        const collection = db.collection("rooms");
        collection.updateOne({_id: roomID}, {$set: {members: finalMembers, name: newRoomName}});
        res.json({msg: "Good"});
    })

}

const leaveChat = (req, res) => {
    const { room, user } = req.body;
    const roomID = new ObjectId(room._id);
    db.then((db, err) => {
        if(err) res.json({err: err});
        const collection = db.collection("rooms");
        const newMemberList = room.members.filter((f) => {
            return f._id !== user;
        });
        const roomName = newMemberList.map(m => {return m.name}).join(", ");
        const finalMembers = newMemberList.map(m => {
            return {...m, _id: new ObjectId(m._id), roomName: roomName}
        });
        collection.updateOne({_id: roomID}, {$set: {members: finalMembers, name: roomName}});
        res.json({msg: "Good"});
    })
}

module.exports = { createChat, sendMsg, getChats, editChat, inviteFriend, leaveChat };