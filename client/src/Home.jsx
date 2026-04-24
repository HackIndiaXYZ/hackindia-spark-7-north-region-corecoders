import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white/10 backdrop-blur-lg p-10 rounded-2xl shadow-2xl text-center hover:scale-105 transition">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          AI Meeting Brain
        </h1>

        <p className="text-gray-300 mb-6">
          Smart conversations. Instant insights.
        </p>

        <button
          onClick={() => navigate("/chat")}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-110 transition-all duration-300"
        >
          Enter Chat
        </button>
      </div>
    </div>
  );
}

export default Home;