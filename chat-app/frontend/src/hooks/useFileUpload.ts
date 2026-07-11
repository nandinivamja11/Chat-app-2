import socket from "../socket";
import { uploadFile } from "../services/message.service";

export default function useFileUpload({
  selectedChat,
  setMessages,
  setChats,
}: any) {

  const handleFileSelect = async (file: File) => {

    if (selectedChat === null) return;

    try {
      const res = await uploadFile(selectedChat, file);

      const msg = res.data;

      socket.emit("send_message", {
        sender: msg.sender,
        receiver: msg.receiver,
        text: msg.message,
        type: msg.type,
        fileUrl: msg.fileUrl,
        fileName: msg.fileName,
        createdAt: msg.createdAt,
      });

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