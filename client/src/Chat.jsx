import { useState } from "react";
import ChatBox from "./ChatBox";
import InputBar from "./InputBar";

function Chat() {
  const [messages, setMessages] = useState([
    { text: "Welcome 👋", sender: "bot" },
  ]);

  const sendMessage = (msg) => {
    setMessages((prev) => [...prev, { text: msg, sender: "user" }]);
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