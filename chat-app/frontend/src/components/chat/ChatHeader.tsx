import { useNavigate } from "react-router-dom";

type ChatHeaderProps = {
  name?: string;
};

function ChatHeader({ name }: ChatHeaderProps) {
  const navigate = useNavigate();

  const userName = name || "Chat User";

  return (
    <div className="bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm">

      {/* LEFT SIDE */}
      <div className="flex items-center gap-3">

        {/* Avatar */}
        <div className="w-11 h-11 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
          {userName.charAt(0).toUpperCase()}
        </div>

        {/* Name + Status */}
        <div>
          <h2 className="font-semibold text-lg text-gray-800">
            {userName}
          </h2>
          <p className="text-sm text-green-500">online</p>
        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4 text-xl">

        <button className="hover:text-blue-500 transition">
          📞
        </button>

        <button className="hover:text-blue-500 transition">
          🎥
        </button>

        <button
          onClick={() => navigate("/profile")}
          className="hover:text-blue-500 transition"
        >
          ⋮
        </button>

      </div>

    </div>
  );
}

export default ChatHeader;