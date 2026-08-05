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
      const selectedGroupId = selectedChat.startsWith("group-")
        ? Number(selectedChat.replace("group-", ""))
        : null;
      const selectedUserId = selectedChat.startsWith("user-")
        ? Number(selectedChat.replace("user-", ""))
        : null;

      if (selectedGroupId !== null) {
        data = await getGroupMessages(selectedGroupId);
        await api.put(`/group/seen/${selectedGroupId}`);
        loadUnread();
      } else if (selectedUserId !== null) {
        data = await getConversation(selectedUserId);
      } else {
        return;
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
        reactions: (msg.reactions || []).map((r:any)=>({ emoji: r.emoji, user: r.user })),
        edited: msg.edited, 
        replyTo: msg.ReplyMessage
  ? {
      id: msg.ReplyMessage.id,
      text: msg.ReplyMessage.message,
      senderName:
        msg.ReplyMessage.sender === Number(localStorage.getItem("userId"))
          ? "You"
          : msg.ReplyMessage.Sender?.username || "",
    }
  : null, 
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