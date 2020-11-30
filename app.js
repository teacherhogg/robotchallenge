const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { validateCommand } = require('./utils/validation');
const { Commands } = require('./utils/commands');

// Test Comment
const publicPath = path.join(__dirname, './public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var commands = new Commands();
const challenge = 'bigone';

app.use(express.static(publicPath));
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
        commands.addCommand(ret.command);
        ret.command.code = 1
        ret.command.text = 'SUCCESS!';
        res.send(ret.command);


    }
})

app.get("/hello", async function (req, res) {
    res.send("<h2>Hello World!</h2>");
})

app.get("/challenge", async function (req, res) {
    if (req && req.query && req.query.challenge) {
        console.log("Challenge Request for " + req.query.challenge);
        let clist = commands.getCommandList(req.query.challenge);
        console.log("HERE is the command list ", clist);
        res.send(clist);
    } else {
        res.send({
            code: 99,
            text: 'Error. No challenge specified!'
        });
    }
})

io.on('connection', (socket) => {
    console.log('New user connected');

    //    console.log('Command List', commands.getCommandList(challenge));


    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server is up on ${port}`);
});
