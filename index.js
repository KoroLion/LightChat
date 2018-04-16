const HTTP_PORT = 8080;
const WS_PORT   = 8081;

const express = require('express');
const WebSocket = require('ws');

//*** Web Server ***
const app = express();

app.use('/', express.static('client'));

app.listen(HTTP_PORT, function () {
    console.log('HTTP server started on port: %i', HTTP_PORT);
});

//*** WebSocket Server ***
const wss = new WebSocket.Server({port: WS_PORT});

let clients = [], id = 1, usernames = {};

function removeClient(id) {
    for (let i = 0; i < clients.length; i++)
        if (clients[i].id == id) {
            clients.splice(i, 1);
            delete usernames[id];
            break;
        }
}

function sendAll(message, id=0) {
    for (let i = 0; i < clients.length; i++)
        if (clients[i].id != id)
            clients[i].send(message);
}

wss.on('connection', function connection(ws) {
    ws.id = id++;
    usernames[ws.id] = null;
    clients.push(ws);

    console.log('%d connected (%s:%i)', ws.id, ws._socket.remoteAddress, ws._socket.remotePort);

    ws.on('message', function (message) {
        if (!usernames[ws.id]) {
            usernames[ws.id] = message;
            console.log('%d authorized as %s', ws.id, usernames[ws.id]);
        }
        else {
            console.log('%s: %s', usernames[ws.id], message);
            sendAll(usernames[ws.id] + ';' + message, ws.id);
        }
    });

    ws.on('close', function (e) {
        console.log('%s (%d) disconnected (%s:%i)', usernames[ws.id], ws.id, ws._socket.remoteAddress, ws._socket.remotePort);
        removeClient(ws.id);
    });
});
console.log('WebSocket server started on port: %i', WS_PORT);
