import socket from "../socket";
import api from "../services/api";
import { Message } from "../types/chat.types";

export default function useSendMessage({
  userId,
  selectedChat,
  message,
  setMessage,
  setMessages,
  setChats,
}: any) {

  const handleSend = async () => {

    if (!message.trim() || !selectedChat) return;

    const msg: Message = {
      sender: userId,
      receiver: selectedChat,
      text: message,
      time: new Date().toLocaleTimeString(),
    };

    setMessages((prev: any) => [...prev, msg]);

    setChats((prev: any) =>
      prev.map((chat: any) =>
        chat.id === selectedChat
          ? {
              ...chat,
              lastMessage: message,
            }
          : chat
      )
    );

    try {
      const res = await api.post("/message/send", {
        receiver: selectedChat,
        message,
      });

      const savedMessage = res.data.data;

      socket.emit("send_message", {
        sender: savedMessage.sender,
        receiver: savedMessage.receiver,
        text: savedMessage.message,
        type: savedMessage.type,
        fileUrl: savedMessage.fileUrl,
        fileName: savedMessage.fileName,
        createdAt: savedMessage.createdAt,
      });

    } catch (err) {
      console.error("Message save failed:", err);
    }

    localStorage.setItem("selectedChat", String(selectedChat));

    setMessage("");
  };

  return {
    handleSend,
  };
}