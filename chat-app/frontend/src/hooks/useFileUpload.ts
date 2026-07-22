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
      const selectedUserId = selectedChat.startsWith("user-")
        ? Number(selectedChat.split("-")[1])
        : null;
      if (selectedUserId === null) return;
      const res = await uploadFile(selectedUserId, file);
      msg = res.data;
    }
      if (currentChat?.isGroup) {
        socket.emit("send_group_message", {
          ...msg,
          senderName: localStorage.getItem("username"),
        });
      } else {
        socket.emit("send_message", {
          sender: Number(msg.sender),
          receiver: Number(msg.receiver),
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
          sender: Number(msg.sender || msg.senderId),
          receiver: msg.receiver ? Number(msg.receiver) : null,
          text: msg.message,
          type: msg.type,
          fileUrl: msg.fileUrl,
          fileName: msg.fileName,
          time: new Date(msg.createdAt).toLocaleTimeString(),
        },
      ]);

      setChats((prev: any) =>
        prev.map((chat: any) =>
          currentChat?.isGroup
            ? chat.groupId === currentChat.groupId
              ? {
                  ...chat,
                  lastMessage: `📎 ${msg.fileName}`,
                }
              : chat
            : chat.id === selectedChat
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