// import { useState } from "react";
// import Sidebar from "../components/chat/Sidebar";
// import ChatHeader from "../components/chat/ChatHeader";
// import MessageBubble from "../components/chat/MessageBubble";
// import MessageInput from "../components/chat/MessageInput";
// import Profile from "./Profile";

// function Chat() {
//   const [message, setMessage] = useState("");

//   const messages = [
//     {
//       id: 1,
//       text: "Hello 👋",
//       sender: "other",
//       time: "10:30 AM",
//     },
//     {
//       id: 2,
//       text: "Hi, how are you?",
//       sender: "me",
//       time: "10:31 AM",
//     },
//     {
//       id: 3,
//       text: "I'm fine 😊",
//       sender: "other",
//       time: "10:32 AM",
//     },
//   ];

//   const handleSend = () => {
//     if (!message.trim()) return;

//     console.log(message);
//     setMessage("");
//   };

//   return (
//     <div className="h-screen flex bg-[#f0f2f5]">

//       {/* Sidebar */}
//       <Sidebar />

//       {/* Chat Area */}
//       <div className="flex-1 flex flex-col">

//         <ChatHeader />

//         {/* Messages */}
//         <div
//           className="flex-1 overflow-y-auto p-6 space-y-4"
//           style={{
//             backgroundImage:
//               "url('https://www.transparenttextures.com/patterns/cubes.png')",
//           }}
//         >
//           {messages.map((msg) => (
//             <MessageBubble
//               key={msg.id}
//               text={msg.text}
//               sender={msg.sender}
//               time={msg.time}
//             />
//           ))}
//         </div>

//         {/* Input */}
//         <MessageInput
//           message={message}
//           setMessage={setMessage}
//           handleSend={handleSend}
//         />

//       </div>
//     </div>
//   );
// }

// export default Chat;

import { useState } from "react";
import { useEffect } from "react";
import { socket } from "../socket";
import Sidebar from "../components/chat/Sidebar";
import ChatHeader from "../components/chat/ChatHeader";
import MessageBubble from "../components/chat/MessageBubble";
import MessageInput from "../components/chat/MessageInput";

function Chat() {
  useEffect(() => {
  socket.on("connect", () => {
    console.log("Connected:", socket.id);
  });

  return () => {
    socket.off("connect");
  };
}, []);
  const chatsData = [
    {
      id: 1,
      name: "Alice",
      messages: [{id: 1, text: "Hello", sender: "other", time:"10:30"}],
    },
    {
      id: 2,
      name: "John",
      messages: [{id:1, text: "hi there", sender: "other", time:"10:31"}],
    },
    {
      id: 3,
      name: "Emma",
      messages: [{id:1, text: "see you later", sender: "other", time:"10:32"}],
    },
  ];
  const [chats, setChats] = useState(chatsData);
  const [selectedChat, setSelectedChat] = useState(1);
  const [message, setMessage] = useState("");
  const currentChat = chats.find((c) => c.id === selectedChat);
  const handleSend = () =>{
    if(!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: message,
      sender: "me",
      time: new Date().toLocaleTimeString(),
    };
    setChats((prev) => prev.map((chat) => chat.id === selectedChat ? {...chat, messages: [...chat.messages, newMessage]} : chat));
  setMessage("");

  setTimeout(() => {
    const botMessage = {
      id: Date.now() + 1,
       text: "🤖 Auto reply from " + currentChat?.name,
        sender: "other",
        time: new Date().toLocaleTimeString(),
      };

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === selectedChat
            ? { ...chat, messages: [...chat.messages, botMessage] }
            : chat
        )
      );
    }, 1000);
  };

  return (
    <div className="h-screen flex bg-[#f0f2f5]">
      
      {/* Sidebar */}
      <Sidebar
        chats={chats}
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
      />

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <ChatHeader name={currentChat?.name} />

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {currentChat?.messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              text={msg.text}
              sender={msg.sender}
              time={msg.time}
            />
          ))}
        </div>

        {/* Input */}
        <MessageInput
          message={message}
          setMessage={setMessage}
          handleSend={handleSend}
        />
      </div>
    </div>
  );
}
export default Chat;