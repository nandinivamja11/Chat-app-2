import { useEffect, useState } from "react";
import Sidebar from "../components/chat/Sidebar";
import ChatHeader from "../components/chat/ChatHeader";                                        
import MessageBubble from "../components/chat/MessageBubble";
import MessageInput from "../components/chat/MessageInput";

function Chat() {
    const [message, setMessage] = useState("");
    const messages = [
         {
            id:1,
            text:"hello",
            sender:"user",
            time:"10:30 AM",
         },
         {
            id:2,
            text:"hi, how are you?",
            sender:"bot",
            time:"10:31 AM",
         },
         {
            id: 3,
            text: "I'm fine 😊",
            sender: "other",
            time: "10:3 AM",
        },
    ];
    const handleSend = () => {
    if (!message.trim()) return;

    console.log(message);
    setMessage("");
  };

    return (
        <div className="h-screen flex bg-gray-100">
            <div className="w-1/4 bg-white border-r">
            <div className="p-4 border-b">
                <h2 className="text-xl font-bold">Chat</h2>
                </div>
                <div className="p-2">
          <div className="p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
            Alice
          </div>

          <div className="p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
            John
          </div>

          <div className="p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
            Emma
          </div>
        </div>
      </div>
                <div className="flex-1 flex flex-col">
                    <div className="bg-white p-4 border-b">
                        <h2 className="font-semibold text-lg">Alice</h2>
                        <p className="text-sm text-green-500">Online</p>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "me"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-xs ${
                  msg.sender === "me"
                    ? "bg-blue-500 text-white"
                    : "bg-white border"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
                    </div>
                    <div className="flex h-screen">
  
  <Sidebar />

  <div className="flex-1 flex flex-col">
    
    <ChatHeader />

    <div className="flex-1 p-4 space-y-3 overflow-y-auto">
      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          text={msg.text}
          sender={msg.sender}
          time={msg.time}
        />
      ))}
    </div>

    <MessageInput />

  </div>
</div>
                    </div>
                </div>
    );
}
export default Chat;
