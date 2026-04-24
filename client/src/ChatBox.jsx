import { useEffect, useRef } from "react";
import Message from "./Message";

function ChatBox({ messages }) {
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 rounded-xl bg-white/5 backdrop-blur-md shadow-inner space-y-2">
      {messages.map((msg, i) => (
        <Message key={i} {...msg} />
      ))}
      <div ref={bottomRef}></div>
    </div>
  );
}

export default ChatBox;