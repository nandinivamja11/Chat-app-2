import socket from "../socket";
import api from "../services/api";
import { uploadGroupFile } from "../services/group.service";
import { Message } from "../types/chat.types";

export default function useSendMessage({
  userId,
  selectedChat,
  currentChat,
  message,
  selectedFile,
  setSelectedFile,
  setMessage,
  setMessages,
  setChats,
}: any) {

  const handleSend = async () => {

    if ((!message.trim() && !selectedFile) || !selectedChat) {
  return;
}

    // const msg: Message = {
    //   sender: userId,
    //   receiver: selectedChat,
    //   text: message,
    //   time: new Date().toLocaleTimeString(),
    // };

    // setMessages((prev: any) => [...prev, msg]);

    // setChats((prev: any) =>
    //   prev.map((chat: any) =>
    //     chat.id === selectedChat
    //       ? {
    //           ...chat,
    //           lastMessage: message,
    //         }
    //       : chat
    //   )
    // );

    try {
      if (currentChat?.isGroup) {

  const res = await api.post("/group/message", {
  groupId: currentChat.groupId,
  message,
});
console.log("GROUP RESPONSE:", res.data);

  socket.emit("send_group_message", {
  ...res.data,
  senderName: localStorage.getItem("username"),
});
setMessages((prev: any) => [
  ...prev,
  {
    sender: res.data.senderId,
    senderName: res.data.senderName,
    text: res.data.message,
    type: res.data.type,
    fileUrl: res.data.fileUrl,
    fileName: res.data.fileName,
    time: new Date(res.data.createdAt).toLocaleTimeString(),
  },
]);

setChats((prev: any) =>
  prev.map((chat: any) =>
    chat.groupId === currentChat.groupId
      ? {
          ...chat,
          lastMessage:
            res.data.message ||
            (res.data.fileName ? `📎 ${res.data.fileName}` : ""),
        }
      : chat
  )
);

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