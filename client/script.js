const DEBUG = true;

function scrollToBottom(jquerySel) {

}

let entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;',
    '\n': '<br />'
};

function escapeHtml (string) {
    return String(string).replace(/[&<>"'`=\//\n/]/g, function (s) {
        return entityMap[s];
    });
}

function intToXXString(n) {
    n = n.toString();
    if (n.length < 2)
        n = "0" + n;
    return n;
}

function getTime () {
    let d = new Date();

    let h = intToXXString(d.getHours());
    let m = intToXXString(d.getMinutes());
    let s = intToXXString(d.getSeconds());

    return h + ":" + m + ":" + s;
}

function insertMessage (username, message, own=false) {
    let borderClass = 'border-secondary';
    if (own)
        borderClass = 'border-primary';

    username = escapeHtml(username);
    message = escapeHtml(message);

    $('#messages').append('<div class="border ' + borderClass + ' rounded m-2 p-1"><div><strong>' + username + '</strong><i class="ml-2">(' + getTime() + ')</i></div><div>' + message + '</div></div>');
    $('#messages').scrollTop($('#messages')[0].scrollHeight);
}

$(document).ready(function () {
    let ws = new WebSocket('ws://' + window.location.hostname + ':8081');
    let connected = false;
    let newline = false;
    let username = '', message = '', data = [];

    ws.onopen = function (e) {
        connected = true;
    }
    ws.onmessage = function (e) {
        data = e.data.split(':');
        insertMessage(data[0], data[1]);
    }
    ws.onclose = function (e) {
        connected = false;
    }

    $('#message-textarea').keydown(function (e) {
        // if not 'shift' pressed - send message, else newline
        if (e.which == 16)
            newline = true;
        else if (e.which == 13) {
            if (!newline) {
                e.preventDefault();
                $('#send-btn').click();
            }
        }
    });
    $('#message-textarea').keyup(function (e) {
        if (e.which == 16)
            newline = false;
    });

    $('#send-btn').click(function() {
        if (connected) {
            username = $('#username-input').val();
            message = $('#message-textarea').val();

            if (username && message) {
                ws.send(username + ':' + message);
                $('#message-textarea').val('');
                insertMessage(username, message, true);
            }
            else
                alert('Укажите логин и/или введите сообщение!');
        }
        else
            alert('Сервер недоступен!');
    });

    if (DEBUG) {
        for (let i = 0; i < 100; i++) {
            insertMessage(i + '. DEBUG MESSAGE OWN', 'Content test \n"this on new line"', own=true);
            insertMessage(i + '. DEBUG MESSAGE', '123 test test <b>NOT BOLD!</b>');
        }
    }
});
