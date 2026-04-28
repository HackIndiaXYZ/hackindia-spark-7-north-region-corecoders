import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { users, useAuth } from "../App";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleLogin = async () => {
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    // Simulate a tiny async delay for UX feel
    await new Promise(r => setTimeout(r, 400));

    const user = users[email.toLowerCase()];

    if (!user) {
      setError("No account found with that email.");
      setLoading(false);
      return;
    }

    if (user.password !== password) {
      setError("Incorrect password.");
      setLoading(false);
      return;
    }

    login({ email: user.email, username: user.username });
    navigate("/");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
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
        <div className="neon-card fade-up" style={{
          width: "100%",
          maxWidth: "420px",
          padding: "40px 36px",
        }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(99,102,241,0.12)",
              border: "1px solid rgba(99,102,241,0.3)",
              borderRadius: "50px",
              padding: "6px 16px",
              marginBottom: "20px",
            }}>
              <div style={{
                width: 7, height: 7, borderRadius: "50%",
                background: "#a855f7",
                animation: "pulse-glow 2s infinite",
              }} />
              <span style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontWeight: 700,
                fontSize: "13px",
                letterSpacing: "2px",
                color: "#c4b5fd",
                textTransform: "uppercase",
              }}>ChikChat</span>
            </div>

            <h2 style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontWeight: 700,
              fontSize: "28px",
              color: "#f0f0ff",
              marginBottom: "6px",
            }}>Welcome back</h2>
            <p style={{ color: "#7b7b9d", fontSize: "13px" }}>
              Sign in to continue chatting
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: "10px",
              padding: "10px 14px",
              marginBottom: "20px",
              color: "#f87171",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Fields */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label style={{
                display: "block",
                color: "#7b7b9d",
                fontSize: "12px",
                letterSpacing: "0.5px",
                marginBottom: "6px",
                fontFamily: "'Rajdhani', sans-serif",
                textTransform: "uppercase",
              }}>Email</label>
              <input
                className="neon-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="email"
              />
            </div>

            <div>
              <label style={{
                display: "block",
                color: "#7b7b9d",
                fontSize: "12px",
                letterSpacing: "0.5px",
                marginBottom: "6px",
                fontFamily: "'Rajdhani', sans-serif",
                textTransform: "uppercase",
              }}>Password</label>
              <input
                className="neon-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="current-password"
              />
            </div>

            <button
              className="btn-neon"
              onClick={handleLogin}
              disabled={loading}
              style={{
                width: "100%",
                marginTop: "6px",
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              {loading ? (
                <>
                  <div style={{
                    width: 14, height: 14,
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#fff",
                    borderRadius: "50%",
                    animation: "spin 0.7s linear infinite",
                  }} />
                  Signing in…
                </>
              ) : "Sign In →"}
            </button>
          </div>

          {/* Divider */}
          <div style={{
            marginTop: "24px",
            paddingTop: "20px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            textAlign: "center",
          }}>
            <span style={{ color: "#7b7b9d", fontSize: "13px" }}>
              Don't have an account?{" "}
            </span>
            <Link to="/signup" style={{
              color: "#a78bfa",
              fontSize: "13px",
              textDecoration: "none",
              fontWeight: 600,
              fontFamily: "'Rajdhani', sans-serif",
            }}>
              Sign up
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}