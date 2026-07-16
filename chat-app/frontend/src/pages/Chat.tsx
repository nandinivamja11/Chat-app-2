import { useEffect, useState } from "react";
import Sidebar from "../components/chat/Sidebar";
import ChatHeader from "../components/chat/ChatHeader";
import MessageBubble from "../components/chat/MessageBubble";
import MessageInput from "../components/chat/MessageInput";
import { Chat as ChatType, Message } from "../types/chat.types";
import useSocket from "../hooks/useSocket";
import useFileUpload from "../hooks/useFileUpload";
import useMessages from "../hooks/useMessages";
import useSendMessage from "../hooks/useSendMessage";
import useUsers from "../hooks/useUsers";
import useUnread from "../hooks/useUnread";
import { createGroup, getMyGroups } from "../services/group.service";

function Chat() {
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const fetchGroups = async () => {
  try {
    const groups = await getMyGroups();
     console.log("MY GROUPS:", groups);
    const formattedGroups = groups.map((g: any) => ({
      id: g.id,
      name: g.groupName,
      isGroup: true,
      avatar: g.groupImage || "",
      members: g.Members || [],
      lastMessage: "",
      unreadCount: 0,
    }));

    setChats((prev: any) => {
      const personalChats = prev.filter((c: any) => !c.isGroup);
      return [...formattedGroups, ...personalChats];
    });

  } catch (err) {
    console.log("Fetch Groups Error:", err);
  }
};
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const userId = Number(localStorage.getItem("userId"));
  const storedSelectedChat = Number(localStorage.getItem("selectedChat"));

  // 🔥 STEP 3 FIX: real users from DB
  const [chats, setChats] = useState<ChatType[]>([]);

  const [selectedChat, setSelectedChat] = useState<number | null>(
    Number.isNaN(storedSelectedChat) ? null : storedSelectedChat
  );
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const currentChat = chats.find((c) => c.id === selectedChat);
  const { unreadCounts, loadUnread } = useUnread();

const { handleFileSelect } = useFileUpload({ selectedChat, setMessages, setChats,});
const { handleSend } = useSendMessage({ userId, selectedChat, message, currentChat, setMessage, setMessages,
  setChats,});

useMessages({ selectedChat, currentChat, setMessages, setChats, loadUnread,});
useUsers({ userId, selectedChat, setSelectedChat, setChats, });

  const handleSelectChat = (id: number) => {
    setSelectedChat(id);
    localStorage.setItem("selectedChat", String(id));
  };
  const toggleMember = (id: number) => {
  setSelectedMembers((prev) =>
    prev.includes(id)
      ? prev.filter((memberId) => memberId !== id)
      : [...prev, id]
  );
};

  useEffect(() => {
    if (selectedChat !== null) {
      localStorage.setItem("selectedChat", String(selectedChat));
    }
  }, [selectedChat]);

  const handleCreateGroup = async () => {
  if (!groupName.trim()) {
    alert("Please enter group name");
    return;
  }

  if (selectedMembers.length < 2) {
    alert("Select at least 2 members");
    return;
  }

  try {
    console.log("Group Name:", groupName);
    console.log("Selected Members:", selectedMembers);
    await createGroup(groupName, selectedMembers);
    await fetchGroups();

    setGroupName("");
    setSelectedMembers([]);
    setShowCreateGroup(false);
  } catch (err) {
    console.error(err);
    alert("Failed to create group");
  }
};

useEffect(() => {
  fetchGroups();
}, []);

const handleReceive = (data: any) => {
   if (
      (data.sender === selectedChat && data.receiver === userId) ||
      (data.sender === userId && data.receiver === selectedChat)
    ) {

      const msg = {
        sender: data.sender,
        receiver: data.receiver,
        text: data.text,
        type: data.type,
        fileUrl: data.fileUrl,
        fileName: data.fileName,
        time: new Date(data.createdAt).toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, msg]);

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === data.sender || chat.id === data.receiver
            ? {
                ...chat,
                lastMessage:
                  data.text ||
                  (data.fileName ? `📎 ${data.fileName}` : "Attachment"),
              }
            : chat
        )
      );
    }
  };

  // ✅ Hook yahan call hoga
  useSocket({
    userId,
    selectedChat,
    loadUnread,
    onReceive: handleReceive,
  });

          const chatsWithUnread = chats.map(chat => ({
          ...chat,
          unreadCount: unreadCounts[chat.id] || undefined,
        }));

  return (
    <div className="h-screen flex bg-[#f0f2f5]">

      <Sidebar
        chats={chatsWithUnread}
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
        onCreateGroup={() => setShowCreateGroup(true)}
      />

      <div className="flex-1 flex flex-col">

        <ChatHeader
        name={currentChat?.name || "Select User"}
        isGroup={currentChat?.isGroup}
        />

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, i) => (
            <MessageBubble
              key={i}
              text={msg.text}
              sender={msg.sender === userId ? "me" : "other"}
              time={msg.time}
              type={msg.type}
              fileUrl={msg.fileUrl}
              fileName={msg.fileName}
            />
          ))}
        </div>

        <MessageInput
          message={message}
          setMessage={setMessage}
          handleSend={handleSend}
          onFileSelect={handleFileSelect}
        />
        {showCreateGroup && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 w-[400px] shadow-xl">

      <h2 className="text-xl font-bold mb-4">
        Create Group
      </h2>

      <input type="text"
  placeholder="Enter Group Name"
  value={groupName}
  onChange={(e) => setGroupName(e.target.value)}
  className="w-full border rounded-lg p-2 mb-4"
/>
<div className="max-h-60 overflow-y-auto border rounded-lg mb-4">
  {chats
    .filter((chat) => !chat.isGroup)
    .map((chat) => (
      <label
        key={chat.id}
        className="flex items-center gap-3 p-3 border-b cursor-pointer hover:bg-gray-100"
      >
        <input
          type="checkbox"
          checked={selectedMembers.includes(chat.id)}
          onChange={() => toggleMember(chat.id)}
        />

        <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
          {chat.name.charAt(0).toUpperCase()}
        </div>

        <span>{chat.name}</span>
      </label>
    ))}
</div>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => setShowCreateGroup(false)}
          className="px-4 py-2 bg-gray-300 rounded-lg"
        >
          Cancel
        </button>

        <button
           onClick={handleCreateGroup}
           className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
           Create
        </button>
      </div>

    </div>
  </div>
)}

      </div>
    </div>
  );
}

export default Chat;