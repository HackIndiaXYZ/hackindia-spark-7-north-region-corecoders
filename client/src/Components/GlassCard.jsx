// export default function GlassCard({ children, className = "" }) {
//   return (
//     <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 ${className}`}>
//       {children}
//     </div>
//   );
// }

// // eslint-disable-next-line no-unused-vars
// export default function GlassCard({ children, className = "" }) {
//   return (
//     <div className="
//       bg-white/10 backdrop-blur-2xl
//       border border-white/20
//       rounded-3xl
//       p-8
//       shadow-[0_0_60px_rgba(0,0,0,0.8)]
//     ">
//       {children}
//     </div>
//   );
// }

export default function GlassCard({ children, className = "" }) {
  return (
    <div className={`neon-card p-8 ${className}`}>
      {children}
    </div>
  );
}