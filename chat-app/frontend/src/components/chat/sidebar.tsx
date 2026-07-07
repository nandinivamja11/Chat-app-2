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
};

type SidebarProps = {
  chats: Chat[];
  selectedChat: number;
  setSelectedChat: (id: number) => void;
};

function Sidebar({
  chats,
  selectedChat,
  setSelectedChat,
}: SidebarProps) {
  return (
    <div className="w-80 h-screen bg-white border-r flex flex-col">

      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">Chats</h2>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">

        {chats.map((chat) => {

          const lastMessage =
            chat.messages?.length > 0
              ? chat.messages[chat.messages.length - 1].text
              : "No messages yet";

          return (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat.id)}
              className={`flex items-center p-4 cursor-pointer border-b transition hover:bg-gray-100 ${
                selectedChat === chat.id ? "bg-blue-100" : ""
              }`}>

              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                {chat.name.charAt(0).toUpperCase()}
              </div>

              {/* Info */}
              <div className="ml-3 flex-1">

                <div className="flex justify-between items-center">
                  <h2 className="font-semibold text-gray-800">
                    {chat.name}
                  </h2>
                </div>

                <p className="text-sm text-gray-500 truncate">
                  {lastMessage}
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