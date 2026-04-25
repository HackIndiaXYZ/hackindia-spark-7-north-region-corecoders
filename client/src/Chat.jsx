import { useEffect, useState } from "react";
import io from "socket.io-client";

import MessageBubble from "./Components/MessageBubble";
import ChatInput from "./Components/ChatInput";

const socket = io("http://localhost:3001");

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState("");
  const [username, setUsername] = useState("");

  // 🔥 JOIN ROOM
useEffect(() => {
  const roomId = prompt("Enter room ID:");
  const name = prompt("Enter your name:");

  if (!roomId || !name) return;

  socket.emit("join_room", roomId);

  setTimeout(() => {
    setRoom(roomId);
    setUsername(name);
  }, 0);

}, []);

  // 🔥 RECEIVE MESSAGE
  useEffect(() => {
    socket.on("receive_message", (data) => {
      let type = "other";

      if (data.sender === username) {
        type = "user";
      }

      setMessages((prev) => [
        ...prev,
        { ...data, type },
      ]);
    });

    return () => socket.off("receive_message");
  }, [username]);

  // 🔥 SEND MESSAGE
  const sendMessage = () => {
    if (!message.trim()) return;

    const messageData = {
      roomId: room,
      text: message,
      sender: username,
      type: "user",
    };

    socket.emit("send_message", messageData);
    setMessage(""); // clear input
  };

  return (
    <div className="min-h-screen flex justify-center items-center px-4">
      <div className="w-full max-w-5xl h-[90vh] flex flex-col">

        {/* 🧊 Chat Container */}
        <div className="
          flex-1 overflow-y-auto p-4 
          bg-white/5 backdrop-blur-xl 
          border border-white/10 
          rounded-2xl
          shadow-[0_0_40px_rgba(0,0,0,0.6)]
        ">
          {messages.map((msg, i) => (
            <MessageBubble
              key={i}
              text={msg.text}
              type={msg.type}
              sender={msg.sender}
            />
          ))}
        </div>

        {/* ✏️ Input */}
        <ChatInput
          value={message}
          setValue={setMessage}
          sendMessage={sendMessage}
        />
      </div>
    </div>
  );
}