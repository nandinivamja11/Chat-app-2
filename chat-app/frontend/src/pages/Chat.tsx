import { useEffect, useState } from "react";
import Sidebar from "../components/chat/Sidebar";
import ChatHeader from "../components/chat/ChatHeader";
import MessageBubble from "../components/chat/MessageBubble";
import MessageInput from "../components/chat/MessageInput";
import socket from "../socket";
import api from "../services/api";
import { markSeen, getMyChats } from "../services/message.service";
import { getUnreadCounts } from "../services/message.service";

type Message = {
  id: number;
  sender: number;
  receiver: number;
  text: string;
  time: string;
};
     
type Chat = {
  id: number;
  name: string;
  messages: Message[];
  unreadCount?: number;
};

function Chat() {
  const userId = Number(localStorage.getItem("userId"));
  const storedSelectedChat = Number(localStorage.getItem("selectedChat"));

  // 🔥 STEP 3 FIX: real users from DB
  const [chats, setChats] = useState<Chat[]>([]);

  const [selectedChat, setSelectedChat] = useState<number | null>(
    Number.isNaN(storedSelectedChat) ? null : storedSelectedChat
  );
  const [message, setMessage] = useState<string>("");

  const handleSelectChat = (id: number) => {
    setSelectedChat(id);
    localStorage.setItem("selectedChat", String(id));
  };

  useEffect(() => {
    if (selectedChat !== null) {
      localStorage.setItem("selectedChat", String(selectedChat));
    }
  }, [selectedChat]);

  const currentChat = chats.find((c) => c.id === selectedChat);
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCounts, setUnreadCounts] = useState<{
  [key: number]: number; }>({});

  useEffect(() => {

    loadUnread();

}, []);

const loadUnread = async () => {
  try {
    const res = await getUnreadCounts();

    console.log("Unread API Response:", res.data);

    const counts: { [key: number]: number } = {};

    res.data.forEach((item: any) => {
      counts[item.sender] = Number(item.count);
    });

    console.log("Counts:", counts);

    setUnreadCounts(counts);
  } catch (err) {
    console.log(err);
  }
};

  useEffect(() => {
    const loadMessages = async () => {
      if (selectedChat === null) return;

      setMessages([]);

      try {
        const res = await api.get(
          `/message/conversation/${selectedChat}`
        );

        const data = res.data.map((msg: any) => ({
          sender: msg.sender,
          receiver: msg.receiver,
          text: msg.message,
          time: new Date(msg.createdAt).toLocaleTimeString(),
        }));

        setMessages(data);
        if (data.length > 0) {
  const last = data[data.length - 1];

  setChats((prev) =>
    prev.map((chat) =>
      chat.id === selectedChat
        ? {
            ...chat,
            lastMessage: last.text,
          }
        : chat
    )
  );
}
        await markSeen(selectedChat);
        await loadUnread();
      } catch (err) {
        console.log(err);
      }
    };

    loadMessages();
  }, [selectedChat]);

  // ================= STEP 3: FETCH USERS =================
  useEffect(()=>{

fetchUsers();

},[]);
    const fetchUsers = async () => {
  try {
    const res = await api.get("/auth/users");

    const users = res.data.filter((u: any) => u.id !== userId);

    const chats = await Promise.all(
      users.map(async (user: any) => {
        try {
          const res = await api.get(`/message/conversation/${user.id}`);

          const messages = res.data;

          const lastMessage =
            messages.length > 0
              ? messages[messages.length - 1].message
              : "";

          return {
            id: user.id,
            name: user.username,
            messages: [],
            lastMessage,
          };
        } catch {
          return {
            id: user.id,
            name: user.username,
            messages: [],
            lastMessage: "",
          };
        }
      })
    );

    setChats(chats);

    if (chats.length > 0) {
      if (
        selectedChat !== null &&
        chats.some((chat) => chat.id === selectedChat)
      ) {
        setSelectedChat(selectedChat);
      } else {
        setSelectedChat(chats[0].id);
      }
    }
  } catch (err) {
    console.log("Error fetching users:", err);
  }
};

  // ================= SOCKET =================
  useEffect(() => {
    if (!userId) return;

    const handleConnect = () => {
      console.log("Socket connected", socket.id);
      socket.emit("join", userId);
    };

    const handleReceive = (data: any) => {
  if (
    (data.sender === selectedChat && data.receiver === userId) ||
    (data.sender === userId && data.receiver === selectedChat)
  ) {
    const msg = {
      sender: data.sender,
      receiver: data.receiver,
      text: data.text,
      time: new Date(data.createdAt).toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, msg]);
    setChats((prev) =>
  prev.map((chat) =>
    chat.id === data.sender || chat.id === data.receiver
      ? {
          ...chat,
          lastMessage: data.text,
        }
      : chat
  )
);
  }
};

    const handleError = (error: any) => {
      console.error("Socket error:", error);
    };

    socket.connect();
    socket.on("connect", handleConnect);
    socket.on("connect_error", handleError);
    socket.on("receive_message", handleReceive);
    socket.on("unread_updated", () => {
    console.log("Unread event received");
    loadUnread();
    });
    socket.on("messages_seen", loadUnread);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("connect_error", handleError);
      socket.off("receive_message", handleReceive);
      socket.off("unread_updated");
      socket.off("messages_seen");
      socket.disconnect();
    };
  }, [userId, selectedChat]);
  
  // ================= SEND MESSAGE =================
  const handleSend = async () => {
    if (!message.trim() || !selectedChat) return;

    const msg: Message = {
      sender: userId,
      receiver: selectedChat,
      text: message,
      time: new Date().toLocaleTimeString(),
    };

    // instant UI update
    setMessages((prev) => [...prev, msg]);
    setChats((prev) =>
      prev.map((chat) =>
      chat.id === selectedChat
        ? {
          ...chat,
          lastMessage: message,
        }
      : chat
  )
);

    try {
      const res = await api.post("/message/send", {
        receiver: selectedChat,
        message,
      });

      const savedMessage = res.data.data;

      socket.emit("send_message", {
        sender: userId,
        receiver: selectedChat,
        text: message,
        createdAt: savedMessage.createdAt,
      });
    } catch (err) {
      console.error("Message save failed:", err);
    }

    localStorage.setItem("selectedChat", String(selectedChat));
    setMessage("");
  };
          const chatsWithUnread = chats.map(chat => ({
          ...chat,unreadCount: unreadCounts[chat.id] || undefined
        }));

  return (
    <div className="h-screen flex bg-[#f0f2f5]">

      <Sidebar
        chats={chatsWithUnread}
        selectedChat={selectedChat || 0}
        setSelectedChat={handleSelectChat}
      />

      <div className="flex-1 flex flex-col">

        <ChatHeader
          name={currentChat?.name || "Select User"}
        />

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, i) => (
            <MessageBubble
              key={i}
              text={msg.text}
              sender={msg.sender === userId ? "me" : "other"}
              time={msg.time}
            />
          ))}
        </div>

        <MessageInput
          message={message}
          setMessage={setMessage}
          handleSend={handleSend}
        />

      </div>
    </div>
  );
}

export default Chat;