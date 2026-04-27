export default function ChatInput({ value, setValue, sendMessage, sendAiMessage }) {
  const isAiMessage = value.trimStart().toLowerCase().startsWith("@ai");

  const handleSend = () => {
    if (!value.trim()) return;
    if (isAiMessage) {
      sendAiMessage(value);
    } else {
      sendMessage();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
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
      <button style={{ background: "none", border: "none", color: "#7b7b9d", cursor: "pointer", fontSize: "18px", padding: "4px", flexShrink: 0 }}>😊</button>

      <div style={{ flex: 1, position: "relative" }}>
        <input
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Type a message... (start with @ai to ask AI)'
          style={{
            width: "100%",
            background: isAiMessage ? "rgba(168,85,247,0.08)" : "rgba(255,255,255,0.05)",
            border: `1px solid ${isAiMessage ? "rgba(168,85,247,0.4)" : "rgba(255,255,255,0.08)"}`,
            borderRadius: "12px",
            color: "#f0f0ff",
            fontFamily: "'Exo 2', sans-serif",
            fontSize: "14px",
            padding: "10px 14px",
            outline: "none",
            transition: "all 0.2s",
            boxShadow: isAiMessage ? "0 0 12px rgba(168,85,247,0.15)" : "none",
          }}
        />
        {/* @ai hint tag */}
        {isAiMessage && (
          <span style={{
            position: "absolute", right: "10px", top: "50%",
            transform: "translateY(-50%)",
            background: "linear-gradient(135deg, #6366f1, #a855f7)",
            color: "#fff", fontSize: "9px", fontWeight: 700,
            padding: "2px 7px", borderRadius: "4px",
            fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.5px",
            pointerEvents: "none",
          }}>AI</span>
        )}
      </div>

      <button
        onClick={handleSend}
        style={{
          width: 38, height: 38,
          borderRadius: "10px",
          background: value.trim()
            ? isAiMessage
              ? "linear-gradient(135deg, #a855f7, #6366f1)"
              : "linear-gradient(135deg, #6366f1, #a855f7)"
            : "rgba(255,255,255,0.05)",
          border: "none",
          color: value.trim() ? "#fff" : "#7b7b9d",
          cursor: value.trim() ? "pointer" : "default",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: isAiMessage ? "14px" : "16px",
          transition: "all 0.2s",
          flexShrink: 0,
          boxShadow: value.trim() ? `0 0 16px rgba(${isAiMessage ? "168,85,247" : "99,102,241"},0.4)` : "none",
        }}
      >
        {isAiMessage ? "🤖" : "➤"}
      </button>
    </div>
  );
}