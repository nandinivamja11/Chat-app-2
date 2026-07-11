import { useEffect, useState } from "react";
import Sidebar from "../components/chat/Sidebar";
import ChatHeader from "../components/chat/ChatHeader";
import MessageBubble from "../components/chat/MessageBubble";
import MessageInput from "../components/chat/MessageInput";
import { Chat as ChatType, Message } from "../types/chat.types";
import useSocket from "../hooks/useSocket";
import useFileUpload from "../hooks/useFileUpload";
import useMessages from "../hooks/useMessages";
import useSendMessage from "../hooks/useSendMessage";
import useUsers from "../hooks/useUsers";
import useUnread from "../hooks/useUnread";

function Chat() {
  const userId = Number(localStorage.getItem("userId"));
  const storedSelectedChat = Number(localStorage.getItem("selectedChat"));

  // 🔥 STEP 3 FIX: real users from DB
  const [chats, setChats] = useState<ChatType[]>([]);

  const [selectedChat, setSelectedChat] = useState<number | null>(
    Number.isNaN(storedSelectedChat) ? null : storedSelectedChat
  );
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const currentChat = chats.find((c) => c.id === selectedChat);
  const { unreadCounts, loadUnread } = useUnread();

const { handleFileSelect } = useFileUpload({ selectedChat, setMessages, setChats,});

const { handleSend } = useSendMessage({ userId, selectedChat, message, setMessage, setMessages,
  setChats,});

useMessages({ selectedChat, setMessages, setChats, loadUnread,});

useUsers({ userId, selectedChat, setSelectedChat, setChats, });

  const handleSelectChat = (id: number) => {
    setSelectedChat(id);
    localStorage.setItem("selectedChat", String(id));
  };

  useEffect(() => {
    if (selectedChat !== null) {
      localStorage.setItem("selectedChat", String(selectedChat));
    }
  }, [selectedChat]);

const handleReceive = (data: any) => {
   if (
      (data.sender === selectedChat && data.receiver === userId) ||
      (data.sender === userId && data.receiver === selectedChat)
    ) {

      const msg = {
        sender: data.sender,
        receiver: data.receiver,
        text: data.text,
        type: data.type,
        fileUrl: data.fileUrl,
        fileName: data.fileName,
        time: new Date(data.createdAt).toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, msg]);

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === data.sender || chat.id === data.receiver
            ? {
                ...chat,
                lastMessage:
                  data.text ||
                  (data.fileName ? `📎 ${data.fileName}` : "Attachment"),
              }
            : chat
        )
      );
    }
  };

  // ✅ Hook yahan call hoga
  useSocket({
    userId,
    selectedChat,
    loadUnread,
    onReceive: handleReceive,
  });

          const chatsWithUnread = chats.map(chat => ({
          ...chat,unreadCount: unreadCounts[chat.id] || undefined
        }));

  return (
    <div className="h-screen flex bg-[#f0f2f5]">

      <Sidebar
        chats={chatsWithUnread}
        selectedChat={selectedChat || 0}
        setSelectedChat={handleSelectChat}
      />

      <div className="flex-1 flex flex-col">

        <ChatHeader
          name={currentChat?.name || "Select User"}
        />

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, i) => (
            <MessageBubble
              key={i}
              text={msg.text}
              sender={msg.sender === userId ? "me" : "other"}
              time={msg.time}
              type={msg.type}
              fileUrl={msg.fileUrl}
              fileName={msg.fileName}
            />
          ))}
        </div>

        <MessageInput
          message={message}
          setMessage={setMessage}
          handleSend={handleSend}
          onFileSelect={handleFileSelect}
        />

      </div>
    </div>
  );
}

export default Chat;