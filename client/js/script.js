const DEBUG = true;

function scrollToBottom (jquerySel) {
    $(jquerySel).scrollTop($(jquerySel)[0].scrollHeight);
}

function intToXXString (n) {
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

function getUsernameAndMessage(data) {
    let res = [],
        i = data.indexOf(';');

    res[0] = data.substring(0, i);
    res[1] = data.substring(i + 1, data.length);

    return res;
}

function insertMessage (username, message, own=false) {
    let borderClass = 'border-secondary';
    if (own)
        borderClass = 'border-primary';

    username = escapeHtml(username);
    message = linkifyStr(message, {nl2br: true})

    $('#messages').append('<div class="border ' + borderClass + ' rounded m-2 p-1"><div><strong>' + username + '</strong><i class="ml-2">(' + getTime() + ')</i></div><div class="p-1">' + message + '</div></div>');
    scrollToBottom('#messages');
}

$(document).ready(function () {
    let smiles = '😁😂😃😄😅😆😉😊';
    let i = 0;
    while (i < smiles.length) {
        $("#smile-panel").append('<span class="smile-icon">' + smiles[i] + smiles[i + 1] + '</span>');
        i += 2;
    }

    let ws = null;
    try {
        let wsScheme = window.location.protocol == 'https:'? 'wss:': 'ws:';
        ws = new WebSocket(wsScheme + '//' + window.location.hostname + ':' + window.location.port);
    }
    catch (e) {
        alert('ERROR: ' + e.message);
    }
    let connected = false;
    let newline = false;
    let username = '', message = '', data = [];

    if (ws) {
        ws.onopen = function (e) {
            connected = true;
        }
        ws.onmessage = function (e) {
            data = getUsernameAndMessage(e.data);
            insertMessage(data[0], data[1]);
        }
        ws.onclose = function (e) {
            connected = false;
        }
    }

    $('.smile-icon').click(function (e) {
        $('#message-textarea').val($('#message-textarea').val() + $(this).text());
    });

    $('#message-textarea').keydown(function (e) {
        // if not 'shift' pressed - send message, else newline
        if (e.which == 16)
            newline = true;
        else if (e.which == 13) {
            if (!newline) {
                e.preventDefault();
                sendMessage();
            }
        }
    });
    $('#message-textarea').keyup(function (e) {
        if (e.which == 16)
            newline = false;
    });

    function sendMessage() {
        if (connected) {
            message = $('#message-textarea').val();

            if ($('#username-input').val() && message) {
                if (!username) {
                    username = $('#username-input').val();
                    $('#username-input').prop('readonly', true);
                    ws.send(username);
                }

                ws.send(message);
                $('#message-textarea').val('');
                insertMessage(username, message, true);
            }
            else
                alert('Укажите логин и/или введите сообщение!');
        }
        else
            alert('Сервер недоступен!');
    }

    if (DEBUG) {
        for (let i = 0; i < 100; i++) {
            insertMessage(i + '. DEBUG MESSAGE OWN', 'Content test \n"this on new line"\n https://google.com', own=true);
            insertMessage(i + '. DEBUG MESSAGE', '123 test test <b>NOT BOLD!</b>');
        }
    }
});
