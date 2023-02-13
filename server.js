const express = require("express");
const http = require("http");
const socketio = require("socket.io");

const {
    userjoin,
    getRoomUsers,
    getUser,
    deleteUser,
} = require("./utils/users");
const { getTime } = require("./utils/messages");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on("connection", (socket) => {
    console.log("One client joined");

    socket.on("userJoined", ({ username, room }) => {
        let user = userjoin(socket.id, username, room);

        //join user to room
        socket.join(room);

        //send welcome to that user
        socket.emit("message", getTime("Masai Server", "Welcome to Masai Server"));

        //broadcast to all other users
        socket.broadcast
            .to(room)
            .emit("message", getTime(username, "Joined the chat"));

        //send all users list
        io.to(room).emit("roomUsers", { users: getRoomUsers(room), room });
    });

    //recieve and send message to all
    socket.on("sendMessage", (message) => {
        let user = getUser(socket.id);

        //send message to same user who is sending
        socket.emit("message", getTime("You", message));
        //send message to everyone except user
        socket.broadcast
            .to(user.room)
            .emit("message", getTime(user.username, message));
    });

    socket.on("disconnect", () => {
        let user = getUser(socket.id);

        io.to(user.room).emit("message", getTime(user.username, "Left the chat"));
        deleteUser(socket.id);
        let allUsers = getRoomUsers(user.room);
        socket.broadcast
            .to(user.room)
            .emit("roomUsers", { users: allUsers, room: user.room });
    });
});

const port = 8080;
server.listen(port, () => {
    console.log("Server is running on port " + port);
});
