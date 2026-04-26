const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({ origin: allowedOrigins }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: allowedOrigins, methods: ["GET", "POST"] },
});

/**
 * rooms[roomId] = {
 *   name: string,       — display name
 *   code: string,       — secret code (password to enter)
 *   creatorId: string,  — socket.id of creator
 *   kickedIPs: Set,
 *   members: Map(socketId -> { username, ip })
 * }
 * roomMessages[roomId] = [ ...msgs ]
 *
 * roomId  = auto-generated slug from room name (e.g. "my-room")
 * code    = what the user sets (e.g. "secret123") — shared to invite others
 *
 * Joiners only know the CODE. The server looks up the room by code.
 */
const rooms = {};
const roomMessages = {};

// Index: code -> roomId  (so we can look up a room by its code)
const codeToRoomId = {};

function getIP(socket) {
  return (
    socket.handshake.headers["x-forwarded-for"]?.split(",")[0].trim() ||
    socket.handshake.address
  );
}

function broadcastCount(roomId, toSocket = null) {
  const count = rooms[roomId]?.members?.size || 0;
  io.to(roomId).emit("room_count", count);
  // Also send directly to the joining socket in case it isn't in the room yet
  if (toSocket) toSocket.emit("room_count", count);
}

io.on("connection", (socket) => {
  const ip = getIP(socket);

  // ── CREATE ROOM ──
  socket.on("create_room", ({ roomName, roomCode, username }, cb) => {
    // roomId is a slug from the display name
    const roomId = roomName.trim().toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
    const code   = roomCode.trim().toLowerCase().replace(/\s+/g, "-");

    if (codeToRoomId[code]) {
      return cb({ error: "Room code already in use. Please choose another." });
    }

    rooms[roomId] = {
      name: roomName.trim(),
      code,
      creatorId: socket.id,
      kickedIPs: new Set(),
      members: new Map(),
    };
    roomMessages[roomId] = [];
    codeToRoomId[code] = roomId;

    socket.join(roomId);
    rooms[roomId].members.set(socket.id, { username, ip });
    broadcastCount(roomId, socket);

    cb({ success: true, roomId, roomName: roomName.trim() });
    console.log(`Room created: "${roomName}" [id:${roomId}] [code:${code}] by ${username}`);
  });

  // ── JOIN ROOM ──
  socket.on("join_room", ({ roomCode, username }, cb) => {
    const code   = roomCode.trim().toLowerCase().replace(/\s+/g, "-");
    const roomId = codeToRoomId[code];

    if (!roomId || !rooms[roomId]) return cb({ error: "Room not found. Check the room code." });

    const room = rooms[roomId];
    if (room.kickedIPs.has(ip)) return cb({ error: "You have been removed from this room." });

    socket.join(roomId);
    room.members.set(socket.id, { username, ip });

    // Send history to the new joiner only
    socket.emit("message_history", roomMessages[roomId] || []);
    broadcastCount(roomId, socket);

    // Notify others
    socket.to(roomId).emit("user_joined", { username });

    cb({ success: true, roomId, roomName: room.name });
    console.log(`${username} joined room "${room.name}" via code "${code}"`);
  });

  // ── REJOIN (on browser refresh, roomId known but code not needed) ──
  socket.on("rejoin_room", ({ roomId, username }) => {
    const room = rooms[roomId];
    if (!room) return; // room gone (server restart), user stays on error
    const ip = getIP(socket);
    if (room.kickedIPs.has(ip)) return;
    socket.join(roomId);
    room.members.set(socket.id, { username, ip });
    socket.emit("message_history", roomMessages[roomId] || []);
    broadcastCount(roomId, socket);
    socket.to(roomId).emit("user_joined", { username });
  });

  // ── SEND MESSAGE ──
  socket.on("send_message", ({ roomId, text, sender }) => {
    if (!rooms[roomId]) return;
    const room = rooms[roomId];
    const msg  = {
      roomId, text, sender,
      isAdmin: room.creatorId === socket.id,
      timestamp: Date.now(),
    };
    roomMessages[roomId].push(msg);
    io.to(roomId).emit("receive_message", msg);
  });

  // ── KICK USER ──
  socket.on("kick_user", ({ roomId, targetSocketId }) => {
    const room = rooms[roomId];
    if (!room || room.creatorId !== socket.id) return;
    const target = room.members.get(targetSocketId);
    if (!target) return;

    room.kickedIPs.add(target.ip);
    room.members.delete(targetSocketId);

    io.to(targetSocketId).emit("kicked");
    const targetSocket = io.sockets.sockets.get(targetSocketId);
    if (targetSocket) targetSocket.leave(roomId);

    io.to(roomId).emit("user_kicked", { username: target.username });
    broadcastCount(roomId);
  });

  // ── CHANGE ROOM CODE ──
  socket.on("change_code", ({ roomId, newCode }) => {
    const room = rooms[roomId];
    if (!room || room.creatorId !== socket.id) return;
    const normalized = newCode.trim().toLowerCase().replace(/\s+/g, "-");
    if (codeToRoomId[normalized] && codeToRoomId[normalized] !== roomId) {
      socket.emit("code_change_error", { error: "Code already in use." });
      return;
    }
    // Remove old code mapping
    delete codeToRoomId[room.code];
    room.code = normalized;
    codeToRoomId[normalized] = roomId;
    socket.emit("code_changed", { success: true });
  });

  // ── GET MEMBERS (admin) ──
  socket.on("get_members", ({ roomId }, cb) => {
    const room = rooms[roomId];
    if (!room) return cb([]);
    const list = Array.from(room.members.entries()).map(([socketId, data]) => ({
      socketId,
      username: data.username,
      isCreator: room.creatorId === socketId,
    }));
    cb(list);
  });

  // ── DISCONNECT ──
  socket.on("disconnect", () => {
    for (const [roomId, room] of Object.entries(rooms)) {
      if (room.members.has(socket.id)) {
        const { username } = room.members.get(socket.id);
        room.members.delete(socket.id);
        // Broadcast updated count to remaining members only
        broadcastCount(roomId);
        io.to(roomId).emit("user_left", { username });
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server on port ${PORT}`));