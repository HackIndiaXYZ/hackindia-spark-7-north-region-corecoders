import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function JoinRoom() {
  const [code, setCode] = useState("");
  const [nickname, setNickname] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleJoin = () => {
    if (!code.trim() || !nickname.trim()) {
      setError("Both fields are required.");
      return;
    }
    navigate("/chat", {
      state: {
        roomCode: code.trim().toLowerCase().replace(/\s+/g, "-"),
        username: nickname.trim(),
        isCreating: false,
      },
    });
  };

  return (
    <div className="page-wrapper">
      <div className="neon-grid" />
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{ width: "100%", maxWidth: "420px" }}>

          <button onClick={() => navigate("/private")} style={{ background: "none", border: "none", color: "#7b7b9d", cursor: "pointer", fontSize: "13px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "6px", fontFamily: "'Exo 2', sans-serif" }}>
            ← Back
          </button>

          <div className="neon-card fade-up" style={{ padding: "36px" }}>

            <h2 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "24px", color: "#f0f0ff", marginBottom: "6px" }}>Join a Room</h2>
            <p style={{ color: "#7b7b9d", fontSize: "13px", marginBottom: "28px" }}>Enter the room code to join a private room.</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

              <div>
                <label style={{ color: "#7b7b9d", fontSize: "12px", marginBottom: "6px", display: "block", fontWeight: 500, letterSpacing: "0.5px" }}>YOUR NICKNAME</label>
                <input className="neon-input" value={nickname} onChange={e => { setNickname(e.target.value); setError(""); }} placeholder="Enter your name" />
              </div>

              <div>
                <label style={{ color: "#7b7b9d", fontSize: "12px", marginBottom: "6px", display: "block", fontWeight: 500, letterSpacing: "0.5px" }}>ROOM CODE</label>
                <input
                  className="neon-input"
                  value={code}
                  onChange={e => { setCode(e.target.value); setError(""); }}
                  placeholder="Enter room code"
                  type="password"
                />
              </div>

              {error && <p style={{ color: "#f87171", fontSize: "12px" }}>{error}</p>}

              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", color: "#7b7b9d", fontSize: "13px" }}>
                <div
                  onClick={() => setRemember(!remember)}
                  style={{ width: 18, height: 18, borderRadius: "5px", border: `2px solid ${remember ? "#a855f7" : "rgba(255,255,255,0.2)"}`, background: remember ? "rgba(168,85,247,0.3)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
                >
                  {remember && <span style={{ color: "#c4b5fd", fontSize: "11px" }}>✓</span>}
                </div>
                Remember me
              </label>

              <button className="btn-neon" style={{ width: "100%", marginTop: "4px" }} onClick={handleJoin}>
                Join Room
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}