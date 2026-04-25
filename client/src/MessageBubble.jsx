export default function MessageBubble({ text, type, sender }) {
  const isLeft = type === "user" || type === "ai-me";

  return (
    <div className={`flex ${isLeft ? "justify-start" : "justify-end"} mb-3`}>
      <div>
        {!isLeft && (
          <p className="text-xs text-gray-400 mb-1">{sender}</p>
        )}

        <div
          className={`
            px-4 py-2 rounded-2xl max-w-xs
            ${isLeft 
              ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
              : "bg-white/10 border border-white/10"}
          `}
        >
          {text}
        </div>
      </div>
    </div>
  );
}