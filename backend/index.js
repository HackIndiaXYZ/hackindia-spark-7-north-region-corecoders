require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const app = express();
const allowedOrigins = [
   "http://localhost:5173",
   // process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({ origin: allowedOrigins }));

const server = http.createServer(app);
const io = new Server(server, {
   cors: { origin: allowedOrigins, methods: ["GET", "POST"] },
});

const rooms = {};
const roomMessages = {};
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
   if (toSocket) toSocket.emit("room_count", count);
}

io.on("connection", (socket) => {
   const ip = getIP(socket);

   // ── CREATE ROOM ──
   socket.on("create_room", ({ roomName, roomCode, username }, cb) => {
      const code = roomCode.trim().toLowerCase().replace(/\s+/g, "-");

      // If room with this code already exists, treat as a rejoin (creator refreshed)
      if (codeToRoomId[code] && rooms[codeToRoomId[code]]) {
         const existingRoomId = codeToRoomId[code];
         const room = rooms[existingRoomId];
         socket.join(existingRoomId);
         room.members.set(socket.id, { username, ip });
         // Update creatorId to new socket (creator refreshed = new socketId)
         room.creatorId = socket.id;
         socket.emit("message_history", roomMessages[existingRoomId] || []);
         broadcastCount(existingRoomId, socket);
         return cb({
            success: true,
            roomId: existingRoomId,
            roomName: room.name,
         });
      }

      const roomId =
         roomName.trim().toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();

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
      console.log(
         `Room created: "${roomName}" [id:${roomId}] [code:${code}] by ${username}`,
      );
   });

   // ── JOIN ROOM ──
   socket.on("join_room", ({ roomCode, username }, cb) => {
      const code = roomCode.trim().toLowerCase().replace(/\s+/g, "-");
      const roomId = codeToRoomId[code];

      if (!roomId || !rooms[roomId])
         return cb({ error: "Room not found. Check the room code." });

      const room = rooms[roomId];
      if (room.kickedIPs.has(ip))
         return cb({ error: "You have been removed from this room." });

      socket.join(roomId);
      room.members.set(socket.id, { username, ip });
      socket.emit("message_history", roomMessages[roomId] || []);
      broadcastCount(roomId, socket);
      socket.to(roomId).emit("user_joined", { username });

      cb({ success: true, roomId, roomName: room.name });
      console.log(`${username} joined room "${room.name}" via code "${code}"`);
   });

   // ── REJOIN (browser refresh) ──
   socket.on("rejoin_room", ({ roomId, username }) => {
      const room = rooms[roomId];
      if (!room) return;
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
      const msg = {
         roomId,
         text,
         sender,
         isAdmin: room.creatorId === socket.id,
         timestamp: Date.now(),
      };
      roomMessages[roomId].push(msg);
      io.to(roomId).emit("receive_message", msg);
   });

   // ── AI MESSAGE (@ai trigger) ──
   socket.on("ai_message", async ({ roomId, message, sender }) => {
      if (!rooms[roomId]) return;
      const room = rooms[roomId];
      console.log("🤖 AI EVENT:", roomId, message);
      // Broadcast the user's own @ai message to everyone first
      const userMsg = {
         roomId,
         text: message,
         sender,
         isAdmin: room.creatorId === socket.id,
         timestamp: Date.now(),
      };
      roomMessages[roomId].push(userMsg);
      io.to(roomId).emit("receive_message", userMsg);

      const prompt = message.replace(/^@ai\s*/i, "").trim();
      if (!prompt) return;

      try {
         const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 1024,
         });

         const aiReply = response.choices[0].message.content;
         const timestamp = Date.now();

         // Save one copy in history
         roomMessages[roomId].push({
            roomId,
            text: aiReply,
            sender: "AI",
            isAI: true,
            replyTo:sender,
            timestamp,
         });

         // Requester sees AI reply on the RIGHT
         socket.emit("receive_message", {
            roomId,
            text: aiReply,
            sender: "AI",
            isAI: true,
            isAIMe: true,
            timestamp,
         });

         // Everyone else sees AI reply on the LEFT
         socket.to(roomId).emit("receive_message", {
            roomId,
            text: aiReply,
            sender: "AI",
            isAI: true,
            isAIMe: false,
            timestamp,
         });
      } catch (err) {
         console.error("Groq API error:", err.message);
         socket.emit("receive_message", {
            roomId,
            text: "AI is unavailable right now. Please try again later.",
            sender: "AI",
            isAI: true,
            isAIMe: true,
            timestamp: Date.now(),
         });
      }
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
      delete codeToRoomId[room.code];
      room.code = normalized;
      codeToRoomId[normalized] = roomId;
      socket.emit("code_changed", { success: true });
   });

   // ── GET MEMBERS ──
   socket.on("get_members", ({ roomId }, cb) => {
      const room = rooms[roomId];
      if (!room) return cb([]);
      const list = Array.from(room.members.entries()).map(
         ([socketId, data]) => ({
            socketId,
            username: data.username,
            isCreator: room.creatorId === socketId,
         }),
      );
      cb(list);
   });

   // ── DISCONNECT ──
   socket.on("disconnect", () => {
      for (const [roomId, room] of Object.entries(rooms)) {
         if (room.members.has(socket.id)) {
            const { username } = room.members.get(socket.id);
            room.members.delete(socket.id);
            broadcastCount(roomId);
            io.to(roomId).emit("user_left", { username });
         }
      }
   });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
