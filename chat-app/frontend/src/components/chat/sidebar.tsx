// function sidebar() {
//     const chats=[
//         {
//              id:1,
//              name:"Alice",
//              lastMeessage:"hello",
//              unread:2,
//         },
//         {
//             id:2,
//             name:"john",
//             lastMessage:"hi howare you",
//             unread:0,
//         },
//         {
//             id:3,
//             name:"emma",
//             lastMessage:"see you later",
//             unread:1,
//         },
//     ];
//     return(
//         <div className="w-80 h-screen bg-white border-r flex flex-col">
//             <div className="p-4 border-b">
//             <h2 className="text-xl font-bold">chat</h2>
//             </div>
//         <div className="p-3">
//             <input type="text" placeholder="search..."
//             className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
//             </div>
//             <div className="flex-1 overflow-y-auto">
//                 {chats.map((chat) => (
//                     <div key={chat.id} className="flex items-center p-4 hover:bg-gray-100 cursor-pointer border-b">
//                         <div className="flex items-center gap-3">

//                     <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-cemter justify-center font-bold">
//                         {chat.name.charAt(0)}
//                     </div>
//                     <div>
//                         <h2 className="font-semibold">{chat.name}</h2>
//                         <p className="text-sm text-gray-500">{chat.lastMessage}</p>
//                     </div>
//                 </div>
//                 {chat.unread > 0 && (
//                     <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
//                         {chat.unread}
//                     </div>
//                 )}
//             </div>
//                 ))}
//             </div>
//         </div>
//     );
// }
// export default sidebar;

import React from "react";

interface SidebarProps {
  chats: {
    id: number;
    name: string;
    unread?: number;
    lastMessage?: string;
    messages?: {
      id: number;
      text: string;
      sender: string;
      time: string;
    }[];
  }[];
  selectedChat: number;
  setSelectedChat: (id: number) => void;
}

function Sidebar({
  chats,
  selectedChat,
  setSelectedChat,
}: SidebarProps) {
  return (
    <div className="w-80 h-screen bg-white border-r flex flex-col">
      
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">Chat</h2>
      </div>

      {/* Search */}
      <div className="p-3">
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => setSelectedChat(chat.id)}
            className={`flex items-center p-4 cursor-pointer border-b hover:bg-gray-100 ${
              selectedChat === chat.id ? "bg-blue-100" : ""
            }`}
          >
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
              {chat.name.charAt(0)}
            </div>

            {/* Chat Info */}
            <div className="ml-3 flex-1">
              <h2 className="font-semibold">{chat.name}</h2>

              <p className="text-sm text-gray-500">
                {chat.messages?.length
                  ? chat.messages[chat.messages.length - 1].text
                  : chat.lastMessage}
              </p>
            </div>

            {/* Unread Count */}
            {chat.unread && chat.unread > 0 && (
              <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                {chat.unread}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;