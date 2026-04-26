/* eslint-disable react-hooks/refs */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { useLocation, useNavigate } from "react-router-dom";
import MessageBubble from "./Components/MessageBubble";
import ChatInput from "./Components/ChatInput";

export default function Chat() {
  const location = useLocation();
  const navigate = useNavigate();

  // All hooks first — no conditionals before any hook call
  const roomIdRef   = useRef(null);
  const usernameRef = useRef(null);
  const bottomRef   = useRef();
  const socketRef   = useRef(null);

  const [message,      setMessage]      = useState("");
  const [messages,     setMessages]     = useState([]);
  const [memberCount,  setMemberCount]  = useState(0);
  const [isLoading,    setIsLoading]    = useState(true);
  const [isAdmin,      setIsAdmin]      = useState(false);
  const [roomName,     setRoomName]     = useState("");
  const [joinError,    setJoinError]    = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [newCode,      setNewCode]      = useState("");
  const [codeMsg,      setCodeMsg]      = useState("");
  const [members,      setMembers]      = useState([]);

  useEffect(() => {
    const state    = location.state;
    const roomCode = state?.roomCode;
    const isCreating = state?.isCreating ?? false;

    // Initialise refs from state or sessionStorage
    roomIdRef.current   = state?.roomId   || sessionStorage.getItem("chat_roomId");
    usernameRef.current = state?.username || sessionStorage.getItem("chat_username");

    // Initialise state from state or sessionStorage
    const initIsAdmin  = isCreating || sessionStorage.getItem("chat_isAdmin") === "true";
    const initRoomName = state?.roomName || sessionStorage.getItem("chat_roomName") || roomIdRef.current || "";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsAdmin(initIsAdmin);
    setRoomName(initRoomName);

    // If neither roomId nor roomCode exists, nothing to do
    if (!roomIdRef.current && !roomCode) {
      setJoinError("Invalid room access");
      setIsLoading(false);
      return
    };

    const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:3001");
    socketRef.current = socket;

    const doConnect = () => {
      if (isCreating && roomCode) {
        // ── CREATOR ── emit create_room with display name + secret code
        socket.emit("create_room", {
          roomName: state.roomName,
          roomCode: roomCode,
          username: usernameRef.current,
        }, (res) => {
          if (res.error) { setJoinError(res.error); setIsLoading(false); return; }
          // Server returns the real roomId (slug+timestamp)
          roomIdRef.current = res.roomId;
          sessionStorage.setItem("chat_roomId",   res.roomId);
          sessionStorage.setItem("chat_roomName", res.roomName);
          sessionStorage.setItem("chat_username", usernameRef.current);
          sessionStorage.setItem("chat_isAdmin",  "true");
          setRoomName(res.roomName);
          setIsAdmin(true);
          setIsLoading(false);
        });

      } else {
        // ── JOINER ── emit join_room with the code they typed
        // On refresh, roomIdRef already has the roomId, skip join_room
        // (socket will re-join via roomId directly)
        const code = roomCode || null;

        if (code) {
          socket.emit("join_room", {
            roomCode: code,
            username: usernameRef.current,
          }, (res) => {
            if (res.error) { setJoinError(res.error); setIsLoading(false); return; }
            roomIdRef.current = res.roomId;
            sessionStorage.setItem("chat_roomId",   res.roomId);
            sessionStorage.setItem("chat_roomName", res.roomName);
            sessionStorage.setItem("chat_username", usernameRef.current);
            sessionStorage.setItem("chat_isAdmin",  "false");
            setRoomName(res.roomName);
            setIsAdmin(false);
          });
        } else {
          // Refresh case: re-join using stored roomId directly
          socket.emit("rejoin_room", {
            roomId:   roomIdRef.current,
            username: usernameRef.current,
          });
        }
      }
    };

    socket.on("connect", doConnect);
    // if (socket.connected) doConnect();

    socket.on("message_history", (history) => {
      setIsLoading(false);
      setMessages(history.map(msg => ({
        ...msg,
        type: msg.sender === usernameRef.current ? "user" : "other",
      })));
    });

    socket.on("receive_message", (data) => {
      setMessages(prev => [...prev, {
        ...data,
        type: data.sender === usernameRef.current ? "user" : "other",
      }]);
    });

    socket.on("room_count",   (count) => setMemberCount(count));
    socket.on("members_list", (list)  => setMembers(list));

    socket.on("kicked", () => {
      sessionStorage.clear();
      navigate("/", { state: { kickedMessage: "You have been removed from this room by the admin." } });
    });

    socket.on("user_kicked", ({ username: u }) => {
      setMessages(prev => [...prev, { type: "system", text: `${u} was removed from the room.`, timestamp: Date.now() }]);
    });
    socket.on("user_joined", ({ username: u }) => {
      setMessages(prev => [...prev, { type: "system", text: `${u} joined the room.`, timestamp: Date.now() }]);
    });
    socket.on("user_left", ({ username: u }) => {
      setMessages(prev => [...prev, { type: "system", text: `${u} left the room.`, timestamp: Date.now() }]);
    });

    socket.on("code_changed", () => {
      setCodeMsg("Room code updated.");
      setNewCode("");
      setTimeout(() => setCodeMsg(""), 3000);
    });
    socket.on("code_change_error", ({ error }) => {
      setCodeMsg(error);
      setTimeout(() => setCodeMsg(""), 3000);
    });

    const fallback = setTimeout(() => setIsLoading(false), 2000);
    return () => { clearTimeout(fallback); socket.removeAllListeners();socket.disconnect(); };
  }, []);

  // Poll members (admin only)
  useEffect(() => {
    if (!isAdmin) return;
    const poll = setInterval(() => {
      socketRef.current?.emit("get_members", { roomId: roomIdRef.current }, (list) => {
        if (list) setMembers(list);
      });
    }, 3000);
    return () => clearInterval(poll);
  }, [isAdmin]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim() || !socketRef.current || !roomIdRef.current) return;
    socketRef.current.emit("send_message", {
      roomId: roomIdRef.current,
      text: message,
      sender: usernameRef.current,
    });
    setMessage("");
  };

  const kickUser = (targetSocketId, targetUsername) => {
    if (!window.confirm(`Remove ${targetUsername} from the room?`)) return;
    socketRef.current?.emit("kick_user", { roomId: roomIdRef.current, targetSocketId });
  };

  const changeCode = () => {
    if (!newCode.trim()) return;
    socketRef.current?.emit("change_code", {
      roomId: roomIdRef.current,
      newCode: newCode.trim(),
    });
  };

  if (joinError) {
    return (
      <div className="page-wrapper" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <div className="neon-grid" />
        <div className="neon-card fade-up" style={{ padding: "40px", textAlign: "center", maxWidth: "380px" }}>
          <div style={{ fontSize: "36px", marginBottom: "16px" }}>🚫</div>
          <h2 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "20px", color: "#f87171", marginBottom: "10px" }}>{joinError}</h2>
          <button className="btn-neon" style={{ marginTop: "20px" }} onClick={() => navigate("/")}>Go Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper" style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      <div className="neon-grid" />

      {/* HEADER */}
      <div style={{ flexShrink: 0, position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", background: "rgba(10,10,30,0.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(99,102,241,0.2)", boxShadow: "0 0 30px rgba(0,0,0,0.5)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <button onClick={() => navigate("/")} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#c4b5fd", cursor: "pointer", padding: "6px 10px", fontSize: "14px" }}>←</button>
          <div>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "17px", color: "#f0f0ff" }}>{roomName}</div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />
              <span style={{ color: "#7b7b9d", fontSize: "12px" }}>{memberCount} {memberCount === 1 ? "member" : "members"} online</span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {isAdmin && (
            <button onClick={() => setShowSettings(s => !s)} style={{ background: showSettings ? "rgba(168,85,247,0.25)" : "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.4)", borderRadius: "8px", color: "#c4b5fd", cursor: "pointer", padding: "6px 12px", fontSize: "13px", fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}>
              ⚙ Manage
            </button>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: "50px", padding: "6px 14px 6px 8px" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: "#fff" }}>
              {usernameRef.current?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: "14px", color: "#c4b5fd" }}>{usernameRef.current || "User"}</span>
              {isAdmin && <span style={{ marginLeft: "6px", background: "linear-gradient(135deg, #6366f1, #a855f7)", color: "#fff", fontSize: "9px", fontWeight: 700, padding: "2px 6px", borderRadius: "4px", letterSpacing: "0.5px", fontFamily: "'Rajdhani', sans-serif" }}>ADMIN</span>}
            </div>
          </div>
        </div>
      </div>

      {/* ADMIN PANEL */}
      {isAdmin && showSettings && (
        <div style={{ flexShrink: 0, position: "relative", zIndex: 1, background: "rgba(15,10,40,0.97)", borderBottom: "1px solid rgba(168,85,247,0.2)", padding: "16px 24px", display: "flex", gap: "32px", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "220px" }}>
            <p style={{ color: "#7b7b9d", fontSize: "11px", letterSpacing: "0.5px", marginBottom: "8px", fontWeight: 600 }}>CHANGE ROOM CODE</p>
            <div style={{ display: "flex", gap: "8px" }}>
              <input className="neon-input" value={newCode} onChange={e => setNewCode(e.target.value)} placeholder="New room code" style={{ flex: 1 }} />
              <button className="btn-neon" style={{ padding: "8px 16px", fontSize: "13px", whiteSpace: "nowrap" }} onClick={changeCode}>Update</button>
            </div>
            {codeMsg && <p style={{ color: codeMsg.includes("updated") ? "#86efac" : "#f87171", fontSize: "11px", marginTop: "6px" }}>{codeMsg}</p>}
          </div>

          <div style={{ flex: 1, minWidth: "220px" }}>
            <p style={{ color: "#7b7b9d", fontSize: "11px", letterSpacing: "0.5px", marginBottom: "8px", fontWeight: 600 }}>MEMBERS</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "120px", overflowY: "auto" }}>
              {members.length === 0
                ? <p style={{ color: "#4b5563", fontSize: "12px" }}>No members data yet.</p>
                : members.map(m => (
                  <div key={m.socketId} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.03)", borderRadius: "8px", padding: "6px 10px" }}>
                    <span style={{ color: "#f0f0ff", fontSize: "13px", fontFamily: "'Rajdhani', sans-serif" }}>
                      {m.username}
                      {m.isCreator && <span style={{ marginLeft: "6px", color: "#a855f7", fontSize: "10px" }}>ADMIN</span>}
                    </span>
                    {!m.isCreator && (
                      <button onClick={() => kickUser(m.socketId, m.username)} style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "6px", color: "#f87171", cursor: "pointer", fontSize: "11px", padding: "3px 10px", fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}>Kick</button>
                    )}
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      )}

      {/* MESSAGES */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", position: "relative", zIndex: 1 }}>
        {isLoading ? (
          <div style={{ textAlign: "center", marginTop: "80px", color: "#7b7b9d" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", border: "2px solid rgba(99,102,241,0.2)", borderTop: "2px solid #a855f7", margin: "0 auto 16px", animation: "spin 0.8s linear infinite" }} />
            <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "14px" }}>Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: "center", marginTop: "80px", color: "#7b7b9d" }}>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>💬</div>
            <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "16px" }}>No messages yet. Say hello!</p>
          </div>
        ) : null}

        {messages.map((msg, i) =>
          msg.type === "system"
            ? <div key={i} style={{ textAlign: "center", margin: "8px 0" }}><span style={{ color: "#4b5563", fontSize: "11px", background: "rgba(255,255,255,0.03)", padding: "3px 12px", borderRadius: "20px" }}>{msg.text}</span></div>
            : <MessageBubble key={i} text={msg.text} type={msg.type} sender={msg.sender} isAdmin={msg.isAdmin} />
        )}
        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div style={{ flexShrink: 0, position: "relative", zIndex: 1 }}>
        <ChatInput value={message} setValue={setMessage} sendMessage={sendMessage} />
      </div>
    </div>
  );
}