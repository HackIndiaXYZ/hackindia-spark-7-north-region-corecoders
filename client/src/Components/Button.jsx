 export default function Button({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="
        px-6 py-3 rounded-xl 
        bg-linear-to-r from-indigo-500 to-purple-600
        shadow-lg shadow-purple-500/30
        hover:scale-105 hover:shadow-[0_0_20px_rgba(139,92,246,0.6)]
        transition-all duration-300
      "
    >
      {children}
    </button>
  );
}