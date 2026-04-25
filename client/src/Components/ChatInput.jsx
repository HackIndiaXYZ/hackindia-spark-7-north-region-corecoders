// export default function ChatInput({ value, setValue, sendMessage }) {
//   return (
//     <div className="flex gap-2 p-3 bg-white/5 border-t border-white/10">
//       <input
//         value={value}
//         onChange={(e) => setValue(e.target.value)}
//         placeholder="Type a message..."
//         className="flex-1 bg-transparent outline-none px-3"
//       />

//       <button
//         onClick={() => sendMessage(value)}
//         className="px-5 py-2 rounded-full bg-linear-to-r from-indigo-500 to-purple-600 hover:scale-110 transition"
//       >
//         ➤
//       </button>
//     </div>
//   );
// }

export default function ChatInput({ value, setValue, sendMessage }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{
      padding: "14px 16px",
      borderTop: "1px solid rgba(255,255,255,0.06)",
      background: "rgba(10,10,30,0.6)",
      backdropFilter: "blur(16px)",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    }}>

      {/* Emoji btn placeholder */}
      <button style={{
        background: "none", border: "none",
        color: "#7b7b9d", cursor: "pointer",
        fontSize: "18px", padding: "4px",
        flexShrink: 0,
      }}>😊</button>

      {/* Input */}
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        style={{
          flex: 1,
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "12px",
          color: "#f0f0ff",
          fontFamily: "'Exo 2', sans-serif",
          fontSize: "14px",
          padding: "10px 14px",
          outline: "none",
          transition: "border-color 0.2s",
        }}
        onFocus={e => e.target.style.borderColor = "rgba(124,58,237,0.5)"}
        onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
      />

      {/* Send button */}
      <button
        onClick={sendMessage}
        style={{
          width: 38, height: 38,
          borderRadius: "10px",
          background: value.trim()
            ? "linear-gradient(135deg, #6366f1, #a855f7)"
            : "rgba(255,255,255,0.05)",
          border: "none",
          color: value.trim() ? "#fff" : "#7b7b9d",
          cursor: value.trim() ? "pointer" : "default",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "16px",
          transition: "all 0.2s",
          flexShrink: 0,
          boxShadow: value.trim() ? "0 0 16px rgba(99,102,241,0.4)" : "none",
        }}
      >
        ➤
      </button>

    </div>
  );
}