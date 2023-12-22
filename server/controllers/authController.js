const db = require('../config/database');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const authenticate = (req, res) => {
    if(req.session.user){
        res.json({isLoggedIn: true, user: req.session.user});
    }else{
        res.json({isLoggedIn: false});
    }
}

const register = (req, res) => {
    const { user } = req.body;
    db.then((db, err) => {
        if(err) res.json({err: err});
        const collection = db.collection("users");
        collection.find({ $or: [{ username: user.username }, { email: user.email }] }).toArray()
            .then((list, err) => {
                if(err) res.json({err: err});
                if (list.length !== 0) {
                    res.json({ msg: "Already exists" });
                } else {
                    bcrypt.hash(user.password, saltRounds).then((hash) => {
                        user.password = hash;
                        collection.insertOne({ ...user, friends: [] })
                            .then(() => res.json({ msg: "Registered successfully" }))
                            .catch((err) => console.log(err));
                    })
                }
            });
    })
        .catch((err) => res.json({ err: err }));
}

const login = (req, res) => {
    const { user } = req.body;
    db.then((db, err)=> {
        if(err) res.json({err: err});
        const collection = db.collection("users");
        collection.find({ email: user.email }).toArray().then((list, err) => {
            if(err) res.json({err: err});
            if (list.length !== 0) {
                bcrypt.compare(user.password, list[0].password)
                    .then((match) => {
                        if (match) {
                            req.session.user = list;
                            res.json({ msg: "Welcome" });
                        } else {
                            res.json({ msg: "Password doesn't match" });
                        }
                    });
            } else {
                res.json({ msg: "Account doesn't exist" });
            }
        });
    });
}

const logout = (req, res) => {
    res.clearCookie('username');
    req.session.destroy();
    res.json({msg: "Logged out successfully"});
}

exports.login = login;
exports.logout = logout;
exports.register = register;
exports.authenticate = authenticate;