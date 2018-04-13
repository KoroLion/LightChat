function insertMessage(username, message, own=false) {
    let borderClass = 'border-secondary';
    if (own)
        borderClass = 'border-primary';
    
    $('#messages').append('<div class="border ' + borderClass + ' rounded m-2 p-1"><div><strong>' + username + '</strong></div><div>' + message + '</div></div>');
}

$(document).ready(function () {
    let ws = new WebSocket('ws://' + window.location.hostname + ':8081');
    let connected = false;
    let username = '', message = '', data = [];
    
    ws.onopen = function (e) {
        connected = true;
    }
    ws.onmessage = function (e) {
        data = e.data.split(' ');
        insertMessage(data[0], data[1]);
    }
    ws.onclose = function (e) {
        connected = false;
    }
    
    $('#send-btn').click(function() {
        if (connected) {
            username = $('#username-input').val();
            message = $('#message-textarea').val();
            
            if (username && message) {
                ws.send(username + ' ' + message);
                $('#message-textarea').val('');
                insertMessage(username, message, true);
            } 
            else
                alert('Укажите логин и/или введите сообщение!');
        }
        else
            alert('Сервер недоступен!');
    });
});