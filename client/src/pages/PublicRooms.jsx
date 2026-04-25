// import GlassCard from "../components/GlassCard";
// import Button from "../components/Button";
// import { useNavigate } from "react-router-dom";

// export default function PublicRooms() {
//   const navigate = useNavigate();

//   const rooms = ["General", "Tech", "Random"];

//   return (
//     <div className="
//   min-h-screen flex items-center justify-center px-4
//   bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.25),#020617)]
// ">
//       <div className="w-full max-w-md space-y-4">

//         <h2 className="text-xl font-semibold text-center">Public Rooms</h2>

//         {rooms.map((room, i) => (
//           <GlassCard key={i} className="flex justify-between items-center">
//             <span>{room}</span>
//             <Button onClick={() => navigate("/chat", { state: {roomId:room, username:"User" } }) }>
//               Join
//             </Button>
//           </GlassCard>
//         ))}

//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ROOMS = [
  { id: "global-chat", name: "Global Chat", members: "1.5k", icon: "🌍" },
  { id: "music-vibes", name: "Music Vibes", members: "8.1k", icon: "🎵" },
  { id: "tech-talk",   name: "Tech Talk",   members: "6.1k", icon: "💻" },
  { id: "movie-talk",  name: "Movie Talk",  members: "8.3k", icon: "🎬" },
  { id: "chill-lounge",name: "Chill Lounge",members: "1.5k", icon: "🛋️" },
  { id: "cnb-lounge",  name: "CNB Lounge",  members: "4.3k", icon: "🎙️" },
];

export default function PublicRooms() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [error, setError] = useState("");

  const handleJoin = (room) => {
    if (!nickname.trim()) {
      setSelectedRoom(room);
      setError("Please enter a nickname first.");
      return;
    }
    navigate("/chat", { state: { roomId: room.id, username: nickname.trim() } });
  };

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
        <div style={{ width: "100%", maxWidth: "440px" }}>

          {/* Header */}
          <div className="fade-up" style={{ marginBottom: "24px" }}>
            <button
              onClick={() => navigate("/")}
              style={{
                background: "none", border: "none",
                color: "#7b7b9d", cursor: "pointer",
                fontSize: "13px", marginBottom: "16px",
                display: "flex", alignItems: "center", gap: "6px",
                fontFamily: "'Exo 2', sans-serif",
              }}
            >
              ← Back
            </button>
            <h2 style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontWeight: 700, fontSize: "26px", color: "#f0f0ff",
            }}>Public Rooms</h2>
            <p style={{ color: "#7b7b9d", fontSize: "13px", marginTop: "4px" }}>
              Discover conversations that interest you.
            </p>
          </div>

          {/* Nickname input */}
          <div className="fade-up-d1" style={{ marginBottom: "16px" }}>
            <label style={{ color: "#7b7b9d", fontSize: "12px", marginBottom: "6px", display: "block", fontWeight: 500, letterSpacing: "0.5px" }}>
              YOUR NICKNAME
            </label>
            <input
              className="neon-input"
              value={nickname}
              onChange={e => { setNickname(e.target.value); setError(""); }}
              placeholder="Enter your nickname before joining"
            />
            {error && (
              <p style={{ color: "#f87171", fontSize: "11px", marginTop: "5px" }}>{error}</p>
            )}
          </div>

          {/* Search */}
          <div className="fade-up-d1" style={{ marginBottom: "16px", position: "relative" }}>
            <span style={{
              position: "absolute", left: "14px", top: "50%",
              transform: "translateY(-50%)", color: "#7b7b9d", fontSize: "14px",
            }}>🔍</span>
            <input
              className="neon-input"
              placeholder="Search rooms..."
              style={{ paddingLeft: "38px" }}
            />
          </div>

          {/* Room list */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {ROOMS.map((room, i) => (
              <div
                key={room.id}
                className="neon-card"
                style={{
                  padding: "14px 18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                  animationDelay: `${i * 0.06}s`,
                  border: selectedRoom?.id === room.id && error
                    ? "1px solid rgba(248,113,113,0.5)"
                    : undefined,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "rgba(168,85,247,0.45)";
                  e.currentTarget.style.boxShadow = "0 0 20px rgba(168,85,247,0.15)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)";
                  e.currentTarget.style.boxShadow = "0 0 40px rgba(0,0,0,0.6)";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: "12px",
                    background: "rgba(99,102,241,0.15)",
                    border: "1px solid rgba(99,102,241,0.25)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "18px",
                  }}>
                    {room.icon}
                  </div>
                  <div>
                    <div style={{
                      fontFamily: "'Rajdhani', sans-serif",
                      fontWeight: 600, fontSize: "15px", color: "#f0f0ff",
                    }}>{room.name}</div>
                    <div style={{ color: "#7b7b9d", fontSize: "12px" }}>
                      {room.members} members
                    </div>
                  </div>
                </div>

                <button
                  className="btn-neon"
                  style={{ padding: "8px 18px", fontSize: "13px" }}
                  onClick={() => handleJoin(room)}
                >
                  Join
                </button>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}