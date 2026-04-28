// require("dotenv").config();
// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const cors = require("cors");
// const Groq = require("groq-sdk");

// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// const app = express();
// const allowedOrigins = [
//    "http://localhost:5173",
//    "http://10.212.179.250:5173",
//    /^http:\/\/10\.\d+\.\d+\.\d+:\d+$/,   // 10.x.x.x networks
//   /^http:\/\/192\.168\.\d+\.\d+:\d+$/,  // 192.168.x.x networks
//   /^http:\/\/172\.(1[6-9]|2\d|3[01])\.\d+\.\d+:\d+$/, // 172.16-31.x.x
//    // process.env.FRONTEND_URL,
// ].filter(Boolean);

// app.use(cors({ origin: allowedOrigins }));

// const server = http.createServer(app);
// const io = new Server(server, {
//    cors: { origin: allowedOrigins, methods: ["GET", "POST"] },
// });

// const rooms = {};
// const roomMessages = {};
// const codeToRoomId = {};

// function getIP(socket) {
//    return (
//       socket.handshake.headers["x-forwarded-for"]?.split(",")[0].trim() ||
//       socket.handshake.address
//    );
// }

// function broadcastCount(roomId, toSocket = null) {
//    const count = rooms[roomId]?.members?.size || 0;
//    io.to(roomId).emit("room_count", count);
//    if (toSocket) toSocket.emit("room_count", count);
// }

// io.on("connection", (socket) => {
//    const ip = getIP(socket);

//    // ── CREATE ROOM ──
//    socket.on("create_room", ({ roomName, roomCode, username }, cb) => {
//       const code = roomCode.trim().toLowerCase().replace(/\s+/g, "-");

//       // If room with this code already exists, treat as a rejoin (creator refreshed)
//       if (codeToRoomId[code] && rooms[codeToRoomId[code]]) {
//          const existingRoomId = codeToRoomId[code];
//          const room = rooms[existingRoomId];
//          socket.join(existingRoomId);
//          room.members.set(socket.id, { username, ip });
//          // Update creatorId to new socket (creator refreshed = new socketId)
//          room.creatorId = socket.id;
//          socket.emit("message_history", roomMessages[existingRoomId] || []);
//          broadcastCount(existingRoomId, socket);
//          return cb({
//             success: true,
//             roomId: existingRoomId,
//             roomName: room.name,
//          });
//       }

//       const roomId =
//          roomName.trim().toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();

//       rooms[roomId] = {
//          name: roomName.trim(),
//          code,
//          creatorId: socket.id,
//          kickedIPs: new Set(),
//          members: new Map(),
//       };
//       roomMessages[roomId] = [];
//       codeToRoomId[code] = roomId;

//       socket.join(roomId);
//       rooms[roomId].members.set(socket.id, { username, ip });
//       broadcastCount(roomId, socket);

//       cb({ success: true, roomId, roomName: roomName.trim() });
//       console.log(
//          `Room created: "${roomName}" [id:${roomId}] [code:${code}] by ${username}`,
//       );
//    });

//    // ── JOIN ROOM ──
//    socket.on("join_room", ({ roomCode, username }, cb) => {
//       const code = roomCode.trim().toLowerCase().replace(/\s+/g, "-");
//       const roomId = codeToRoomId[code];

//       if (!roomId || !rooms[roomId])
//          return cb({ error: "Room not found. Check the room code." });

//       const room = rooms[roomId];
//       if (room.kickedIPs.has(ip))
//          return cb({ error: "You have been removed from this room." });

//       socket.join(roomId);
//       room.members.set(socket.id, { username, ip });
//       socket.emit("message_history", roomMessages[roomId] || []);
//       broadcastCount(roomId, socket);
//       socket.to(roomId).emit("user_joined", { username });

//       cb({ success: true, roomId, roomName: room.name });
//       console.log(`${username} joined room "${room.name}" via code "${code}"`);
//    });

//    // ── REJOIN (browser refresh) ──
//    socket.on("rejoin_room", ({ roomId, username }) => {
//       const room = rooms[roomId];
//       if (!room) return;
//       if (room.kickedIPs.has(ip)) return;
//       socket.join(roomId);
//       room.members.set(socket.id, { username, ip });
//       socket.emit("message_history", roomMessages[roomId] || []);
//       broadcastCount(roomId, socket);
//       socket.to(roomId).emit("user_joined", { username });
//    });

//    // ── SEND MESSAGE ──
//    socket.on("send_message", ({ roomId, text, sender }) => {
//       if (!rooms[roomId]) return;
//       const room = rooms[roomId];
//       const msg = {
//          roomId,
//          text,
//          sender,
//          isAdmin: room.creatorId === socket.id,
//          timestamp: Date.now(),
//       };
//       roomMessages[roomId].push(msg);
//       io.to(roomId).emit("receive_message", msg);
//    });

//    // ── AI MESSAGE (@ai trigger) ──
//    socket.on("ai_message", async ({ roomId, message, sender }) => {
//   if (!rooms[roomId]) return;
//   const room = rooms[roomId];

//   console.log("🤖 AI EVENT:", roomId, message);

//   // ✅ 1. Broadcast user's @ai message
//   const userMsg = {
//     roomId,
//     text: message,
//     sender,
//     isAdmin: room.creatorId === socket.id,
//     timestamp: Date.now(),
//   };

//   roomMessages[roomId].push(userMsg);
//   io.to(roomId).emit("receive_message", userMsg);

//   // ✅ 2. Extract prompt
//   const raw = message.replace(/^@ai\s*/i, "").trim();
//   if (!raw) return;

//   const lower = raw.toLowerCase();

//   // ✅ 3. Command detection
//   let systemPrompt = "You are a helpful AI assistant in a group chat.";

//   if (lower.startsWith("summarize")) {
//     systemPrompt = "Summarize the conversation in 3-5 clear bullet points.";
//   } else if (lower.startsWith("explain")) {
//     systemPrompt = "Explain the topic in simple and easy-to-understand terms.";
//   } else if (lower.startsWith("ideas")) {
//     systemPrompt = "Generate creative and practical ideas based on the discussion.";
//   } else if (lower.startsWith("improve")) {
//     systemPrompt = "Rewrite the message in a clearer and more professional way.";
//   }

//   // ✅ 4. Build context (last 10 messages)
//   const history = (roomMessages[roomId] || [])
//     .slice(-10)
//     .map(msg => `${msg.sender}: ${msg.text}`)
//     .join("\n");

//   try {
//     const response = await groq.chat.completions.create({
//       model: "llama-3.3-70b-versatile",
//       messages: [
//         { role: "system", content: systemPrompt },
//         {
//           role: "user",
//           content: `${raw}\n\nContext:\n${history}`,
//         },
//       ],
//       max_tokens: 1024,
//     });

//     const aiReply = response.choices[0].message.content;
//     const timestamp = Date.now();

//     const aiMsg = {
//       roomId,
//       text: aiReply,
//       sender: "AI",
//       isAI: true,
//       replyTo: sender,
//       timestamp,
//     };

//     // ✅ Save in history
//     roomMessages[roomId].push(aiMsg);

//     // ✅ Requester → RIGHT side
//     socket.emit("receive_message", {
//       ...aiMsg,
//       isAIMe: true,
//     });

//     // ✅ Others → LEFT side
//     socket.to(roomId).emit("receive_message", {
//       ...aiMsg,
//       isAIMe: false,
//     });

//   } catch (err) {
//     console.error("Groq API error:", err.message);

//     socket.emit("receive_message", {
//       roomId,
//       text: "⚠️ AI is unavailable right now. Try again.",
//       sender: "AI",
//       isAI: true,
//       isAIMe: true,
//       timestamp: Date.now(),
//     });
//   }
// });

//    // ── KICK USER ──
//    socket.on("kick_user", ({ roomId, targetSocketId }) => {
//       const room = rooms[roomId];
//       if (!room || room.creatorId !== socket.id) return;
//       const target = room.members.get(targetSocketId);
//       if (!target) return;

//       room.kickedIPs.add(target.ip);
//       room.members.delete(targetSocketId);
//       io.to(targetSocketId).emit("kicked");
//       const targetSocket = io.sockets.sockets.get(targetSocketId);
//       if (targetSocket) targetSocket.leave(roomId);
//       io.to(roomId).emit("user_kicked", { username: target.username });
//       broadcastCount(roomId);
//    });

//    // ── CHANGE ROOM CODE ──
//    socket.on("change_code", ({ roomId, newCode }) => {
//       const room = rooms[roomId];
//       if (!room || room.creatorId !== socket.id) return;
//       const normalized = newCode.trim().toLowerCase().replace(/\s+/g, "-");
//       if (codeToRoomId[normalized] && codeToRoomId[normalized] !== roomId) {
//          socket.emit("code_change_error", { error: "Code already in use." });
//          return;
//       }
//       delete codeToRoomId[room.code];
//       room.code = normalized;
//       codeToRoomId[normalized] = roomId;
//       socket.emit("code_changed", { success: true });
//    });

//    // ── GET MEMBERS ──
//    socket.on("get_members", ({ roomId }, cb) => {
//       const room = rooms[roomId];
//       if (!room) return cb([]);
//       const list = Array.from(room.members.entries()).map(
//          ([socketId, data]) => ({
//             socketId,
//             username: data.username,
//             isCreator: room.creatorId === socketId,
//          }),
//       );
//       cb(list);
//    });

//    // ── DISCONNECT ──
//    socket.on("disconnect", () => {
//       for (const [roomId, room] of Object.entries(rooms)) {
//          if (room.members.has(socket.id)) {
//             const { username } = room.members.get(socket.id);
//             room.members.delete(socket.id);
//             broadcastCount(roomId);
//             io.to(roomId).emit("user_left", { username });
//          }
//       }
//    });
// });

// const PORT = process.env.PORT || 3001;
// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


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
  "http://10.212.179.250:5173",
  /^http:\/\/10\.\d+\.\d+\.\d+:\d+$/,
  /^http:\/\/192\.168\.\d+\.\d+:\d+$/,
  /^http:\/\/172\.(1[6-9]|2\d|3[01])\.\d+\.\d+:\d+$/,
].filter(Boolean);

app.use(cors({ origin: allowedOrigins }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: allowedOrigins, methods: ["GET", "POST"] },
});

// ── In-memory state ──
const rooms = {};        // roomId → room object
const roomMessages = {}; // roomId → message[]
const codeToRoomId = {}; // roomCode → roomId
const users = {};
//Signup route
app.post("/signup", async (req, res) => {
  const { email, password, username } = req.body;

  if (users[email]) {
    return res.status(400).json({ error: "User already exists" });
  }

  const hash = await bcrypt.hash(password, 10);

  users[email] = {
    username,
    passwordHash: hash,
  };

  res.json({ success: true });
});

//Login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users[email];
  if (!user) return res.status(400).json({ error: "User not found" });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(400).json({ error: "Wrong password" });

  const token = jwt.sign(
    { email, username: user.username },
    "SECRET_KEY",
    { expiresIn: "7d" }
  );

  res.json({ token, username: user.username });
});
// ── Public rooms registry ──
// Separate from private rooms. Keyed by roomId.
// Each entry: { id, name, icon, creatorSocketId }
const publicRooms = {};

// Pre-seed the static public rooms that existed in PublicRooms.jsx
// These are always "open" — no creator required. They are auto-created on first join.
const STATIC_PUBLIC_ROOMS = [
  { id: "global-chat",  name: "Global Chat",  icon: "🌍" },
  { id: "music-vibes",  name: "Music Vibes",  icon: "🎵" },
  { id: "tech-talk",    name: "Tech Talk",    icon: "💻" },
  { id: "movie-talk",   name: "Movie Talk",   icon: "🎬" },
  { id: "chill-lounge", name: "Chill Lounge", icon: "🛋️" },
  { id: "cnb-lounge",   name: "CNB Lounge",   icon: "🎙️" },
];

// Initialise static rooms so they're always in the registry
STATIC_PUBLIC_ROOMS.forEach(({ id, name, icon }) => {
  rooms[id] = {
    name,
    icon,
    isPublic: true,
    isStatic: true,   // static rooms are never deleted
    code: id,         // code == id for public rooms
    creatorId: null,
    kickedIPs: new Set(),
    members: new Map(),
  };
  roomMessages[id] = [];
  codeToRoomId[id] = id;
  publicRooms[id] = { id, name, icon, memberCount: 0 };
});

// ── Helpers ──
function getIP(socket) {
  return (
    socket.handshake.headers["x-forwarded-for"]?.split(",")[0].trim() ||
    socket.handshake.address
  );
}

function broadcastCount(roomId) {
  const count = rooms[roomId]?.members?.size || 0;
  io.to(roomId).emit("room_count", count);

  // Keep publicRooms registry in sync so get_public_rooms returns fresh counts
  if (publicRooms[roomId]) {
    publicRooms[roomId].memberCount = count;
    // Broadcast updated public room list to everyone subscribed to it
    io.emit("public_rooms_updated", getPublicRoomsList());
  }
}

function getPublicRoomsList() {
  return Object.values(publicRooms).map(r => ({
    id: r.id,
    name: r.name,
    icon: r.icon || "💬",
    memberCount: rooms[r.id]?.members?.size || 0,
  }));
}

// ── REST endpoint so PublicRooms.jsx can fetch room list without a socket ──
app.get("/public-rooms", (req, res) => {
  res.json(getPublicRoomsList());
});

// ── Socket.io ──
io.on("connection", (socket) => {
  const ip = getIP(socket);

  // ── GET PUBLIC ROOMS (socket) ──
  socket.on("get_public_rooms", (cb) => {
    cb(getPublicRoomsList());
  });

  // ── CREATE ROOM ──
  socket.on("create_room", ({ roomName, roomCode, username, isPublic = false }, cb) => {
    const code = roomCode.trim().toLowerCase().replace(/\s+/g, "-");

    // If room with this code already exists, treat as a rejoin
    if (codeToRoomId[code] && rooms[codeToRoomId[code]]) {
      const existingRoomId = codeToRoomId[code];
      const room = rooms[existingRoomId];
      socket.join(existingRoomId);
      room.members.set(socket.id, { username, ip });
      if (!room.isPublic) {
        // Only update creatorId for private rooms
        room.creatorId = socket.id;
      }
      socket.emit("message_history", roomMessages[existingRoomId] || []);
      broadcastCount(existingRoomId);
      return cb({
        success: true,
        roomId: existingRoomId,
        roomName: room.name,
        isPublic: room.isPublic,
      });
    }

    const roomId = isPublic
      ? code  // public rooms use their normalised name as the id for stability
      : code + "-" + Date.now();

    rooms[roomId] = {
      name: roomName.trim(),
      code,
      isPublic,
      creatorId: isPublic ? null : socket.id, // public rooms have no single owner
      kickedIPs: new Set(),
      members: new Map(),
    };
    roomMessages[roomId] = [];
    codeToRoomId[code] = roomId;

    // Register in public rooms list
    if (isPublic) {
      publicRooms[roomId] = {
        id: roomId,
        name: roomName.trim(),
        icon: "💬",
        memberCount: 0,
      };
      io.emit("public_rooms_updated", getPublicRoomsList());
    }

    socket.join(roomId);
    rooms[roomId].members.set(socket.id, { username, ip });
    broadcastCount(roomId);

    cb({
      success: true,
      roomId,
      roomName: roomName.trim(),
      isPublic,
    });

    console.log(
      `Room created: "${roomName}" [id:${roomId}] [public:${isPublic}] by ${username}`
    );
  });

  // ── JOIN PUBLIC ROOM (no code required) ──
  socket.on("join_public_room", ({ roomId, username }, cb) => {
    const room = rooms[roomId];
    if (!room || !room.isPublic) {
      return cb({ error: "Public room not found." });
    }
    if (room.kickedIPs.has(ip)) {
      return cb({ error: "You have been removed from this room." });
    }

    socket.join(roomId);
    room.members.set(socket.id, { username, ip });
    socket.emit("message_history", roomMessages[roomId] || []);
    broadcastCount(roomId);
    socket.to(roomId).emit("user_joined", { username });

    cb({ success: true, roomId, roomName: room.name });
    console.log(`${username} joined public room "${room.name}"`);
  });

  // ── JOIN PRIVATE ROOM (by code) ──
  socket.on("join_room", ({ roomCode, username }, cb) => {
    const code = roomCode.trim().toLowerCase().replace(/\s+/g, "-");
    const roomId = codeToRoomId[code];

    if (!roomId || !rooms[roomId]) {
      return cb({ error: "Room not found. Check the room code." });
    }

    const room = rooms[roomId];

    // Prevent joining a public room via the private join path
    if (room.isPublic) {
      return cb({ error: "This is a public room. Use Join Public Room instead." });
    }

    if (room.kickedIPs.has(ip)) {
      return cb({ error: "You have been removed from this room." });
    }

    socket.join(roomId);
    room.members.set(socket.id, { username, ip });
    socket.emit("message_history", roomMessages[roomId] || []);
    broadcastCount(roomId);
    socket.to(roomId).emit("user_joined", { username });

    cb({ success: true, roomId, roomName: room.name });
    console.log(`${username} joined private room "${room.name}" via code "${code}"`);
  });

  // ── REJOIN (browser refresh) ──
  socket.on("rejoin_room", ({ roomId, username }) => {
    const room = rooms[roomId];
    if (!room) return;
    if (room.kickedIPs.has(ip)) return;
    socket.join(roomId);
    room.members.set(socket.id, { username, ip });
    socket.emit("message_history", roomMessages[roomId] || []);
    broadcastCount(roomId);
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
      // In public rooms there's no single admin, so isAdmin is always false
      isAdmin: !room.isPublic && room.creatorId === socket.id,
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

    const userMsg = {
      roomId,
      text: message,
      sender,
      isAdmin: !room.isPublic && room.creatorId === socket.id,
      timestamp: Date.now(),
    };
    roomMessages[roomId].push(userMsg);
    io.to(roomId).emit("receive_message", userMsg);

    const raw = message.replace(/^@ai\s*/i, "").trim();
    if (!raw) return;

    const lower = raw.toLowerCase();
    let systemPrompt = "You are a helpful AI assistant in a group chat.";
    if (lower.startsWith("summarize")) {
      systemPrompt = "Summarize the conversation in 3-5 clear bullet points.";
    } else if (lower.startsWith("explain")) {
      systemPrompt = "Explain the topic in simple and easy-to-understand terms.";
    } else if (lower.startsWith("ideas")) {
      systemPrompt = "Generate creative and practical ideas based on the discussion.";
    } else if (lower.startsWith("improve")) {
      systemPrompt = "Rewrite the message in a clearer and more professional way.";
    }

    const history = (roomMessages[roomId] || [])
      .slice(-10)
      .map(msg => `${msg.sender}: ${msg.text}`)
      .join("\n");

    try {
      const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `${raw}\n\nContext:\n${history}` },
        ],
        max_tokens: 1024,
      });

      const aiReply = response.choices[0].message.content;
      const timestamp = Date.now();
      const aiMsg = {
        roomId,
        text: aiReply,
        sender: "AI",
        isAI: true,
        replyTo: sender,
        timestamp,
      };

      roomMessages[roomId].push(aiMsg);
      socket.emit("receive_message", { ...aiMsg, isAIMe: true });
      socket.to(roomId).emit("receive_message", { ...aiMsg, isAIMe: false });
    } catch (err) {
      console.error("Groq API error:", err.message);
      socket.emit("receive_message", {
        roomId,
        text: "⚠️ AI is unavailable right now. Try again.",
        sender: "AI",
        isAI: true,
        isAIMe: true,
        timestamp: Date.now(),
      });
    }
  });

  // ── KICK USER (private rooms only) ──
  socket.on("kick_user", ({ roomId, targetSocketId }) => {
    const room = rooms[roomId];
    if (!room || room.isPublic || room.creatorId !== socket.id) return;
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

  // ── CHANGE ROOM CODE (private rooms only) ──
  socket.on("change_code", ({ roomId, newCode }) => {
    const room = rooms[roomId];
    if (!room || room.isPublic || room.creatorId !== socket.id) return;
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
        broadcastCount(roomId);
        io.to(roomId).emit("user_left", { username });

        // Clean up empty non-static public rooms
        if (room.isPublic && !room.isStatic && room.members.size === 0) {
          delete rooms[roomId];
          delete roomMessages[roomId];
          delete codeToRoomId[room.code];
          delete publicRooms[roomId];
          io.emit("public_rooms_updated", getPublicRoomsList());
        }
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));