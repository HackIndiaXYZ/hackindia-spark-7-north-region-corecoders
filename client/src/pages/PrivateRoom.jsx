// import Button from "../components/Button";
// import GlassCard from "../components/GlassCard";
// import { useNavigate } from "react-router-dom";

// export default function PrivateRoom() {
//   const navigate = useNavigate();

//   return (
//     <div className="
//   min-h-screen flex items-center justify-center px-4
//   bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.25),#020617)]
// ">
//       <GlassCard className="w-full max-w-md text-center space-y-6">

//         <h2 className="text-xl font-semibold">Private Room</h2>

//         <Button onClick={() => navigate("/join")}>
//           Join Room
//         </Button>

//         <Button onClick={() => navigate("/create")}>
//           Create Room
//         </Button>

//       </GlassCard>
//     </div>
//   );
// }

import { useNavigate } from "react-router-dom";

export default function PrivateRoom() {
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
            onClick={() => navigate("/")}
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

            {/* Icon */}
            <div style={{
              width: 56, height: 56, borderRadius: "16px",
              background: "rgba(168,85,247,0.15)",
              border: "1px solid rgba(168,85,247,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "24px", marginBottom: "20px",
            }}>🔒</div>

            <h2 style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontWeight: 700, fontSize: "24px",
              color: "#f0f0ff", marginBottom: "6px",
            }}>Private Room</h2>
            <p style={{ color: "#7b7b9d", fontSize: "13px", marginBottom: "28px" }}>
              What would you like to do?
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

              {/* Join option */}
              <div
                onClick={() => navigate("/join")}
                style={{
                  background: "rgba(99,102,241,0.08)",
                  border: "1px solid rgba(99,102,241,0.25)",
                  borderRadius: "14px",
                  padding: "18px 20px",
                  cursor: "pointer",
                  display: "flex", alignItems: "center", gap: "16px",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "rgba(99,102,241,0.6)";
                  e.currentTarget.style.background = "rgba(99,102,241,0.14)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "rgba(99,102,241,0.25)";
                  e.currentTarget.style.background = "rgba(99,102,241,0.08)";
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: "12px",
                  background: "rgba(99,102,241,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "18px",
                }}>🚪</div>
                <div>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: "15px", color: "#f0f0ff" }}>
                    Join a Room
                  </div>
                  <div style={{ color: "#7b7b9d", fontSize: "12px" }}>
                    Enter room code to join an existing room.
                  </div>
                </div>
                <span style={{ marginLeft: "auto", color: "#7b7b9d", fontSize: "18px" }}>›</span>
              </div>

              {/* Create option */}
              <div
                onClick={() => navigate("/create")}
                style={{
                  background: "rgba(168,85,247,0.08)",
                  border: "1px solid rgba(168,85,247,0.25)",
                  borderRadius: "14px",
                  padding: "18px 20px",
                  cursor: "pointer",
                  display: "flex", alignItems: "center", gap: "16px",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "rgba(168,85,247,0.6)";
                  e.currentTarget.style.background = "rgba(168,85,247,0.14)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "rgba(168,85,247,0.25)";
                  e.currentTarget.style.background = "rgba(168,85,247,0.08)";
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: "12px",
                  background: "rgba(168,85,247,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "18px",
                }}>✨</div>
                <div>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: "15px", color: "#f0f0ff" }}>
                    Create a Room
                  </div>
                  <div style={{ color: "#7b7b9d", fontSize: "12px" }}>
                    Create your own private room.
                  </div>
                </div>
                <span style={{ marginLeft: "auto", color: "#7b7b9d", fontSize: "18px" }}>›</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}