var socket = io();
var msgForm = document.getElementById('msgForm');
var msgList = document.getElementById('messages');
var users = document.getElementById('users');

// Submit message to server
msgForm.addEventListener('submit', (e) => {
    e.preventDefault();
    var msg = e.target.elements.msg.value;
    socket.emit('chatMsg', msg);

    // Clear text field, and set as focus
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

// Receive message from server, and append to message window
socket.on('message', message => {
    var div = document.createElement('div');
    div.classList.add('message');

    // Bold user's own messages, leaving others with normal formatting
    if(message.id === socket.id) {
        div.innerHTML = `<b>${message.time} <span style="color: #${message.userColour}">${message.username}</span>: ${message.message}</b>`;
    } else {
        div.innerHTML = `${message.time} <span style="color: #${message.userColour}">${message.username}</span>: ${message.message}`;
    }

    msgList.appendChild(div);

    // Scroll message window to the bottom
    msgList.scrollTop = msgList.scrollHeight;
});

// Get updated user list
socket.on('userList', usersList => {
    users.innerHTML = '';
    usersList.forEach(user => {
        var div = document.createElement('div');

        // Show which user you are in the list
        if(user.id === socket.id) {
            div.innerHTML = `<b>${user.username} (YOU)</b>`;
        } else {
            div.innerHTML = user.username;
        }

        users.appendChild(div);
    });
});