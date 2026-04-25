export default function ChatInput({ value, setValue, sendMessage }) {
  return (
    <div className="flex gap-2 p-3 bg-white/5 border-t border-white/10">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 bg-transparent outline-none px-3"
      />

      <button
        onClick={() => sendMessage(value)}
        className="px-5 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:scale-110 transition"
      >
        ➤
      </button>
    </div>
  );
}