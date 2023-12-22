const { ObjectId } = require('mongodb');
const db = require('../config/database');

const getUsers = (req, res) => {
    const { userId } = req.body;
    db.then((db, err) => {
        if(err) res.json({err: err});
        const collection = db.collection("users");
        const id = new ObjectId(userId);
        collection.find({_id: {$ne: id}}, {projection: {username: 1, name: 1}}).toArray().then((users, err) => {
            if(err) res.json({err: err});
            res.json(users);
        });
    });
};

const getFriends = (req, res) => {
    const { userId } = req.body;
    db.then((db, err) => {
        if(err) res.json({err: err});
        const collection = db.collection("users");
        const id = new ObjectId(userId);
        collection.findOne({_id: id}, {projection: {friends: 1, _id: 0}}).then((user, err) => {
            if(err) res.json({err: err});
            collection.find({_id: {$in: user.friends}}, {projection: {username: 1, name: 1}}).toArray().then((users, err) => {
                if(err) res.json({err: err});
                res.json(users);
            })
        })
    })
};

const getRooms = (req, res) => {
    const {userId} = req.body;
    db.then((db, err) => {
        if(err) res.json({err: err});
        const collection = db.collection("rooms");
        const id = new ObjectId(userId);
        collection.find({members: {$elemMatch: {_id: id}}}).toArray().then((rooms, err) => {
            if(err) res.json({err: err});
            res.json(rooms);
        });
    });
};

const getRoom = (req, res) => {
    const { roomId } = req.body;
    const roomID = new ObjectId(roomId);
    db.then((db, err) => {
        if(err) res.json({err: err});
        const collection = db.collection("rooms");
        collection.findOne({_id: roomID}).then((room, err) => {
            if(err) res.json({err: err});
            res.json(room);
        })
    })
}

module.exports = { getUsers, getFriends, getRooms, getRoom }; 