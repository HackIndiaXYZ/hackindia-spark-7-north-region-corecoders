import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PublicRooms from "./pages/PublicRooms";
import PrivateRoom from "./pages/PrivateRoom";
import JoinRoom from "./pages/JoinRoom";
import CreateRoom from "./pages/CreateRoom";
import Chat from "./Chat";

function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/public" element={<PublicRooms />} />
        <Route path="/private" element={<PrivateRoom />} />
        <Route path="/join" element={<JoinRoom />} />
        <Route path="/create" element={<CreateRoom />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    
  );
}

export default App;