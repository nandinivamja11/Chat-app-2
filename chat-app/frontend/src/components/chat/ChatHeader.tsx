import { useNavigate } from "react-router-dom";
import { Phone, Video, EllipsisVertical } from "lucide-react";

type ChatHeaderProps = {
  name?: string;
  profileImage?: string;
  isGroup?: boolean;
  onOpenGroupInfo?: () => void;
};

function ChatHeader({ name, profileImage, isGroup, onOpenGroupInfo }: ChatHeaderProps) {
  const navigate = useNavigate();

  const userName = name || "Chat User";

  return (
    <div className="bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm">

      {/* LEFT SIDE */}
      <div className="flex items-center gap-3">

        {/* Avatar */}
        {/* <div className="w-11 h-11 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
          {userName.charAt(0).toUpperCase()}
        </div> */}
        {profileImage ? (
          <img src={`http://localhost:5000${profileImage}`}
          alt={userName}
          className="w-11 h-11 rounded-full object-cover border"
          />
        ):(
          <div className="w-11 h-11 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
            {userName.charAt(0).toUpperCase()}
            </div>
        )}
     
        {/* Name + Status */}
        <div onClick={() => {
            if (isGroup) {
            onOpenGroupInfo?.();
    }
  }}
  className={isGroup ? "cursor-pointer" : ""}
>
  <h2 className="font-semibold text-lg">
    {isGroup ? "👥 " : ""}
    {name}
  </h2>

  <p className="text-sm text-gray-500">
    {isGroup ? "Tap to view group info" : "Online"}
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
          className="p-2 rounded-full hover:bg-gray-100">
          <EllipsisVertical size={22} />
        </button>

      </div>

    </div>
  );
}

export default ChatHeader;