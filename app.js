const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { validateCommand, validateUser } = require('./utils/validation');
const { Commands } = require('./utils/commands');
const { Users } = require('./utils/users');

// Test Comment
const publicPath = path.join(__dirname, './public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server, {
    cors: {
        origin: '*'
    }
});
var commands = new Commands();
var users = new Users();

app.use(express.static(publicPath));
app.get("/user", async function (req, res) {
    console.log("Got a new user call...", req.query);

    const ret = validateUser(req.query);
    if (!ret || ret.errors) {
        ret.errors.text = 'ERRORS in command.';
        ret.errors.code = 99;
        res.send(ret.errors);
    } else {
        let newobj = users.addUser(ret.data);
        //        if (newobj && newobj.reason !== 'nochange') {
        if (newobj) {
            console.log("ADDED A NEW USER EH!", newobj.user);
            io.emit('newUsers', [newobj.user]);
        }
        ret.data.id = newobj.user.id;
        ret.data.code = 1
        ret.data.text = 'SUCCESS!';
        res.send(ret.data);
    }
})
app.get("/command", async function (req, res) {
    console.log("Got a command call...");

    //    for (let key in req.query) {
    //        console.log("QUERY PARAM " + key + " : " + req.query[key]);
    //    }

    const ret = validateCommand(req.query);
    if (!ret || ret.errors) {
        ret.errors.text = 'ERRORS in command.';
        ret.errors.code = 99;
        res.send(ret.errors)
    } else {
        let id = ret.data.username + "-" + ret.data.usercode;
        let user = users.getUser(id);
        if (!user) {
            ret.data.code = 99;
            ret.data.text = "ERROR getting user " + ret.data.id;
        } else {
            let newcommand = commands.addCommand(user, ret.data.challenge, ret.data.commands);
            //            console.log("SEND TO " + challenge, newcommand);
            io.emit('newCommands', [newcommand]);
            ret.data.code = 1;
            ret.data.text = 'SUCCESS!';
            ret.data.challenge = user.challenge;
        }
        res.send(ret.data);
    }
})

app.get("/hello", async function (req, res) {
    res.send("<h2>Hello World from Heroku on M14d20 at 1:50 PM!</h2>");
})

io.on('connection', (socket) => {
    console.log('New user connected: ', socket.connection);

    socket.on('challenge', (data) => {
        console.log("SERVER TIME challenge with ", data);
        // data is json with key challenge
        if (data && data.challenge) {
            let challenge = data.challenge;

            let ulist = users.getUserList(challenge);
            console.log("SERVER: user list for challenge " + challenge, ulist);
            io.emit('newUsers', ulist);

            let clist = commands.getCommandList(challenge);
            console.log("SERVER: command list for challenge " + challenge, clist);
            io.emit('newCommands', clist);
        }

        //        callback("DUDE");
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server is up on ${port}`);
});
