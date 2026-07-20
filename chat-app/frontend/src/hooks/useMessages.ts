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
  data = await getGroupMessages(selectedChat);
  await api.put(`/group/seen/${selectedChat}`);
loadUnread();
} else {
  data = await getConversation(selectedChat);
}

      const formattedMessages = data.map((msg: any) => ({
        id: msg.id,
        sender: msg.sender || msg.senderId,
        senderName: msg.senderName || msg.Sender?.username,
        receiver: msg.receiver || null,
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

      if (selectedChat < 1000000) {
      await markSeen(selectedChat);
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