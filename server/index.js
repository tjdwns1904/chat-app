const express = require('express');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors');
const app = express();
const port = 3000;
const SECRET = "hello";
const timeStamp = new Date().getTime();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true
}));
app.use(session({
    key: "username",
    secret: SECRET,
    resave: false,
    saveUninitialized: false,
    cookie:{
        maxAge: timeStamp + (60 * 60 * 1000 * 24)
    }
}));

app.use("/auth", require('./routes/auth'));
app.use("/user", require('./routes/user'));
app.use("/chat", require("./routes/chat"));
app.use("/", require('./routes/fetch'));

app.listen(port, () => {
    console.log("Connected");
});