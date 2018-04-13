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

let clients = [], id = 1;

function removeClient(id) {
    for (let i = 0; i < clients.length; i++)
        if (clients[i].id == id) {
            clients.splice(i, 1);
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
    clients.push(ws);
    
    ws.on('message', function (message) {
        console.log('received %s', message);
        sendAll(message, ws.id);
    });
    ws.on('close', function (e) {
        console.log(ws.id + ' disconnected!');
        removeClient(ws.id);
    });
});
console.log('WebSocket server started on port: %i', WS_PORT);