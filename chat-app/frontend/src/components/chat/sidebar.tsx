import { Users } from "lucide-react";

type Message = {
  id: number;
  text: string;
  sender: string;
  time: string;
};

type Chat = {
  id: number;
  name: string;
  messages: Message[];
  unreadCount?: number;
  lastMessage?: string;
};

type SidebarProps = {
  chats: Chat[];
  selectedChat: number;
  setSelectedChat: (id: number) => void;
  onCreateGroup: () => void;
};

function Sidebar({
  chats,
  selectedChat,
  setSelectedChat,
  onCreateGroup,
}: SidebarProps) {
  return (
    <div className="w-80 h-screen bg-white border-r flex flex-col">

      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
  <h2 className="text-xl font-bold">Chats</h2>

  <button
    onClick={onCreateGroup}
    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg transition"
  >
    <Users size={18} />
    Group
  </button>
</div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">

        {chats.map((chat) => {

          const lastMessage =
            chat.messages?.length > 0
              ? chat.messages[chat.messages.length - 1].text
              : chat.lastMessage;

          return (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat.id)}
              className={`flex items-center p-4 cursor-pointer border-b transition hover:bg-gray-100 ${
                selectedChat === chat.id ? "bg-blue-100" : ""
              }`}>

              {/* Avatar */}
              <div
                className={`w-12 h-12 rounded-full text-white flex items-center justify-center font-bold ${
                chat.isGroup ? "bg-green-500" : "bg-blue-500"
              }`}>
              {chat.isGroup ? "👥" : chat.name.charAt(0).toUpperCase()}
              </div>

              {/* Info */}
          <div className="ml-3 flex-1">

          <div className="flex justify-between items-center">

           <h2 className="font-semibold text-gray-800">
             {chat.name}
            </h2>

          {chat.unreadCount && chat.unreadCount > 0 && (
         <div
           className="min-w-[22px] h-[22px] px-1 rounded-full bg-[#25D366] text-white
           text-[11px] font-bold flex items-center justify-center">
           {chat.unreadCount}
        </div>
          )}
            </div>

          <p className="text-sm text-gray-500 truncate">
            {chat.lastMessage || "No messages yet"}
          </p>
              </div>
            </div>
          );
        })}

      </div>

    </div>
  );
}

export default Sidebar;