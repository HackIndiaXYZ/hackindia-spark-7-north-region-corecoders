// export default function MessageBubble({ text, type, sender, isAdmin }) {
//   const isMe = type === "user";

//   return (
//     <div style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start", marginBottom: "12px", gap: "8px", alignItems: "flex-end" }}>

//       {/* Avatar for others */}
//       {!isMe && (
//         <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, flexShrink: 0, color: "#fff" }}>
//           {sender ? sender[0].toUpperCase() : "?"}
//         </div>
//       )}

//       <div style={{ maxWidth: "70%" }}>
//         {/* Sender name + admin badge */}
//         {!isMe && sender && (
//           <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px", marginLeft: "2px" }}>
//             <p style={{ color: "#7b7b9d", fontSize: "11px", fontFamily: "'Exo 2', sans-serif" }}>{sender}</p>
//             {isAdmin && (
//               <span style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)", color: "#fff", fontSize: "9px", fontWeight: 700, padding: "1px 5px", borderRadius: "4px", letterSpacing: "0.5px", fontFamily: "'Rajdhani', sans-serif" }}>
//                 ADMIN
//               </span>
//             )}
//           </div>
//         )}

//         {/* Bubble */}
//         <div style={{
//           padding: "10px 16px",
//           borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
//           background: isMe ? "linear-gradient(135deg, #6366f1, #a855f7)" : "rgba(255,255,255,0.06)",
//           border: isMe ? "none" : isAdmin ? "1px solid rgba(168,85,247,0.35)" : "1px solid rgba(255,255,255,0.08)",
//           color: "#f0f0ff",
//           fontSize: "14px",
//           lineHeight: 1.5,
//           boxShadow: isMe ? "0 4px 20px rgba(99,102,241,0.3)" : isAdmin ? "0 0 12px rgba(168,85,247,0.15)" : "none",
//           fontFamily: "'Exo 2', sans-serif",
//         }}>
//           {text}
//         </div>
//       </div>

//     </div>
//   );
// }

export default function MessageBubble({ text, type, sender, isAdmin }) {
  const isMe = type === "user";
  const isAI = sender === "AI"; // 🔥 AI detection

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isMe ? "flex-end" : "flex-start",
        marginBottom: "12px",
        gap: "8px",
        alignItems: "flex-end",
      }}
    >
      {/* Avatar for others (skip for AI) */}
      {!isMe && !isAI && (
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #6366f1, #a855f7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "11px",
            fontWeight: 700,
            flexShrink: 0,
            color: "#fff",
          }}
        >
          {sender ? sender[0].toUpperCase() : "?"}
        </div>
      )}

      {/* 🤖 AI Icon */}
      {isAI && (
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #a855f7, #6366f1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
            flexShrink: 0,
            boxShadow: "0 0 10px rgba(168,85,247,0.6)",
          }}
        >
          🤖
        </div>
      )}

      <div style={{ maxWidth: "70%" }}>
        {/* Sender name */}
        {!isMe && sender && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              marginBottom: "4px",
              marginLeft: "2px",
            }}
          >
            <p
              style={{
                color: isAI ? "#c084fc" : "#7b7b9d",
                fontSize: "11px",
                fontFamily: "'Exo 2', sans-serif",
              }}
            >
              {isAI ? "AI Assistant" : sender}
            </p>

            {isAdmin && !isAI && (
              <span
                style={{
                  background: "linear-gradient(135deg, #6366f1, #a855f7)",
                  color: "#fff",
                  fontSize: "9px",
                  fontWeight: 700,
                  padding: "1px 5px",
                  borderRadius: "4px",
                  letterSpacing: "0.5px",
                  fontFamily: "'Rajdhani', sans-serif",
                }}
              >
                ADMIN
              </span>
            )}
          </div>
        )}

        {/* Bubble */}
        <div
          style={{
            padding: "10px 16px",
            borderRadius: isMe
              ? "18px 18px 4px 18px"
              : "18px 18px 18px 4px",

            // 🔥 DIFFERENT BACKGROUNDS
            background: isMe && !isAI
              ? "linear-gradient(135deg, #6366f1, #a855f7)"  // my messages
              : isAI
              ? "linear-gradient(135deg, rgba(168,85,247,0.15), rgba(99,102,241,0.15))"  // AI (both sides)
              : "rgba(255,255,255,0.06)",

            border: isMe
              ? "none"
              : isAI
              ? "1px solid rgba(168,85,247,0.4)"
              : isAdmin
              ? "1px solid rgba(168,85,247,0.35)"
              : "1px solid rgba(255,255,255,0.08)",

            color: "#f0f0ff",
            fontSize: "14px",
            lineHeight: 1.5,
            fontFamily: "'Exo 2', sans-serif",

            // 🔥 GLOW EFFECT
            boxShadow: isMe
              ? "0 4px 20px rgba(99,102,241,0.3)"
              : isAI
              ? "0 0 15px rgba(168,85,247,0.35)"
              : isAdmin
              ? "0 0 12px rgba(168,85,247,0.15)"
              : "none",
          }}
        >
          {text}
        </div>
      </div>
    </div>
  );
}