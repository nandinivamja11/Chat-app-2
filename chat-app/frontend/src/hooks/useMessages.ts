import { useEffect } from "react";
import { getConversation } from "../services/chat.service";
import { getGroupMessages } from "../services/group.service";
import { markSeen } from "../services/message.service";
import api from "../services/api";

export default function useMessages({ selectedChat, setMessages, currentChat, setChats, loadUnread,
}: any) {
  const loadMessages = async () => {
    if (selectedChat === null) return;
    setMessages([]);
    try {
      let data;
      if (currentChat?.isGroup) {
        data = await getGroupMessages(currentChat.groupId);
        await api.put(`/group/seen/${currentChat.groupId}`);
        loadUnread();
      } else {
        const selectedUserId = selectedChat.startsWith("user-")
          ? Number(selectedChat.split("-")[1])
          : null;
        if (selectedUserId === null) return;
        data = await getConversation(selectedUserId);
      }

      const formattedMessages = data.map((msg: any) => ({
        id: msg.id,
        sender: Number(msg.sender || msg.senderId),
        senderName: msg.senderName || msg.Sender?.username,
        receiver: msg.receiver ? Number(msg.receiver) : null,
        text: msg.message,
        type: msg.type,
        fileUrl: msg.fileUrl,
        fileName: msg.fileName,
        time: new Date(msg.createdAt).toLocaleTimeString(),
      }));

      setMessages(formattedMessages);

      if (formattedMessages.length > 0) {

        const last =
          formattedMessages[
            formattedMessages.length - 1
          ];

        setChats((prev: any) =>
          prev.map((chat: any) =>
            chat.id === selectedChat
              ? {
                  ...chat,
                  lastMessage:
                    last.text ||
                    (last.fileName
                      ? `📎 ${last.fileName}`
                      : "Attachment"),
                }
              : chat
          )
        );
      }

      const selectedUserId = selectedChat.startsWith("user-")
        ? Number(selectedChat.split("-")[1])
        : null;
      if (selectedUserId !== null) {
        await markSeen(selectedUserId);
      }
      await loadUnread();

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [selectedChat]);

  return {
    loadMessages,
  };
}