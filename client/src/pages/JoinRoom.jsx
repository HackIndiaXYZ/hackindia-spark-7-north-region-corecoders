// import { useState } from "react";
// import Button from "../components/Button";
// import GlassCard from "../components/GlassCard";
// import { useNavigate } from "react-router-dom";

// export default function JoinRoom() {
//   const [code, setCode] = useState("");
//   const navigate = useNavigate();

//   return (
// <div className="
//   min-h-screen flex items-center justify-center px-4
//   bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.25),#020617)]
// ">
//       <GlassCard className="w-full max-w-md space-y-4">

//         <h2 className="text-lg font-semibold">Join Room</h2>

//         <input
//           value={code}
//           onChange={(e) => setCode(e.target.value)}
//           placeholder="Enter room code"
//           className="w-full p-3 rounded-lg bg-white/10 outline-none"
//         />

//         <Button onClick={() => navigate("/chat",{ state: {roomId:code, username:"User" } })}>
//           Join
//         </Button>

//       </GlassCard>
//     </div>
//   );
// }

import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function JoinRoom() {
  const [code, setCode] = useState("");
  const [nickname, setNickname] = useState("");
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="page-wrapper">
      <div className="neon-grid" />

      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}>
        <div style={{ width: "100%", maxWidth: "420px" }}>

          {/* Back */}
          <button
            onClick={() => navigate("/private")}
            style={{
              background: "none", border: "none",
              color: "#7b7b9d", cursor: "pointer",
              fontSize: "13px", marginBottom: "24px",
              display: "flex", alignItems: "center", gap: "6px",
              fontFamily: "'Exo 2', sans-serif",
            }}
          >
            ← Back
          </button>

          <div className="neon-card fade-up" style={{ padding: "36px" }}>

            <h2 style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontWeight: 700, fontSize: "24px",
              color: "#f0f0ff", marginBottom: "6px",
            }}>Join a Room</h2>
            <p style={{ color: "#7b7b9d", fontSize: "13px", marginBottom: "28px" }}>
              Enter the room code to join a private room.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

              <div>
                <label style={{ color: "#7b7b9d", fontSize: "12px", marginBottom: "6px", display: "block", fontWeight: 500, letterSpacing: "0.5px" }}>
                  ROOM CODE
                </label>
                <input
                  className="neon-input"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  placeholder="Enter room code"
                />
              </div>

              <div>
                <label style={{ color: "#7b7b9d", fontSize: "12px", marginBottom: "6px", display: "block", fontWeight: 500, letterSpacing: "0.5px" }}>
                  YOUR NICKNAME
                </label>
                <input
                  className="neon-input"
                  value={nickname}
                  onChange={e => setNickname(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>

              {/* Remember me */}
              <label style={{
                display: "flex", alignItems: "center", gap: "10px",
                cursor: "pointer", color: "#7b7b9d", fontSize: "13px",
              }}>
                <div
                  onClick={() => setRemember(!remember)}
                  style={{
                    width: 18, height: 18, borderRadius: "5px",
                    border: `2px solid ${remember ? "#a855f7" : "rgba(255,255,255,0.2)"}`,
                    background: remember ? "rgba(168,85,247,0.3)" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.2s",
                  }}
                >
                  {remember && <span style={{ color: "#c4b5fd", fontSize: "11px" }}>✓</span>}
                </div>
                Remember me
              </label>

              <button
                className="btn-neon"
                style={{ width: "100%", marginTop: "4px" }}
                onClick={() => navigate("/chat", { state: { roomId: code.trim().toLowerCase().replace(/\s+/g, "-"), username: nickname.trim() || `user-${Date.now()}` } })}
              >
                Join Room
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}