"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let allSockets = [];
wss.on('connection', (socket) => {
    socket.on("message", (message) => {
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.type == "join") {
            console.log(`User ${parsedMessage.payload.username} joined room ${parsedMessage.payload.roomId}`);
            allSockets.push({
                socket,
                room: parsedMessage.payload.roomId,
                username: parsedMessage.payload.username
            });
        }
        if (parsedMessage.type == "chat") {
            console.log("user want to chat");
            let currentUser = allSockets.find((user) => user.socket === socket);
            if (currentUser) {
                const currentRoom = currentUser.room;
                allSockets.forEach((user) => {
                    if (user.room === currentRoom) {
                        user.socket.send(JSON.stringify({
                            message: parsedMessage.payload.message,
                            sender: currentUser.username
                        }));
                    }
                });
            }
        }
    });
    socket.on("close", () => {
        allSockets = allSockets.filter((user) => user.socket !== socket);
    });
});
