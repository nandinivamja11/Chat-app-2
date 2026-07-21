import socket from "../socket";
import { uploadFile } from "../services/message.service";
import { uploadGroupFile } from "../services/group.service";

export default function useFileUpload({ selectedChat, currentChat, setMessages, setChats,
}: any) {

  const handleFileSelect = async (file: File) => {

    if (selectedChat === null) return;

    try {
      let msg;

    if (currentChat?.isGroup) {
      msg = await uploadGroupFile(currentChat.groupId, file);
    } else {
      const res = await uploadFile(selectedChat, file);
      msg = res.data;
    }
      socket.emit("send_message", {
        sender: msg.sender,
        receiver: msg.receiver,
        text: msg.message,
        type: msg.type,
        fileUrl: msg.fileUrl,
        fileName: msg.fileName,
        createdAt: msg.createdAt,
      });if (currentChat?.isGroup) {

  socket.emit("send_group_message", {
    ...msg,
    senderName: localStorage.getItem("username"),
  });

} else {

  socket.emit("send_message", {
    sender: msg.sender,
    receiver: msg.receiver,
    text: msg.message,
    type: msg.type,
    fileUrl: msg.fileUrl,
    fileName: msg.fileName,
    createdAt: msg.createdAt,
  });
}

      setMessages((prev: any) => [
        ...prev,
        {
          sender: msg.sender,
          receiver: msg.receiver,
          text: msg.message,
          type: msg.type,
          fileUrl: msg.fileUrl,
          fileName: msg.fileName,
          time: new Date(msg.createdAt).toLocaleTimeString(),
        },
      ]);

      setChats((prev: any) =>
        prev.map((chat: any) =>
          chat.id === selectedChat
            ? {
                ...chat,
                lastMessage: `📎 ${msg.fileName}`,
              }
            : chat
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  return {
    handleFileSelect,
  };
}