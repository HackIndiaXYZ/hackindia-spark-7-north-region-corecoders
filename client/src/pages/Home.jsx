import { useNavigate } from "react-router-dom";
import { useAuth } from "../App";

export default function Home() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
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
        <div style={{ width: "100%", maxWidth: "420px" }}>

          {/* Logo */}
          <div className="fade-up" style={{ marginBottom: "32px", textAlign: "center" }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              background: "rgba(99,102,241,0.12)",
              border: "1px solid rgba(99,102,241,0.3)",
              borderRadius: "50px",
              padding: "8px 20px",
              marginBottom: "28px",
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: "50%",
                background: "#a855f7",
                animation: "pulse-glow 2s infinite",
              }} />
              <span style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontWeight: 700,
                fontSize: "15px",
                letterSpacing: "2px",
                color: "#c4b5fd",
                textTransform: "uppercase",
              }}>ChikChat</span>
            </div>

            <h1 style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(36px, 8vw, 52px)",
              lineHeight: 1.1,
              letterSpacing: "-0.5px",
            }}>
              <span style={{ color: "#f0f0ff" }}>Chat Freely.</span>
              <br />
              <span style={{
                background: "linear-gradient(135deg, #818cf8, #c084fc)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>Connect Deeply.</span>
            </h1>

            {currentUser && (
              <p className="fade-up-d1" style={{
                color: "#a78bfa",
                fontSize: "14px",
                marginTop: "14px",
                fontWeight: 500,
                fontFamily: "'Rajdhani', sans-serif",
              }}>
                Hey, {currentUser.username} 👋
              </p>
            )}

            <p className="fade-up-d1" style={{
              color: "#7b7b9d",
              fontSize: "14px",
              marginTop: "8px",
              lineHeight: 1.6,
              fontWeight: 300,
            }}>
              Join public rooms, start private conversations,<br />
              and meet amazing people around the world.
            </p>
          </div>

          {/* Card */}
          <div className="neon-card fade-up-d2" style={{ padding: "32px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <button
                className="btn-neon"
                onClick={() => navigate("/private")}
                style={{ width: "100%", textAlign: "center" }}
              >
                🔒 &nbsp; Create / Join a Private Room
              </button>

              <button
                onClick={() => navigate("/public")}
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(99,102,241,0.3)",
                  borderRadius: "10px",
                  color: "#c4b5fd",
                  fontFamily: "'Rajdhani', sans-serif",
                  fontWeight: 600,
                  fontSize: "15px",
                  letterSpacing: "0.5px",
                  padding: "12px 28px",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "rgba(99,102,241,0.12)";
                  e.currentTarget.style.borderColor = "rgba(168,85,247,0.5)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)";
                }}
              >
                🌐 &nbsp; Explore Public Rooms
              </button>
            </div>

            {/* Footer row */}
            <div style={{
              marginTop: "24px",
              paddingTop: "20px",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: "#22c55e",
                  boxShadow: "0 0 8px #22c55e",
                }} />
                <span style={{ color: "#7b7b9d", fontSize: "13px" }}>
                  10K+ users online
                </span>
              </div>

              <button
                onClick={handleLogout}
                style={{
                  background: "none",
                  border: "none",
                  color: "#7b7b9d",
                  fontSize: "12px",
                  cursor: "pointer",
                  fontFamily: "'Rajdhani', sans-serif",
                  fontWeight: 600,
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  padding: "4px 0",
                  transition: "color 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.color = "#f87171"}
                onMouseLeave={e => e.currentTarget.style.color = "#7b7b9d"}
              >
                Sign out
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}