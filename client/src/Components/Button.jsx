//  export default function Button({ children, onClick }) {
//   return (
//     <button
//       onClick={onClick}
//       className="
//         px-6 py-3 rounded-xl 
//         bg-linear-to-r from-indigo-500 to-purple-600
//         shadow-lg shadow-purple-500/30
//         hover:scale-105 hover:shadow-[0_0_20px_rgba(139,92,246,0.6)]
//         transition-all duration-300
//       "
//     >
//       {children}
//     </button>
//   );
// }

export default function Button({ children, onClick, variant = "primary", className = "", fullWidth = false }) {
  if (variant === "ghost") {
    return (
      <button
        onClick={onClick}
        className={`${fullWidth ? "w-full" : ""} ${className}`}
        style={{
          background: "rgba(255,255,255,0.05)",
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
          width: fullWidth ? "100%" : undefined,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = "rgba(99,102,241,0.15)";
          e.currentTarget.style.borderColor = "rgba(168,85,247,0.5)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = "rgba(255,255,255,0.05)";
          e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)";
        }}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`btn-neon ${fullWidth ? "w-full" : ""} ${className}`}
      style={{ width: fullWidth ? "100%" : undefined }}
    >
      {children}
    </button>
  );
}