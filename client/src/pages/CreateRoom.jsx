// import { useState } from "react";
// import Button from "../components/Button";
// import GlassCard from "../components/GlassCard";
// import { useNavigate } from "react-router-dom";

// export default function CreateRoom() {
//   const [title, setTitle] = useState("");
//   const [code, setCode] = useState("");
//   const navigate = useNavigate();

//   return (
//     <div className="
//   min-h-screen flex items-center justify-center px-4
//   bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.25),#020617)]
// ">
//       <GlassCard className="w-full max-w-md space-y-4">

//         <h2 className="text-lg font-semibold">Create Room</h2>

//         <input
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           placeholder="Title"
//           className="w-full p-3 rounded-lg bg-white/10 outline-none"
//         />

//         <input
//           value={code}
//           onChange={(e) => setCode(e.target.value)}
//           placeholder="Room Code"
//           className="w-full p-3 rounded-lg bg-white/10 outline-none"
//         />

//         <Button onClick={() => navigate("/chat",{ state: { roomId:code,username:"User" } })}>
//           Create
//         </Button>

//       </GlassCard>
//     </div>
//   );
// }

import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateRoom() {
  const [title, setTitle] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [privacy, setPrivacy] = useState("Private (Invite only)");
  const navigate = useNavigate();

  const roomId = title.trim().toLowerCase().replace(/\s+/g, "-");

  const handleCreate = () => {
    if (!title.trim() || !nickname.trim()) return;
    navigate("/chat", { state: { roomId, username: nickname.trim() } });
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
                <input className="neon-input" value={nickname} onChange={e => setNickname(e.target.value)} placeholder="Enter your nickname" />
              </div>

              <div>
                <label style={{ color: "#7b7b9d", fontSize: "12px", marginBottom: "6px", display: "block", fontWeight: 500, letterSpacing: "0.5px" }}>ROOM NAME</label>
                <input className="neon-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter room name" />
                {title.trim() && (
                  <p style={{ color: "#7b7b9d", fontSize: "11px", marginTop: "6px" }}>
                    Share this code: &nbsp;<span style={{ color: "#c4b5fd", fontFamily: "monospace" }}>{roomId}</span>
                  </p>
                )}
              </div>

              <div>
                <label style={{ color: "#7b7b9d", fontSize: "12px", marginBottom: "6px", display: "block", fontWeight: 500, letterSpacing: "0.5px" }}>PASSWORD <span style={{ color: "#4b5563" }}>(OPTIONAL)</span></label>
                <input className="neon-input" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" type="password" />
              </div>

              <div>
                <label style={{ color: "#7b7b9d", fontSize: "12px", marginBottom: "6px", display: "block", fontWeight: 500, letterSpacing: "0.5px" }}>PRIVACY</label>
                <select value={privacy} onChange={e => setPrivacy(e.target.value)} className="neon-input" style={{ cursor: "pointer" }}>
                  <option value="Private (Invite only)">Private (Invite only)</option>
                  <option value="Public">Public</option>
                  <option value="Friends only">Friends only</option>
                </select>
              </div>

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