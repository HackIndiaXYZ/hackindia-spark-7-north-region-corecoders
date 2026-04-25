// import { useEffect, useState } from "react";
// import io from "socket.io-client";
// import { useLocation } from "react-router-dom";
// import MessageBubble from "./Components/MessageBubble";
// import ChatInput from "./Components/ChatInput";

// const socket = io("http://localhost:3001");

// export default function Chat() {
//   const location = useLocation();
//   const room = location.state?.roomId;
//   const username = location.state?.username;
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);


//   // 🔥 JOIN ROOM
// useEffect(()=>{
//   if(!room) return;
//   socket.emit("join_room",room);
// },[room]);

//   // 🔥 RECEIVE MESSAGE
//   useEffect(() => {
//     socket.on("receive_message", (data) => {
//       let type = "other";

//       if (data.sender === username) {
//         type = "user";
//       }

//       setMessages((prev) => [
//         ...prev,
//         { ...data, type },
//       ]);
//     });

//     return () => socket.off("receive_message");
//   }, [username]);

//   // 🔥 SEND MESSAGE
//   const sendMessage = () => {
//     if (!message.trim()) return;

//     const messageData = {
//       roomId: room,
//       text: message,
//       sender: username,
//     };

//     socket.emit("send_message", messageData);
//     setMessage(""); // clear input
//   };

//   return (
//     <div className="min-h-screen flex justify-center items-center px-4">
//       <div className="w-full max-w-5xl h-[90vh] flex flex-col">

//         {/* 🧊 Chat Container */}
//         <div className="
//           flex-1 overflow-y-auto p-4 
//           bg-white/5 backdrop-blur-xl 
//           border border-white/10 
//           rounded-2xl
//           shadow-[0_0_40px_rgba(0,0,0,0.6)]
//         ">
//           {messages.map((msg, i) => (
//             <MessageBubble
//               key={i}
//               text={msg.text}
//               type={msg.type}
//               sender={msg.sender}
//             />
//           ))}
//         </div>

//         {/* ✏️ Input */}
//         <ChatInput
//           value={message}
//           setValue={setMessage}
//           sendMessage={sendMessage}
//         />
//       </div>
//     </div>
//   );
// }

import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { useLocation, useNavigate } from "react-router-dom";
import MessageBubble from "./Components/MessageBubble";
import ChatInput from "./Components/ChatInput";

export default function Chat() {
  const location = useLocation();
  const navigate = useNavigate();
  const room = location.state?.roomId;
  const username = location.state?.username;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineCount] = useState(() => Math.floor(Math.random() * 50) + 10);
  const bottomRef = useRef();
  const socketRef = useRef(null);

  // 🔥 CONNECT + JOIN + LISTEN — one effect, cleaned up on unmount
  useEffect(() => {
    if (!room) return;

    const socket = io("http://localhost:3001");
    socketRef.current = socket;

    // Join room once connected
    socket.on("connect", () => {
      socket.emit("join_room", room);
    });

    // If socket connected instantly (e.g. fast HMR), emit right away
    if (socket.connected) {
      socket.emit("join_room", room);
    }

    // 🔥 RECEIVE MESSAGE
    socket.on("receive_message", (data) => {
      const type = data.sender === username ? "user" : "other";
      setMessages(prev => [...prev, { ...data, type }]);
    });

    // Cleanup: each user gets their own socket, disconnected on leave
    return () => {
      socket.disconnect();
    };
  }, [room, username]);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔥 SEND MESSAGE
  const sendMessage = () => {
    if (!message.trim() || !socketRef.current) return;
    const messageData = { roomId: room, text: message, sender: username };
    socketRef.current.emit("send_message", messageData);
    setMessage("");
  };

  const roomLabel = room
    ? room.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())
    : "Chat Room";

  return (
    <div className="page-wrapper" style={{
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      overflow: "hidden",
    }}>
      <div className="neon-grid" />

      {/* Header */}
      <div style={{
        position: "relative", zIndex: 1,
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 24px",
        background: "rgba(10,10,30,0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(99,102,241,0.2)",
        boxShadow: "0 0 30px rgba(0,0,0,0.5)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <button
            onClick={() => navigate("/")}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              color: "#c4b5fd",
              cursor: "pointer",
              padding: "6px 10px",
              fontSize: "14px",
              transition: "all 0.2s",
            }}
          >
            ←
          </button>
          <div>
            <div style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontWeight: 700, fontSize: "17px", color: "#f0f0ff",
            }}>{roomLabel}</div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{
                width: 6, height: 6, borderRadius: "50%",
                background: "#22c55e",
                boxShadow: "0 0 6px #22c55e",
              }} />
              <span style={{ color: "#7b7b9d", fontSize: "12px" }}>
                {onlineCount} members online
              </span>
            </div>
          </div>
        </div>

        <div style={{
          display: "flex", alignItems: "center", gap: "10px",
          background: "rgba(99,102,241,0.1)",
          border: "1px solid rgba(99,102,241,0.25)",
          borderRadius: "50px",
          padding: "6px 14px 6px 8px",
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: "50%",
            background: "linear-gradient(135deg, #6366f1, #a855f7)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "12px", fontWeight: 700, color: "#fff",
          }}>
            {username ? username[0].toUpperCase() : "U"}
          </div>
          <span style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontWeight: 600, fontSize: "14px", color: "#c4b5fd",
          }}>
            {username || "User"}
          </span>
        </div>
      </div>

      {/* Messages area */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "20px 24px",
        position: "relative", zIndex: 1,
      }}>
        {messages.length === 0 && (
          <div style={{
            textAlign: "center",
            marginTop: "80px",
            color: "#7b7b9d",
          }}>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>💬</div>
            <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "16px" }}>
              No messages yet. Say hello!
            </p>
          </div>
        )}
        {messages.map((msg, i) => (
          <MessageBubble
            key={i}
            text={msg.text}
            type={msg.type}
            sender={msg.sender}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <ChatInput
          value={message}
          setValue={setMessage}
          sendMessage={sendMessage}
        />
      </div>
    </div>
  );
}