// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function CreateRoom() {
//   const [roomName, setRoomName] = useState("");
//   const [roomCode, setRoomCode] = useState("");
//   const [nickname, setNickname] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleCreate = () => {
//     if (!roomName.trim() || !roomCode.trim() || !nickname.trim()) {
//       setError("All fields are required.");
//       return;
//     }
//     const normalizedCode = roomCode.trim().toLowerCase().replace(/\s+/g, "-");
//     navigate("/chat", {
//       state: {
//         roomCode: normalizedCode,
//         roomName: roomName.trim(),
//         username: nickname.trim(),
//         isCreating: true,
//       },
//     });
//   };

//   return (
//     <div className="page-wrapper">
//       <div className="neon-grid" />
//       <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
//         <div style={{ width: "100%", maxWidth: "420px" }}>

//           <button onClick={() => navigate("/private")} style={{ background: "none", border: "none", color: "#7b7b9d", cursor: "pointer", fontSize: "13px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "6px", fontFamily: "'Exo 2', sans-serif" }}>
//             ← Back
//           </button>

//           <div className="neon-card fade-up" style={{ padding: "36px" }}>
//             <h2 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "24px", color: "#f0f0ff", marginBottom: "6px" }}>Create a Room</h2>
//             <p style={{ color: "#7b7b9d", fontSize: "13px", marginBottom: "28px" }}>Create a private room and invite others.</p>

//             <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

//               <div>
//                 <label style={{ color: "#7b7b9d", fontSize: "12px", marginBottom: "6px", display: "block", fontWeight: 500, letterSpacing: "0.5px" }}>YOUR NICKNAME</label>
//                 <input className="neon-input" value={nickname} onChange={e => { setNickname(e.target.value); setError(""); }} placeholder="Enter your nickname" />
//               </div>

//               <div>
//                 <label style={{ color: "#7b7b9d", fontSize: "12px", marginBottom: "6px", display: "block", fontWeight: 500, letterSpacing: "0.5px" }}>ROOM NAME</label>
//                 <input className="neon-input" value={roomName} onChange={e => { setRoomName(e.target.value); setError(""); }} placeholder="Display name for the room" />
//               </div>

//               <div>
//                 <label style={{ color: "#7b7b9d", fontSize: "12px", marginBottom: "6px", display: "block", fontWeight: 500, letterSpacing: "0.5px" }}>
//                   ROOM CODE
//                   <span style={{ color: "#7b7b9d", fontWeight: 400, marginLeft: "6px", fontSize: "11px" }}>
//                     — share this with people you want to invite
//                   </span>
//                 </label>
//                 <input
//                   className="neon-input"
//                   value={roomCode}
//                   onChange={e => { setRoomCode(e.target.value); setError(""); }}
//                   placeholder="e.g. my-secret-room"
//                   type="password"
//                 />
//                 {roomCode.trim() && (
//                   <p style={{ color: "#7b7b9d", fontSize: "11px", marginTop: "5px" }}>
//                     Code preview: <span style={{ color: "#c4b5fd", fontFamily: "monospace" }}>
//                       {roomCode.trim().toLowerCase().replace(/\s+/g, "-")}
//                     </span>
//                   </p>
//                 )}
//               </div>

//               {error && <p style={{ color: "#f87171", fontSize: "12px" }}>{error}</p>}

//               <button className="btn-neon" style={{ width: "100%", marginTop: "4px" }} onClick={handleCreate}>
//                 Create Room
//               </button>

//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateRoom() {
  const [roomName, setRoomName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [nickname, setNickname] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCreate = () => {
    if (!roomName.trim() || !nickname.trim()) {
      setError("All fields are required.");
      return;
    }
    if (!isPublic && !roomCode.trim()) {
      setError("Private rooms require a room code.");
      return;
    }

    const normalizedCode = isPublic
      ? roomName.trim().toLowerCase().replace(/\s+/g, "-") // auto-generate code from name for public rooms
      : roomCode.trim().toLowerCase().replace(/\s+/g, "-");

    navigate("/chat", {
      state: {
        roomCode: normalizedCode,
        roomName: roomName.trim(),
        username: nickname.trim(),
        isCreating: true,
        isPublic,
      },
    });
  };

  return (
    <div className="page-wrapper">
      <div className="neon-grid" />
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{ width: "100%", maxWidth: "420px" }}>

          <button
            onClick={() => navigate("/private")}
            style={{ background: "none", border: "none", color: "#7b7b9d", cursor: "pointer", fontSize: "13px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "6px", fontFamily: "'Exo 2', sans-serif" }}
          >
            ← Back
          </button>

          <div className="neon-card fade-up" style={{ padding: "36px" }}>
            <h2 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "24px", color: "#f0f0ff", marginBottom: "6px" }}>
              Create a Room
            </h2>
            <p style={{ color: "#7b7b9d", fontSize: "13px", marginBottom: "28px" }}>
              Set up a room and invite others to join.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

              {/* Nickname */}
              <div>
                <label style={{ color: "#7b7b9d", fontSize: "12px", marginBottom: "6px", display: "block", fontWeight: 500, letterSpacing: "0.5px" }}>
                  YOUR NICKNAME
                </label>
                <input
                  className="neon-input"
                  value={nickname}
                  onChange={e => { setNickname(e.target.value); setError(""); }}
                  placeholder="Enter your nickname"
                />
              </div>

              {/* Room Name */}
              <div>
                <label style={{ color: "#7b7b9d", fontSize: "12px", marginBottom: "6px", display: "block", fontWeight: 500, letterSpacing: "0.5px" }}>
                  ROOM NAME
                </label>
                <input
                  className="neon-input"
                  value={roomName}
                  onChange={e => { setRoomName(e.target.value); setError(""); }}
                  placeholder="Display name for the room"
                />
              </div>

              {/* Public / Private Toggle */}
              <div>
                <label style={{ color: "#7b7b9d", fontSize: "12px", marginBottom: "10px", display: "block", fontWeight: 500, letterSpacing: "0.5px" }}>
                  ROOM VISIBILITY
                </label>
                <div style={{ display: "flex", gap: "10px" }}>
                  {/* Private option */}
                  <div
                    onClick={() => { setIsPublic(false); setError(""); }}
                    style={{
                      flex: 1,
                      padding: "12px 14px",
                      borderRadius: "10px",
                      border: `1px solid ${!isPublic ? "rgba(168,85,247,0.6)" : "rgba(99,102,241,0.25)"}`,
                      background: !isPublic ? "rgba(168,85,247,0.12)" : "rgba(255,255,255,0.03)",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div style={{
                      width: 32, height: 32, borderRadius: "8px",
                      background: !isPublic ? "rgba(168,85,247,0.2)" : "rgba(255,255,255,0.05)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "16px", transition: "background 0.2s",
                    }}>
                      🔒
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: "14px", color: !isPublic ? "#c4b5fd" : "#f0f0ff" }}>
                        Private
                      </div>
                      <div style={{ fontSize: "11px", color: "#7b7b9d", marginTop: "1px" }}>
                        Invite only
                      </div>
                    </div>
                  </div>

                  {/* Public option */}
                  <div
                    onClick={() => { setIsPublic(true); setError(""); }}
                    style={{
                      flex: 1,
                      padding: "12px 14px",
                      borderRadius: "10px",
                      border: `1px solid ${isPublic ? "rgba(168,85,247,0.6)" : "rgba(99,102,241,0.25)"}`,
                      background: isPublic ? "rgba(168,85,247,0.12)" : "rgba(255,255,255,0.03)",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div style={{
                      width: 32, height: 32, borderRadius: "8px",
                      background: isPublic ? "rgba(168,85,247,0.2)" : "rgba(255,255,255,0.05)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "16px", transition: "background 0.2s",
                    }}>
                      🌐
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: "14px", color: isPublic ? "#c4b5fd" : "#f0f0ff" }}>
                        Public
                      </div>
                      <div style={{ fontSize: "11px", color: "#7b7b9d", marginTop: "1px" }}>
                        Listed in Public Rooms
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Room Code — only shown for private rooms */}
              {!isPublic && (
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
                      Code preview:{" "}
                      <span style={{ color: "#c4b5fd", fontFamily: "monospace" }}>
                        {roomCode.trim().toLowerCase().replace(/\s+/g, "-")}
                      </span>
                    </p>
                  )}
                </div>
              )}

              {/* Info banner for public rooms */}
              {isPublic && roomName.trim() && (
                <div style={{
                  background: "rgba(99,102,241,0.08)",
                  border: "1px solid rgba(99,102,241,0.25)",
                  borderRadius: "8px",
                  padding: "10px 14px",
                  fontSize: "12px",
                  color: "#7b7b9d",
                }}>
                  Your room will appear in Public Rooms as{" "}
                  <span style={{ color: "#c4b5fd", fontFamily: "monospace" }}>
                    {roomName.trim()}
                  </span>
                  . Anyone can join without a code.
                </div>
              )}

              {error && <p style={{ color: "#f87171", fontSize: "12px" }}>{error}</p>}

              <button
                className="btn-neon"
                style={{ width: "100%", marginTop: "4px" }}
                onClick={handleCreate}
              >
                Create {isPublic ? "Public" : "Private"} Room
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}