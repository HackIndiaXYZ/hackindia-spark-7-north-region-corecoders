// export default function MessageBubble({ text, type, sender }) {
//   const isLeft = type === "user" || type === "ai-me";

//   return (
//     <div className={`flex ${isLeft ? "justify-start" : "justify-end"} mb-3`}>
//       <div>
//         {!isLeft && (
//           <p className="text-xs text-gray-400 mb-1">{sender}</p>
//         )}

//         <div
//           className={`
//             px-4 py-2 rounded-2xl max-w-xs
//             ${isLeft 
//               ? "bg-linear-to-r from-indigo-500 to-purple-600 text-white"
//               : "bg-white/10 border border-white/10"}
//           `}
//         >
//           {text}
//         </div>
//       </div>
//     </div>
//   );
// }

export default function MessageBubble({ text, type, sender }) {
  const isMe = type === "user";

  return (
    <div style={{
      display: "flex",
      justifyContent: isMe ? "flex-end" : "flex-start",
      marginBottom: "12px",
      gap: "8px",
      alignItems: "flex-end",
    }}>

      {/* Avatar for others */}
      {!isMe && (
        <div style={{
          width: 28, height: 28, borderRadius: "50%",
          background: "linear-gradient(135deg, #6366f1, #a855f7)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "11px", fontWeight: 700, flexShrink: 0,
          color: "#fff",
        }}>
          {sender ? sender[0].toUpperCase() : "?"}
        </div>
      )}

      <div style={{ maxWidth: "70%" }}>
        {/* Sender name */}
        {!isMe && sender && (
          <p style={{
            color: "#7b7b9d", fontSize: "11px",
            marginBottom: "4px", marginLeft: "2px",
            fontFamily: "'Exo 2', sans-serif",
          }}>{sender}</p>
        )}

        {/* Bubble */}
        <div style={{
          padding: "10px 16px",
          borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          background: isMe
            ? "linear-gradient(135deg, #6366f1, #a855f7)"
            : "rgba(255,255,255,0.06)",
          border: isMe
            ? "none"
            : "1px solid rgba(255,255,255,0.08)",
          color: "#f0f0ff",
          fontSize: "14px",
          lineHeight: 1.5,
          boxShadow: isMe
            ? "0 4px 20px rgba(99,102,241,0.3)"
            : "none",
          fontFamily: "'Exo 2', sans-serif",
        }}>
          {text}
        </div>
      </div>

    </div>
  );
}