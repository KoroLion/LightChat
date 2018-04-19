const WebServer = require('exjs-simple-server');
let webServer = WebServer.startServer({
    httpPort: 8080,
    httpsPort: 8443,
    sslKeyFile: 'F:/SelfSignedCert/key.pem',
    sslCertFile: 'F:/SelfSignedCert/cert.pem',
    httpRedirect: true
});

const WebSocket = require('ws');

const wss = new WebSocket.Server({
    server: webServer,
});

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
console.log('WebSocket server started on port: %i', webServer.address().port);
