import socket from "../socket";
import api from "../services/api";
import { uploadGroupFile, editGroupMessage } from "../services/group.service";
import { Message } from "../types/chat.types";
import { editMessage } from "../services/message.service";

export default function useSendMessage({
  userId,
  selectedChat,
  currentChat,
  message,
  replyMessage,
  setReplyMessage,
  editingMessage,
  setEditingMessage,
  selectedFile,
  setSelectedFile,
  setMessage,
  setMessages,
  setChats,
}: any) {

  const handleSend = async () => {
    if (editingMessage) {
  try {
    if (currentChat?.isGroup) {
      await editGroupMessage(editingMessage.id, message);
    } else {
      await editMessage(editingMessage.id, message);
    }

    setMessages((prev: any) =>
      prev.map((m: any) =>
        m.id === editingMessage.id
          ? {
              ...m,
              text: message,
              edited: true,
            }
          : m
      )
    );

    socket.emit("edit_message", {
      id: editingMessage.id,
      sender: userId,
      receiver: editingMessage.receiver,
      message,
      edited: true,
    });
    setEditingMessage(null);
    setMessage("");

  } catch (err) {
    console.log(err);
  }
  return;
}

    if ((!message.trim() && !selectedFile) || !selectedChat) {
  return;
}

    try {
      const replyPayload = replyMessage
        ? {
            id: replyMessage.id,
            text: replyMessage.text,
            senderName: replyMessage.senderName,
          }
        : null;

      if (currentChat?.isGroup) {

  const res = await api.post("/group/message", {
  groupId: currentChat.groupId,
  message,
  replyTo: replyMessage?.id || null,
});
console.log("GROUP RESPONSE:", res.data);

  const groupReplyPayload = replyMessage
    ? {
        id: replyMessage.id,
        text: replyMessage.text,
        senderName: replyMessage.senderName,
      }
    : null;

  socket.emit("send_group_message", {
  ...res.data,
  senderName: localStorage.getItem("username"),
  replyToData: groupReplyPayload,
});
setMessages((prev: any) => [
  ...prev,
  {
    id: res.data.id,
    sender: Number(res.data.senderId),
    senderName: res.data.Sender?.username || localStorage.getItem("username"),
    text: res.data.message,
    type: res.data.type,
    fileUrl: res.data.fileUrl,
    fileName: res.data.fileName,
    replyTo: groupReplyPayload,
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

  const selectedUserId = selectedChat?.startsWith("user-")
    ? Number(selectedChat.split("-")[1])
    : null;
  if (!selectedUserId) {
    throw new Error("Invalid private chat selected");
  }

  const res = await api.post("/message/send", {
    receiver: selectedUserId,
    message,
    replyTo: replyMessage?.id || null,
  });
   setMessages((prev: any) => [
  ...prev,
  {
    id: res.data.data.id,
    sender: Number(res.data.data.sender),
    receiver: Number(res.data.data.receiver),
    text: res.data.data.message,
    type: res.data.data.type,
    fileUrl: res.data.data.fileUrl,
    fileName: res.data.data.fileName,
    replyTo: replyPayload,
    time: new Date(res.data.data.createdAt).toLocaleTimeString(),
  },
]);

  socket.emit("send_message", {
  id: res.data.data.id,
  sender: res.data.data.sender,
  receiver: res.data.data.receiver,
  text: res.data.data.message,
  replyTo: replyMessage?.id || null,
  replyToData: replyPayload,
  createdAt: res.data.data.createdAt,
});

}
    } catch (err) {
      console.error("Message save failed:", err);
    }

    if (selectedChat) {
      localStorage.setItem("selectedChat", selectedChat);
    }

    setMessage("");
    setReplyMessage(null);
  };

  return {
    handleSend,
  };
}