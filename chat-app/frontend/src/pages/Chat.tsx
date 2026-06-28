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

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Sidebar from "../components/chat/Sidebar";
// import ChatHeader from "../components/chat/ChatHeader";
// import MessageBubble from "../components/chat/MessageBubble";
// import MessageInput from "../components/chat/MessageInput";
// import { getMessages, sendMessage } from "../services/chat.service";

// type Message = {
//   _id?: string;
//   id: number;
//   sender: string;
//   text: string;
//   time: string;
// };

// type ChatType = {
//   id: number;
//   name: string;
//   messages: Message[];
// };

// function Chat() {
//   const navigate = useNavigate();
//   const [chats, setChats] = useState<ChatType[]>([
//     { id: 1, name: "Group Chat", messages: [] },
//   ]);
//   const [selectedChat, setSelectedChat] = useState(1);
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(true);
//   const currentChat = chats.find((c) => c.id === selectedChat);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       navigate("/");
//     }
//   }, [navigate]);

//   useEffect(() => {
//     const loadMessages = async () => {
//       try {
//         const data = await getMessages();
//         const formatted = data.map((item: any) => ({
//           id: item._id ? Date.now() : item.id,
//           _id: item._id,
//           sender: item.sender,
//           text: item.message,
//           time: new Date(item.time).toLocaleTimeString(),
//         }));

//         setChats([{ id: 1, name: "Group Chat", messages: formatted }]);
//       } catch (err) {
//         console.error("Failed to load messages", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadMessages();
//   }, []);

//   const handleSend = async () => {
//     if (!message.trim()) return;

//     try {
//       const savedMessage = await sendMessage(message);
//       const newMessage = {
//         id: Date.now(),
//         _id: savedMessage._id,
//         sender: "me",
//         text: savedMessage.message,
//         time: new Date(savedMessage.time).toLocaleTimeString(),
//       };

//       setChats((prev) =>
//         prev.map((chat) =>
//           chat.id === selectedChat
//             ? { ...chat, messages: [...chat.messages, newMessage] }
//             : chat
//         )
//       );
//       setMessage("");
//     } catch (err) {
//       console.error("Send failed", err);
//       alert("Unable to send message");
//     }
//   };

//   return (
//     <div className="h-screen flex bg-[#f0f2f5]">
//       <Sidebar chats={chats} selectedChat={selectedChat} setSelectedChat={setSelectedChat} />

//       <div className="flex-1 flex flex-col">
//         <ChatHeader name={currentChat?.name || "Chat"} />

//         <div className="flex-1 overflow-y-auto p-6 space-y-4">
//           {loading ? (
//             <div className="text-gray-500">Loading messages...</div>
//           ) : currentChat?.messages.length ? (
//             currentChat.messages.map((msg) => (
//               <MessageBubble key={msg._id || msg.id} text={msg.text} sender={msg.sender} time={msg.time} />
//             ))
//           ) : (
//             <div className="text-gray-500">No messages yet. Send the first message!</div>
//           )}
//         </div>

//         <MessageInput message={message} setMessage={setMessage} handleSend={handleSend} />
//       </div>
//     </div>
//   );
// }

// export default Chat;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/chat/Sidebar";
import ChatHeader from "../components/chat/ChatHeader";
import MessageBubble from "../components/chat/MessageBubble";
import MessageInput from "../components/chat/MessageInput";
import { getMessages, sendMessage } from "../services/chat.service";

function Chat() {
  const chatsData = [
    {
      id: 1,
      name: "Alice",
      messages: [{ id: 1, text: "Hello 👋", sender: "other", time: "10:30" }],
    },
    {
      id: 2,
      name: "John",
      messages: [{ id: 1, text: "Hi there", sender: "other", time: "10:31" }],
    },
    {
      id: 3,
      name: "Emma",
      messages: [{ id: 1, text: "See you later", sender: "other", time: "10:32" }],
    },
  ];

  const [chats, setChats] = useState(chatsData);
  const [selectedChat, setSelectedChat] = useState(1);
  const [message, setMessage] = useState("");

  const currentChat = chats.find((c) => c.id === selectedChat);

  const handleSend = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: message,
      sender: "me",
      time: new Date().toLocaleTimeString(),
    };

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === selectedChat
          ? { ...chat, messages: [...chat.messages, newMessage] }
          : chat
      )
    );

    setMessage("");

    // 🔥 AUTO REPLY per chat
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