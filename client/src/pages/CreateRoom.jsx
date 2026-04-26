import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateRoom() {
  const [roomName, setRoomName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCreate = () => {
    if (!roomName.trim() || !roomCode.trim() || !nickname.trim()) {
      setError("All fields are required.");
      return;
    }
    const normalizedCode = roomCode.trim().toLowerCase().replace(/\s+/g, "-");
    navigate("/chat", {
      state: {
        roomCode: normalizedCode,
        roomName: roomName.trim(),
        username: nickname.trim(),
        isCreating: true,
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
            <h2 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "24px", color: "#f0f0ff", marginBottom: "6px" }}>Create a Room</h2>
            <p style={{ color: "#7b7b9d", fontSize: "13px", marginBottom: "28px" }}>Create a private room and invite others.</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

              <div>
                <label style={{ color: "#7b7b9d", fontSize: "12px", marginBottom: "6px", display: "block", fontWeight: 500, letterSpacing: "0.5px" }}>YOUR NICKNAME</label>
                <input className="neon-input" value={nickname} onChange={e => { setNickname(e.target.value); setError(""); }} placeholder="Enter your nickname" />
              </div>

              <div>
                <label style={{ color: "#7b7b9d", fontSize: "12px", marginBottom: "6px", display: "block", fontWeight: 500, letterSpacing: "0.5px" }}>ROOM NAME</label>
                <input className="neon-input" value={roomName} onChange={e => { setRoomName(e.target.value); setError(""); }} placeholder="Display name for the room" />
              </div>

              <div>
                <label style={{ color: "#7b7b9d", fontSize: "12px", marginBottom: "6px", display: "block", fontWeight: 500, letterSpacing: "0.5px" }}>
                  ROOM CODE
                  <span style={{ color: "#7b7b9d", fontWeight: 400, marginLeft: "6px", fontSize: "11px" }}>
                    — share this with people you want to invite
                  </span>
                </label>
                <input
                  className="neon-input"
                  value={roomCode}
                  onChange={e => { setRoomCode(e.target.value); setError(""); }}
                  placeholder="e.g. my-secret-room"
                  type="password"
                />
                {roomCode.trim() && (
                  <p style={{ color: "#7b7b9d", fontSize: "11px", marginTop: "5px" }}>
                    Code preview: <span style={{ color: "#c4b5fd", fontFamily: "monospace" }}>
                      {roomCode.trim().toLowerCase().replace(/\s+/g, "-")}
                    </span>
                  </p>
                )}
              </div>

              {error && <p style={{ color: "#f87171", fontSize: "12px" }}>{error}</p>}

              <button className="btn-neon" style={{ width: "100%", marginTop: "4px" }} onClick={handleCreate}>
                Create Room
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}