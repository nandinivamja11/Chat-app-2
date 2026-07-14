import { useNavigate } from "react-router-dom";
import { Phone, Video, EllipsisVertical } from "lucide-react";

type ChatHeaderProps = {
  name?: string;
  isGroup?: boolean;
};

function ChatHeader({ name, isGroup }: ChatHeaderProps) {
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
        <h2 className="font-semibold text-lg">
          {isGroup ? "👥 " : ""}
          {name}
        </h2>

       <p className="text-sm text-gray-500">
          {isGroup ? "Group Chat" : "Online"}
       </p>
      </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4 text-xl">

        <button className="p-2 rounded-full hover:bg-gray-100">
           <Phone size={22} />
        </button>

        <button className="p-2 rounded-full hover:bg-gray-100">
           <Video size={22} />
        </button>

        <button
          onClick={() => navigate("/profile")}
          className="p-2 rounded-full hover:bg-gray-100">
          <EllipsisVertical size={22} />
        </button>

      </div>

    </div>
  );
}

export default ChatHeader;