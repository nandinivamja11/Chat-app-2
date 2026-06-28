import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import VerifyOTP from "./pages/VerifyOTP";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/verify" element={<VerifyOTP />} />
    </Routes>
  );
}

export default App;