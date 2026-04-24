import { useState, useEffect } from "react";
import ChatBox from "./ChatBox";
import InputBar from "./InputBar";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

function Chat() {
  const [messages, setMessages] = useState([
    { text: "Welcome 👋", sender: "bot" },
  ]);

  // ✅ Receive messages (ONLY here)
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off("receive_message");
  }, []);

  // ✅ Send message
  const sendMessage = (msg) => {
    if (!msg.trim()) return;

    const messageData = {
      roomId: "room1",
      text: msg,
      sender: "user",
    };

    // send to backend
    socket.emit("send_message", messageData);

    // update UI instantly
    setMessages((prev) => [...prev, messageData]);
  };

  return (
    <div className="flex flex-col h-screen p-4 gap-3">
      <h2 className="text-xl font-semibold">Chat Room</h2>

      <ChatBox messages={messages} />

      <InputBar sendMessage={sendMessage} />
    </div>
  );
}

export default Chat;