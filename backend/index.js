const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // JOIN ROOM
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log("User joined room:", roomId);
  });

  // SEND MESSAGE
  socket.on("send_message", (data) => {
    io.to(data.roomId).emit("receive_message", data);
  });

  // DISCONNECT
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(3001, () => {
  console.log("Server running on port 3001");
});