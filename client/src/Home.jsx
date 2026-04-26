// // import { useNavigate } from "react-router-dom";

// // function Home() {
// //   const navigate = useNavigate();

// //   return (
// //     <div className="flex items-center justify-center h-screen">
// //       <div className="bg-white/10 backdrop-blur-lg p-10 rounded-2xl shadow-2xl text-center hover:scale-105 transition">
// //         <h1 className="text-4xl font-bold mb-4 bg-linear-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
// //           AI Meeting Brain
// //         </h1>

// //         <p className="text-gray-300 mb-6">
// //           Smart conversations. Instant insights.
// //         </p>

// //         <button
// //           onClick={() => navigate("/chat")}
// //           className="px-6 py-3 rounded-full bg-linear-to-r from-blue-500 to-purple-600 hover:scale-110 transition-all duration-300"
// //         >
// //           Enter Chat
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }

// // export default Home;
// import { useNavigate } from "react-router-dom";

// export default function Home() {
//   const navigate = useNavigate();

//   return (
//     <div className="page-wrapper">
//       <div className="neon-grid" />

//       <div style={{
//         minHeight: "100vh",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         padding: "24px",
//       }}>
//         <div style={{ width: "100%", maxWidth: "420px" }}>

//           {/* Logo */}
//           <div className="fade-up" style={{ marginBottom: "32px", textAlign: "center" }}>
//             <div style={{
//               display: "inline-flex",
//               alignItems: "center",
//               gap: "10px",
//               background: "rgba(99,102,241,0.12)",
//               border: "1px solid rgba(99,102,241,0.3)",
//               borderRadius: "50px",
//               padding: "8px 20px",
//               marginBottom: "28px",
//             }}>
//               <div style={{
//                 width: 8, height: 8, borderRadius: "50%",
//                 background: "#a855f7",
//                 animation: "pulse-glow 2s infinite",
//               }} />
//               <span style={{
//                 fontFamily: "'Rajdhani', sans-serif",
//                 fontWeight: 700,
//                 fontSize: "15px",
//                 letterSpacing: "2px",
//                 color: "#c4b5fd",
//                 textTransform: "uppercase",
//               }}>ChikChat</span>
//             </div>

//             <h1 style={{
//               fontFamily: "'Rajdhani', sans-serif",
//               fontWeight: 700,
//               fontSize: "clamp(36px, 8vw, 52px)",
//               lineHeight: 1.1,
//               letterSpacing: "-0.5px",
//             }}>
//               <span style={{ color: "#f0f0ff" }}>Chat Freely.</span>
//               <br />
//               <span style={{
//                 background: "linear-gradient(135deg, #818cf8, #c084fc)",
//                 WebkitBackgroundClip: "text",
//                 WebkitTextFillColor: "transparent",
//               }}>Connect Deeply.</span>
//             </h1>

//             <p className="fade-up-d1" style={{
//               color: "#7b7b9d",
//               fontSize: "14px",
//               marginTop: "14px",
//               lineHeight: 1.6,
//               fontWeight: 300,
//             }}>
//               Join public rooms, start private conversations,<br />
//               and meet amazing people around the world.
//             </p>
//           </div>

//           {/* Card */}
//           <div className="neon-card fade-up-d2" style={{ padding: "32px" }}>
//             <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
//               <button
//                 className="btn-neon"
//                 onClick={() => navigate("/public")}
//                 style={{ width: "100%", textAlign: "center" }}
//               >
//                 🌐 &nbsp; Explore Public Rooms
//               </button>

//               <button
//                 onClick={() => navigate("/private")}
//                 style={{
//                   width: "100%",
//                   background: "rgba(255,255,255,0.04)",
//                   border: "1px solid rgba(99,102,241,0.3)",
//                   borderRadius: "10px",
//                   color: "#c4b5fd",
//                   fontFamily: "'Rajdhani', sans-serif",
//                   fontWeight: 600,
//                   fontSize: "15px",
//                   letterSpacing: "0.5px",
//                   padding: "12px 28px",
//                   cursor: "pointer",
//                   transition: "all 0.25s ease",
//                 }}
//                 onMouseEnter={e => {
//                   e.currentTarget.style.background = "rgba(99,102,241,0.12)";
//                   e.currentTarget.style.borderColor = "rgba(168,85,247,0.5)";
//                 }}
//                 onMouseLeave={e => {
//                   e.currentTarget.style.background = "rgba(255,255,255,0.04)";
//                   e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)";
//                 }}
//               >
//                 🔒 &nbsp; Private Room
//               </button>
//             </div>

//             {/* Footer stat */}
//             <div style={{
//               marginTop: "24px",
//               paddingTop: "20px",
//               borderTop: "1px solid rgba(255,255,255,0.06)",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               gap: "8px",
//             }}>
//               <div style={{
//                 width: 6, height: 6, borderRadius: "50%",
//                 background: "#22c55e",
//                 boxShadow: "0 0 8px #22c55e",
//               }} />
//               <span style={{ color: "#7b7b9d", fontSize: "13px" }}>
//                 10K+ users online
//               </span>
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }