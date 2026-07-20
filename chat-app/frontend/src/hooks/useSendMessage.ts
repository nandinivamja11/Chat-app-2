import socket from "../socket";
import api from "../services/api";
import { Message } from "../types/chat.types";

export default function useSendMessage({
  userId,
  selectedChat,
  currentChat,
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
      if (currentChat?.isGroup) {

  const res = await api.post("/group/message", {
  groupId: currentChat.groupId,
  message,
});

  socket.emit("send_group_message", {
  ...res.data,
  senderName: localStorage.getItem("username"),
});

} else {

  const res = await api.post("/message/send", {
    receiver: selectedChat,
    message,
  });

  socket.emit("send_message", {
    sender: res.data.data.sender,
    receiver: res.data.data.receiver,
    text: res.data.data.message,
    createdAt: res.data.data.createdAt,
  });

}
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