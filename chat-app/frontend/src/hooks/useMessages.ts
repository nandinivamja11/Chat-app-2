import { useEffect } from "react";
import { getConversation } from "../services/chat.service";
import { markSeen } from "../services/message.service";
import { group } from "node:console";

export default function useMessages({ selectedChat, setMessages, setChats, loadUnread,
}: any) {

  const loadMessages = async () => {

    if (selectedChat === null) return;

    setMessages([]);

    try {

      const data = await getConversation(selectedChat);

      const formattedMessages = data.map((msg: any) => ({
        id: msg.id,
        sender: msg.sender,
        receiver: msg.receiver,
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