var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var path = require('path');
var users = [];

app.use(express.static(path.join(__dirname, 'main')));

io.on('connection', (socket) => {
    // A user joins the chat room, and update user list
    userJoin(socket.id);
    io.emit('userList', users);

    // Send user messages back to client
    socket.on('chatMsg', (msg) => {
        // If user wants to change their username
        if(msg.startsWith("/name")) {
            changeUsername(socket.id, msg);
            io.emit('userList', users);
        // If user wants to change their colour
        } else if(msg.startsWith("/color")) {
            changeUserColour(socket.id, msg);
        // Else, regular message
        } else {
            var user = currentUser(socket.id);
            io.emit('message', userObject(user.username, user.id, user.userColour, msg));
        }
    });

    // A user leaves the chat room, and update user list
    socket.on('disconnect', () => {
        userLeave(socket.id);
        io.emit('userList', users);
    });
});

// Connect via localhost:3000
http.listen(3000, () => {
    console.log('listening on *:3000');
});

// User object
// Time parameter from: https://stackoverflow.com/questions/10599148/how-do-i-get-the-current-time-only-in-javascript
function userObject(username, id, userColour, message) {
    return {
        username,
        id,
        userColour,
        message,
        time: new Date().toLocaleTimeString('en-US', {
            hour12: false, 
            hour: "numeric", 
            minute: "numeric"
        })
    }
}

// When a user joins the chat room, add to user array
function userJoin(id) {
    var username = id.toString();
    var userColour = "FFFFFF";
    var user = {
        id,
        username,
        userColour
    };

    users.push(user);

    return user;
}

// When a user leaves the chat room, remove from user array
// Splice function from: https://stackoverflow.com/questions/5767325/how-can-i-remove-a-specific-item-from-an-array
function userLeave(id) {
    var postion = users.findIndex(user => user.id === id);
    return users.splice(postion, 1);
}

// Return user object for message sent
function currentUser(id) {
    return users.find(user => user.id === id);
}

// Change username function
function changeUsername(id, username) {
    var newUsername = username.slice(6);

    users.find(user => user.id === id).username = newUsername;
}

// Change user colour function
function changeUserColour(id, userColour) {
    var newUserColour = userColour.slice(7);

    users.find(user => user.id === id).userColour = newUserColour;
}