/* eslint-disable no-empty */
/* eslint-disable react-refresh/only-export-components */
import { Routes, Route, Navigate } from "react-router-dom";
import { createContext, useContext, useState } from "react";
import Home from "./pages/Home";
import PublicRooms from "./pages/PublicRooms";
import PrivateRoom from "./pages/PrivateRoom";
import JoinRoom from "./pages/JoinRoom";
import CreateRoom from "./pages/CreateRoom";
import Chat from "./Chat";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// ── Users store backed by localStorage so it survives sign-out & reloads ──
// Shape: { [email]: { email, password, username } }
function loadUsers() {
  try {
    const raw = localStorage.getItem("chikchat_users");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveUsers(u) {
  try { localStorage.setItem("chikchat_users", JSON.stringify(u)); } catch {}
}

export const users = loadUsers();

export function registerUser(newUser) {
  users[newUser.email] = newUser;
  saveUsers(users);
}

// ── Auth context ──
export const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

// ── Protected route wrapper ──
function Protected({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" replace />;
}

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    // Restore session from sessionStorage on reload
    try {
      const stored = sessionStorage.getItem("chikchat_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  function login(user) {
    setCurrentUser(user);
    sessionStorage.setItem("chikchat_user", JSON.stringify(user));
  }

  function logout() {
    setCurrentUser(null);
    sessionStorage.removeItem("chikchat_user");
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      <Routes>
        {/* Auth routes */}
        <Route path="/login"  element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes */}
        <Route path="/"       element={<Protected><Home /></Protected>} />
        <Route path="/public" element={<Protected><PublicRooms /></Protected>} />
        <Route path="/private" element={<Protected><PrivateRoom /></Protected>} />
        <Route path="/join"   element={<Protected><JoinRoom /></Protected>} />
        <Route path="/create" element={<Protected><CreateRoom /></Protected>} />
        <Route path="/chat"   element={<Protected><Chat /></Protected>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthContext.Provider>
  );
}

export default App;