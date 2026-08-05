import { useEffect, useState, useRef } from "react";
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
import { createGroup, getMyGroups, deleteGroupMessage } from "../services/group.service";
import SettingsModal from "../components/chat/SettingsModal";
import GroupInfoModal from "../components/chat/GroupInfoModal";
import { deleteMessage } from "../services/message.service";
import socket from "../socket";
import { forwardMessage } from "../services/message.service";
import { forwardGroupMessage } from "../services/group.service";
import ForwardModal from "../components/chat/ForwardModal";

function Chat() {
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupName, setGroupName] = useState("");
  
  const [showSettings, setShowSettings] = useState(false);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  
  const fetchGroups = async () => {
  try {
    const groups = await getMyGroups();
     console.log("MY GROUPS:", groups);

    const formattedGroups = groups.map((g: any) => {
  console.log("GROUP:", g);
  console.log("Members:", g.Members);

  return {
    id: `group-${g.id}`,
    groupId: g.id,
    name: g.groupName,
    isGroup: true,
    avatar: g.groupImage || "",
    members: (g.Members || []).map((m: any) => ({
  id: m.id,
  userId: m.userId,
  username: m.User?.username,
  profileImage: m.User?.profileImage,
})),  
    lastMessage:
      g.Messages?.length > 0 ? g.Messages[0].message : "",
    unreadCount: unreadCounts[`group-${g.id}`] || 0,
  };
});

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
  const storedSelectedChat = localStorage.getItem("selectedChat");
  const normalizedSelectedChat = storedSelectedChat
    ? storedSelectedChat.startsWith("group-") || storedSelectedChat.startsWith("user-")
      ? storedSelectedChat
      : `user-${storedSelectedChat}`
    : null;

  // 🔥 STEP 3 FIX: real users from DB
  const [chats, setChats] = useState<ChatType[]>([]);

  const [selectedChat, setSelectedChat] = useState<string | null>(
    normalizedSelectedChat
  );
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [replyMessage, setReplyMessage] = useState<any>(null);
  const [showForward, setShowForward] = useState(false);
  const [forwardMessageData, setForwardMessageData] = useState<any>(null);
  const [editingMessage,setEditingMessage]=useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentChat = chats.find((c) => c.id === selectedChat);
  const { unreadCounts, loadUnread } = useUnread();

const { handleFileSelect } = useFileUpload({ selectedChat, currentChat, setMessages, setChats,});
const { handleSend } = useSendMessage({ userId, selectedChat, message, currentChat, replyMessage,
  setReplyMessage, editingMessage, setEditingMessage, setMessage, setMessages, setChats,});

useMessages({ selectedChat, currentChat, setMessages, setChats, loadUnread,});
useUsers({ userId, selectedChat, setSelectedChat, setChats, });
console.log("CHATS:", chats);
console.log("CURRENT:", currentChat);
console.log("SELECTED:", selectedChat);

  const handleSelectChat = (id: string) => {
    console.log("Selected Chat:", id);
    setSelectedChat(id);
    localStorage.setItem("selectedChat", id);
  };
  const getMemberId = (chatId: number | string) => {
    if (typeof chatId === "number") return chatId;
    return Number(String(chatId).replace(/^user-/, ""));
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
  if (chats.length > 0) {
    fetchGroups();
  }
}, [chats.length]);

const handleReceive = (data: any) => {
  console.log("HANDLE RECEIVE:", data);
  // ===== Group Message =====
if (data.groupId)     {
  if (
  currentChat?.isGroup &&
  Number(currentChat.groupId) === Number(data.groupId)
) { 
    const msg = {
      id: data.id,
      sender: Number(data.senderId),
      senderName: data.senderName,
      text: data.text || data.message,
      forwarded: data.forwarded,
      type: data.type,
      fileUrl: data.fileUrl,
      fileName: data.fileName,
      replyTo: data.replyToData || null,
      time: new Date(data.createdAt).toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, msg]);
  }

  setChats((prev) =>
    prev.map((chat) =>
      chat.isGroup && chat.groupId === data.groupId
        ? {
            ...chat,
            lastMessage:
             data.text ||
              data.message ||
              (data.fileName ? `📎 ${data.fileName}` : "Attachment"),
          }
        : chat
    )
  );

    // Refresh unread counts so the UI updates in real-time
    loadUnread();

  return;
}

   const selectedUserId = selectedChat?.startsWith("user-")
    ? Number(selectedChat.split("-")[1])
    : null;

   if (
      selectedUserId &&
      ((data.sender === selectedUserId && data.receiver === userId) ||
      (data.sender === userId && data.receiver === selectedUserId))
    ) {

      const msg = {
        id: data.id,
        sender: Number(data.sender),
        receiver: Number(data.receiver),
        senderName: data.senderName,
        text: data.text,
        type: data.type,
        fileUrl: data.fileUrl,
        fileName: data.fileName,
        replyTo: data.replyToData || null,
        forwarded: Boolean(data.forwarded),
        time: new Date(data.createdAt).toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, msg]);

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === `user-${data.sender}` || chat.id === `user-${data.receiver}`
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
  const handleMessageEdited = (data: any) => {
  setMessages((prev: any) =>
    prev.map((msg: any) =>
      msg.id === data.id
        ? {
            ...msg,
            text: data.message,
            edited: true,
          }
        : msg
    )
  );
};
  const handleDeleteClick = (msg: any) => {
  setSelectedMessage(msg);
  setShowDeletePopup(true);
};
const handleDelete = async (type: "me" | "everyone") => {
  if (!selectedMessage) return;
  try {
    if (currentChat?.isGroup) {
       await deleteGroupMessage(selectedMessage.id, type);
    } else {
       await deleteMessage(selectedMessage.id, type);
    }
    if (type === "me") {
      setMessages((prev: any) =>
        prev.filter((msg: any) => msg.id !== selectedMessage.id)
      );
    } else {
      setMessages((prev: any) =>
        prev.map((msg: any) =>
          msg.id === selectedMessage.id
            ? {
                ...msg,
                text: "This message was deleted",
                fileUrl: null,
                fileName: null,
                type: "text",
              }
            : msg
        ));}
    setShowDeletePopup(false);
    setSelectedMessage(null);
  } catch (err) {
    console.log(err);
    alert("Delete failed");
  }
};
const handleForward = async (targets: any[]) => {
  if (!forwardMessageData) return;

  for (const target of targets) {
    if (target.isGroup) {
      const res = await forwardGroupMessage({
        messageId: forwardMessageData.id,
        groupId: target.groupId,
        sourceType: currentChat?.isGroup ? "group" : "private",
      });
      console.log("GROUP FORWARD RESPONSE:", res.data);
      const newMessage = res.data;

      socket.emit("send_group_message", {
        messageId: forwardMessageData.id,
        groupId: newMessage.groupId,
        senderId: newMessage.senderId,
        text: newMessage.message,
        type: newMessage.type,
        fileUrl: newMessage.fileUrl,
        fileName: newMessage.fileName,
        forwarded: true,
        createdAt: newMessage.createdAt,
      });
    } else {
      const receiver = Number(target.userId ?? target.id?.replace(/^user-/, ""));

      if (!receiver) {
        console.error("Forward target is missing a receiver id", target);
        continue;
      }

      const res = await forwardMessage({
        messageId: forwardMessageData.id,
        receiver,
        sourceType: currentChat?.isGroup ? "group" : "private",
      });

      socket.emit("send_message", {
        id: res.data.data.id,
        sender: res.data.data.sender,
        receiver: res.data.data.receiver,
        text: res.data.data.message,
        type: res.data.data.type,
        fileUrl: res.data.data.fileUrl,
        fileName: res.data.data.fileName,
        forwarded: true,
        createdAt: res.data.data.createdAt,
      });
    }
  }
  setShowForward(false);
};
  useEffect(() => {
  messagesEndRef.current?.scrollIntoView({
    behavior: "smooth",
  });
}, [messages]);

  // ✅ Hook yahan call hoga
  useSocket({
    userId,
    selectedChat,
    loadUnread,
    onReceive: handleReceive,
    onMessageEdited: handleMessageEdited,
  });

          const chatsWithUnread = chats.map(chat => ({
  ...chat,
          unreadCount: unreadCounts[chat.id as string]  ,
}));

  return (
    <div className="h-screen flex bg-[#f0f2f5]">

      <Sidebar
        chats={chatsWithUnread}
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
        onCreateGroup={() => setShowCreateGroup(true)}
        setShowSettings={setShowSettings}
      />
        {showSettings && (
      <SettingsModal
        onClose={() => setShowSettings(false)}
      />
    )}
    {showGroupInfo && (
  <GroupInfoModal
    group={currentChat}
    onClose={() => setShowGroupInfo(false)}
  />
)}

      <div className="flex-1 flex flex-col">

        <ChatHeader
           name={currentChat?.name || "Select User"}
           profileImage={currentChat?.isGroup ? currentChat?.avatar : currentChat?.profileImage}
           isGroup={currentChat?.isGroup}
           onOpenGroupInfo={() => setShowGroupInfo(true)}
        />

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, i) => (
            <MessageBubble
               key={i}
               id={msg.id}
               text={msg.text}
               sender={msg.sender === userId ? "me" : "other"}
               senderName={msg.senderName}
               time={msg.time}
               type={msg.type}
               fileUrl={msg.fileUrl}
               fileName={msg.fileName}
               replyTo={msg.replyTo}
               forwarded={msg.forwarded}
               edited={msg.edited}
               onReply={() => setReplyMessage(msg)}
               onForward={() => { setForwardMessageData(msg); setShowForward(true); }}
               onDelete={() => handleDeleteClick(msg)}
               onEdit={() => { console.log("EDIT CLICK:", msg);
                setEditingMessage(msg); setMessage(msg.text); }}
             />
          ))}
        <div ref={messagesEndRef}></div>
      </div>
       {replyMessage && (
<div className="bg-gray-100 border-l-4 border-green-500 p-2 flex justify-between">
    <div>
        <p className="text-xs text-green-600">
            Replying
        </p>
        <p className="text-sm truncate">
            {replyMessage.text}
        </p>
    </div>
    <button onClick={() => setReplyMessage(null)}>
        ✕
    </button>
</div>
)}
{showForward && (
    <ForwardModal
        chats={chats}
        onClose={() => setShowForward(false)}
        onSend={handleForward}
    />
)}
        <MessageInput
          message={message}
          setMessage={setMessage}
          handleSend={handleSend}
          onFileSelect={handleFileSelect}
        />
        {showDeletePopup && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-5 w-80">
      <h2 className="text-lg font-semibold mb-4">
        Delete Message
      </h2>
      <button onClick={() => handleDelete("everyone")}
         className="w-full py-2 mb-2 rounded bg-red-500 text-white">
         Delete for Everyone
      </button>
      <button onClick={() => handleDelete("me")}
         className="w-full py-2 mb-2 rounded bg-gray-200">
         Delete for Me
      </button>
      <button onClick={() => { setShowDeletePopup(false); setSelectedMessage(null);}}
          className="w-full py-2 rounded">
          Cancel
      </button>
    </div>
  </div>
)}

        {showCreateGroup && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 w-100 shadow-xl">

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
          checked={selectedMembers.includes(getMemberId(chat.id))}
          onChange={() => toggleMember(getMemberId(chat.id))}
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
          className="px-4 py-2 bg-gray-300 rounded-lg">
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