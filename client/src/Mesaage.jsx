function Message({ text, sender }) {
  const isUser = sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-4 py-2 rounded-2xl max-w-xs text-sm shadow-lg transition-all duration-300 ${
          isUser
            ? "bg-gradient-to-r from-blue-500 to-purple-500"
            : "bg-white/20 backdrop-blur-md"
        }`}
      >
        {text}
      </div>
    </div>
  );
}

export default Message;