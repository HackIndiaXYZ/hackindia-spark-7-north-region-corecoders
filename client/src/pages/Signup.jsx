import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { users, registerUser, useAuth } from "../App";

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSignup = async () => {
    setError("");

    if (!username.trim() || !email.trim() || !password.trim() || !confirm.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    if (username.trim().length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    if (users[email.toLowerCase()]) {
      setError("An account with this email already exists.");
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 400));

    // Write to localStorage-backed store
    const newUser = {
      email: email.toLowerCase().trim(),
      password,
      username: username.trim(),
    };
    registerUser(newUser);

    // Auto-login after signup
    login({ email: newUser.email, username: newUser.username });
    navigate("/");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSignup();
  };

  // Password strength indicator
  const strength = (() => {
    if (!password) return null;
    if (password.length < 6) return { label: "Weak", color: "#ef4444", width: "33%" };
    if (password.length < 10) return { label: "Fair", color: "#f59e0b", width: "66%" };
    return { label: "Strong", color: "#22c55e", width: "100%" };
  })();

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
            }}>Create account</h2>
            <p style={{ color: "#7b7b9d", fontSize: "13px" }}>
              Join and start chatting in seconds
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
            {/* Username */}
            <div>
              <label style={{
                display: "block",
                color: "#7b7b9d",
                fontSize: "12px",
                letterSpacing: "0.5px",
                marginBottom: "6px",
                fontFamily: "'Rajdhani', sans-serif",
                textTransform: "uppercase",
              }}>Username</label>
              <input
                className="neon-input"
                type="text"
                placeholder="cooluser42"
                value={username}
                onChange={e => setUsername(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="username"
              />
            </div>

            {/* Email */}
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

            {/* Password */}
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
                autoComplete="new-password"
              />
              {/* Strength bar */}
              {strength && (
                <div style={{ marginTop: "8px" }}>
                  <div style={{
                    height: 3,
                    background: "rgba(255,255,255,0.07)",
                    borderRadius: 2,
                    overflow: "hidden",
                  }}>
                    <div style={{
                      height: "100%",
                      width: strength.width,
                      background: strength.color,
                      borderRadius: 2,
                      transition: "width 0.3s ease, background 0.3s ease",
                      boxShadow: `0 0 6px ${strength.color}`,
                    }} />
                  </div>
                  <span style={{ fontSize: "11px", color: strength.color, marginTop: "4px", display: "block" }}>
                    {strength.label}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label style={{
                display: "block",
                color: "#7b7b9d",
                fontSize: "12px",
                letterSpacing: "0.5px",
                marginBottom: "6px",
                fontFamily: "'Rajdhani', sans-serif",
                textTransform: "uppercase",
              }}>Confirm password</label>
              <input
                className="neon-input"
                type="password"
                placeholder="••••••••"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="new-password"
                style={{
                  borderColor: confirm && confirm !== password
                    ? "rgba(239,68,68,0.5)"
                    : confirm && confirm === password
                    ? "rgba(34,197,94,0.5)"
                    : undefined,
                }}
              />
            </div>

            <button
              className="btn-neon"
              onClick={handleSignup}
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
                  Creating account…
                </>
              ) : "Create Account →"}
            </button>
          </div>

          {/* Footer */}
          <div style={{
            marginTop: "24px",
            paddingTop: "20px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            textAlign: "center",
          }}>
            <span style={{ color: "#7b7b9d", fontSize: "13px" }}>
              Already have an account?{" "}
            </span>
            <Link to="/login" style={{
              color: "#a78bfa",
              fontSize: "13px",
              textDecoration: "none",
              fontWeight: 600,
              fontFamily: "'Rajdhani', sans-serif",
            }}>
              Sign in
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}