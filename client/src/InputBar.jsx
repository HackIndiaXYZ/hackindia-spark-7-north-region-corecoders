import { useState } from "react";

function InputBar({ sendMessage }) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;
    sendMessage(message);
    setMessage("");
  };

  return (
    <div className="flex gap-2 p-3 bg-white/10 backdrop-blur-md rounded-xl shadow-lg">
      <input
        className="flex-1 p-3 rounded-full bg-white/20 outline-none focus:ring-2 focus:ring-blue-500 transition"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type message..."
      />

      <button
        onClick={handleSend}
        className="px-5 py-2 rounded-full bg-linear-to-r from-blue-500 to-purple-600 hover:scale-110 transition"
      >
        Send
      </button>
    </div>
  );
}

export default InputBar;