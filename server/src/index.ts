import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  socket: WebSocket;
  room: string;
  username: string;
}

let allSockets: User[] = [];

wss.on("connection", (socket) => {
  socket.on("message", (message) => {
    const parsedMessage = JSON.parse(message as unknown as string);

    if (parsedMessage.type === "join") {
      console.log(
        `User ${parsedMessage.payload.username} joined room ${parsedMessage.payload.roomId}`
      );
      allSockets.push({
        socket,
        room: parsedMessage.payload.roomId,
        username: parsedMessage.payload.username,
      });
    }

    if (parsedMessage.type === "chat") {
      const currentUser = allSockets.find((user) => user.socket === socket);
      if (currentUser) {
        const currentRoom = currentUser.room;
        allSockets.forEach((user) => {
          if (user.room === currentRoom) {
            user.socket.send(
              JSON.stringify({
                message: parsedMessage.payload.message,
                sender: currentUser.username,
              })
            );
          }
        });
      }
    }
  });

  socket.on("close", () => {
    allSockets = allSockets.filter((user) => user.socket !== socket);
  });
});
