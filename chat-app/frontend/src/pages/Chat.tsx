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
import Picker from "emoji-picker-react";
import { createGroup, getMyGroups, deleteGroupMessage } from "../services/group.service";
import SettingsModal from "../components/chat/SettingsModal";
import GroupInfoModal from "../components/chat/GroupInfoModal";
import { deleteMessage, reactToMessage } from "../services/message.service";
import socket from "../socket";
import { forwardMessage } from "../services/message.service";
import { forwardGroupMessage } from "../services/group.service";
import ForwardModal from "../components/chat/ForwardModal";

function Chat() {
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupName, setGroupName] = useState("");

  const [showSettings, setShowSettings] = useState(false);
  const [showGroupInfo, setShowGroupInfo] = useState(false);

  const [chats, setChats] = useState<ChatType[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const userId = Number(localStorage.getItem("userId"));
  const storedSelectedChat = localStorage.getItem("selectedChat");
  const normalizedSelectedChat = storedSelectedChat
    ? storedSelectedChat.startsWith("group-") || storedSelectedChat.startsWith("user-")
      ? storedSelectedChat
      : `user-${storedSelectedChat}`
    : null;

  const [selectedChat, setSelectedChat] = useState<string | null>(normalizedSelectedChat);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const chatAreaRef = useRef<HTMLDivElement | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuTop, setMenuTop] = useState<number>(0);
  const [menuLeft, setMenuLeft] = useState<number | null>(null);
  const [menuMessage, setMenuMessage] = useState<any>(null);
  const [menuShowPicker, setMenuShowPicker] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [replyMessage, setReplyMessage] = useState<any>(null);
  const [showForward, setShowForward] = useState(false);
  const [forwardMessageData, setForwardMessageData] = useState<any>(null);
  const [editingMessage, setEditingMessage] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentChat = chats.find((c) => c.id === selectedChat);
  const { unreadCounts, loadUnread } = useUnread();

  const { handleFileSelect } = useFileUpload({ selectedChat, currentChat, setMessages, setChats });
  const { handleSend } = useSendMessage({
    userId,
    selectedChat,
    message,
    currentChat,
    replyMessage,
    setReplyMessage,
    editingMessage,
    setEditingMessage,
    setMessage,
    setMessages,
    setChats,
  });

  useMessages({ selectedChat, currentChat, setMessages, setChats, loadUnread });
  useUsers({ userId, selectedChat, setSelectedChat, setChats });

  const fetchGroups = async () => {
    try {
      const groups = await getMyGroups();
      const formattedGroups = groups.map((g: any) => ({
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
        lastMessage: g.Messages?.length > 0 ? g.Messages[0].message : "",
        unreadCount: unreadCounts[`group-${g.id}`] || 0,
      }));

      setChats((prev: any) => {
        const personalChats = prev.filter((c: any) => !c.isGroup);
        return [...formattedGroups, ...personalChats];
      });
    } catch (err) {
      console.log("Fetch Groups Error:", err);
    }
  };

  useEffect(() => {
    if (chats.length > 0) fetchGroups();
  }, [chats.length]);

  const getMemberId = (chatId: number | string) => {
    if (typeof chatId === "number") return chatId;
    return Number(String(chatId).replace(/^user-/, ""));
  };

  const toggleMember = (id: number) => {
    setSelectedMembers((prev) => (prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]));
  };

  useEffect(() => {
    if (selectedChat !== null) {
      localStorage.setItem("selectedChat", String(selectedChat));
    } else {
      localStorage.removeItem("selectedChat");
    }
  }, [selectedChat]);

  useEffect(() => {
    if (chats.length === 0) return;
    if (selectedChat && chats.some((chat) => String(chat.id) === selectedChat)) return;

    const firstChatId = String(chats[0].id);
    setSelectedChat(firstChatId);
    localStorage.setItem("selectedChat", firstChatId);
  }, [chats, selectedChat]);

  const handleSelectChat = (id: string) => {
    const stringId = String(id);
    setSelectedChat(stringId);
    localStorage.setItem("selectedChat", stringId);
  };

  const handleOpenMenu = (e: any, message: any) => {
    const container = chatAreaRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const el = container.querySelector(`[data-msg-id="msg-${message.id}"]`) as HTMLElement | null;
    if (el) {
      const elRect = el.getBoundingClientRect();
      const top = elRect.top - rect.top + elRect.height + container.scrollTop;
      let left = elRect.left - rect.left + elRect.width - 200;
      const menuWidth = 180;
      const containerWidth = rect.width;
      if (left + menuWidth > containerWidth - 8) left = containerWidth - menuWidth - 8;
      if (left < 8) left = 8;
      setMenuTop(top);
      setMenuLeft(left);
    } else {
      const top = rect ? e.clientY - rect.top : e.clientY;
      const left = rect ? e.clientX - rect.left : e.clientX;
      setMenuTop(top + (container.scrollTop || 0));
      setMenuLeft(left);
    }

    setMenuMessage(message);
    setMenuVisible(true);
    setMenuShowPicker(false);
  };

  useEffect(() => {
    const container = chatAreaRef.current;
    if (!container || !menuVisible || !menuMessage) return;

    const updatePos = () => {
      const rect = container.getBoundingClientRect();
      const el = container.querySelector(`[data-msg-id="msg-${menuMessage.id}"]`) as HTMLElement | null;
      if (!el) return;
      const elRect = el.getBoundingClientRect();
      const top = elRect.top - rect.top + elRect.height + container.scrollTop;
      let left = elRect.left - rect.left + elRect.width - 200;
      const menuWidth = 180;
      const containerWidth = rect.width;
      if (left + menuWidth > containerWidth - 8) left = containerWidth - menuWidth - 8;
      if (left < 8) left = 8;
      setMenuTop(top);
      setMenuLeft(left);
    };

    container.addEventListener("scroll", updatePos);
    window.addEventListener("resize", updatePos);
    updatePos();

    return () => {
      container.removeEventListener("scroll", updatePos);
      window.removeEventListener("resize", updatePos);
    };
  }, [menuVisible, menuMessage]);

  const closeMenu = () => {
    setMenuVisible(false);
    setMenuMessage(null);
    setMenuShowPicker(false);
  };

  const handleReceive = (data: any) => {
    // simplistic receive handler — append messages when appropriate
    if (data.groupId) {
      if (currentChat?.isGroup && Number(currentChat.groupId) === Number(data.groupId)) {
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
          reactions: [],
          time: new Date(data.createdAt).toLocaleTimeString(),
        };
        setMessages((prev) => [...prev, msg]);
      }
      setChats((prev) =>
        prev.map((chat) =>
          chat.isGroup && chat.groupId === data.groupId
            ? { ...chat, lastMessage: data.text || data.message || (data.fileName ? `📎 ${data.fileName}` : "Attachment") }
            : chat
        )
      );
      loadUnread();
      return;
    }

    const selectedUserId = selectedChat?.startsWith("user-") ? Number(selectedChat.split("-")[1]) : null;
    if (
      selectedUserId &&
      ((data.sender === selectedUserId && data.receiver === userId) || (data.sender === userId && data.receiver === selectedUserId))
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
        reactions: [],
        time: new Date(data.createdAt).toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, msg]);

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === `user-${data.sender}` || chat.id === `user-${data.receiver}` ? { ...chat, lastMessage: data.text || (data.fileName ? `📎 ${data.fileName}` : "Attachment") } : chat
        )
      );
    }
  };

  const handleMessageEdited = (data: any) => {
    setMessages((prev: any) => prev.map((msg: any) => (msg.id === data.id ? { ...msg, text: data.message, edited: true } : msg)));
  };

  const handleMessageDeleted = (data: any) => {
    if (!data?.id) return;
    setMessages((prev: any) =>
      prev.map((msg: any) =>
        msg.id === data.id
          ? { ...msg, text: data.type === "everyone" ? "This message was deleted" : msg.text, fileUrl: data.type === "everyone" ? null : msg.fileUrl, fileName: data.type === "everyone" ? null : msg.fileName, type: data.type === "everyone" ? "text" : msg.type }
          : msg
      )
    );
  };

  const handleReactionUpdated = (data: any) => {
    setMessages((prev) => prev.map((msg) => (String(msg.id) !== String(data.messageId) ? msg : { ...msg, reactions: data.reactions || msg.reactions || [] })));
  };

  const handleReaction = async (messageId: number, emoji: string) => {
    let previousMessages: any[] = [];
    setMessages((prev: any) => {
      previousMessages = prev;
      return prev.map((msg: any) => {
        if (msg.id !== messageId) return msg;
        const reactions = msg.reactions || [];
        const mine = reactions.find((r: any) => r.user?.id === userId);
        let updated = [...reactions];
        if (mine) {
          updated = updated.map((r: any) => (r.user?.id === userId ? { ...r, emoji } : r));
        } else {
          updated.push({ emoji, user: { id: userId } });
        }
        return { ...msg, reactions: updated };
      });
    });

    try {
      await reactToMessage(messageId, emoji);
    } catch (err) {
      console.error("React API failed, reverting UI", err);
      setMessages(previousMessages);
    }
  };

  const handleDeleteClick = (msg: any) => {
    setSelectedMessage(msg);
    setShowDeletePopup(true);
  };

  const handleDelete = async (type: "me" | "everyone") => {
    if (!selectedMessage) return;
    try {
      if (currentChat?.isGroup) await deleteGroupMessage(selectedMessage.id, type);
      else await deleteMessage(selectedMessage.id, type);
      if (type === "me") setMessages((prev: any) => prev.filter((msg: any) => msg.id !== selectedMessage.id));
      else setMessages((prev: any) => prev.map((msg: any) => (msg.id === selectedMessage.id ? { ...msg, text: "This message was deleted", fileUrl: null, fileName: null, type: "text" } : msg)));
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
        const res = await forwardGroupMessage({ messageId: forwardMessageData.id, groupId: target.groupId, sourceType: currentChat?.isGroup ? "group" : "private" });
        const newMessage = res.data;
        socket.emit("send_group_message", { messageId: forwardMessageData.id, groupId: newMessage.groupId, senderId: newMessage.senderId, text: newMessage.message, type: newMessage.type, fileUrl: newMessage.fileUrl, fileName: newMessage.fileName, forwarded: true, createdAt: newMessage.createdAt });
      } else {
        const receiver = Number(target.userId ?? target.id?.replace(/^user-/, ""));
        if (!receiver) continue;
        const res = await forwardMessage({ messageId: forwardMessageData.id, receiver, sourceType: currentChat?.isGroup ? "group" : "private" });
        socket.emit("send_message", { id: res.data.data.id, sender: res.data.data.sender, receiver: res.data.data.receiver, text: res.data.data.message, type: res.data.data.type, fileUrl: res.data.data.fileUrl, fileName: res.data.data.fileName, forwarded: true, createdAt: res.data.data.createdAt });
      }
    }
    setShowForward(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useSocket({ userId, selectedChat, loadUnread, onReceive: handleReceive, onMessageEdited: handleMessageEdited, onMessageDeleted: handleMessageDeleted, onReactionUpdated: handleReactionUpdated });

  const chatsWithUnread = chats.map((chat) => ({ ...chat, unreadCount: unreadCounts[chat.id as string] }));

  return (
    <div className="h-screen flex bg-[#f0f2f5]">
      <Sidebar chats={chatsWithUnread} selectedChat={selectedChat} setSelectedChat={handleSelectChat} onCreateGroup={() => setShowCreateGroup(true)} setShowSettings={setShowSettings} />

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      {showGroupInfo && <GroupInfoModal group={currentChat} onClose={() => setShowGroupInfo(false)} />}

      <div className="flex-1 flex flex-col relative">
        <ChatHeader name={currentChat?.name || "Select User"} profileImage={currentChat?.isGroup ? currentChat?.avatar : currentChat?.profileImage} isGroup={currentChat?.isGroup} onOpenGroupInfo={() => setShowGroupInfo(true)} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <div ref={chatAreaRef} className="flex-1 overflow-y-auto p-6 space-y-4 relative bg-[#f0f2f5]">
            {messages.map((msg, i) => (
              <MessageBubble
                key={msg.id ?? i}
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
                reactions={msg.reactions}
                onReaction={handleReaction}
                onReply={() => {
                  setReplyMessage(msg);
                  closeMenu();
                }}
                onForward={() => {
                  setForwardMessageData(msg);
                  setShowForward(true);
                  closeMenu();
                }}
                onOpenMenu={handleOpenMenu}
                onDelete={() => handleDeleteClick(msg)}
                onEdit={() => {
                  setEditingMessage(msg);
                  setMessage(msg.text);
                }}
              />
            ))}

            <div ref={messagesEndRef}></div>

            {menuVisible && menuMessage && (
              <div style={{ position: "absolute", top: menuTop, left: menuLeft ?? undefined }} className="z-50">
                <div className="w-44 text-blue-500 bg-white rounded-lg shadow-lg border">
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => { setReplyMessage(menuMessage); closeMenu(); }}>
                    Reply
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => { setMenuShowPicker(true); }}>
                    Reaction
                  </button>
                  {menuShowPicker && (
                    <div className="absolute -bottom-44 right-0 z-50">
                      <Picker
                        onEmojiClick={async (...args: any) => {
                          const maybe = args[0] || args[1];
                          const emojiChar = maybe?.emoji ?? maybe?.native ?? (typeof maybe === "string" ? maybe : undefined);
                          if (emojiChar) await handleReaction(menuMessage.id, emojiChar);
                          setMenuShowPicker(false);
                          closeMenu();
                        }}
                      />
                    </div>
                  )}
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => { setForwardMessageData(menuMessage); setShowForward(true); closeMenu(); }}>
                    Forward
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => { setEditingMessage(menuMessage); setMessage(menuMessage.text); closeMenu(); }}>
                    Edit
                  </button>
                  <button className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100" onClick={() => { setSelectedMessage(menuMessage); setShowDeletePopup(true); closeMenu(); }}>
                    Delete
                  </button>
                </div>
              </div>
            )}

            {replyMessage && (
              <div className="bg-gray-100 border-l-4 border-green-500 p-2 flex justify-between">
                <div>
                  <p className="text-xs text-green-600">Replying</p>
                  <p className="text-sm truncate">{replyMessage.text}</p>
                </div>
                <button onClick={() => setReplyMessage(null)}>✕</button>
              </div>
            )}

            {showForward && <ForwardModal chats={chats} onClose={() => setShowForward(false)} onSend={handleForward} />}
          </div>

          <div className="bg-white p-3 shadow-inner">
            <MessageInput message={message} setMessage={setMessage} handleSend={handleSend} onFileSelect={handleFileSelect} />
          </div>

          {showDeletePopup && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-5 w-80">
                <h2 className="text-lg font-semibold mb-4">Delete Message</h2>
                <button onClick={() => handleDelete("everyone")} className="w-full py-2 mb-2 rounded bg-red-500 text-white">
                  Delete for Everyone
                </button>
                <button onClick={() => handleDelete("me")} className="w-full py-2 mb-2 rounded bg-gray-200">
                  Delete for Me
                </button>
                <button onClick={() => { setShowDeletePopup(false); setSelectedMessage(null); }} className="w-full py-2 rounded">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {showCreateGroup && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 w-100 shadow-xl">
                <h2 className="text-xl font-bold mb-4">Create Group</h2>

                <input type="text" placeholder="Enter Group Name" value={groupName} onChange={(e) => setGroupName(e.target.value)} className="w-full border rounded-lg p-2 mb-4" />

                <div className="max-h-60 overflow-y-auto border rounded-lg mb-4">
                  {chats.filter((chat) => !chat.isGroup).map((chat) => (
                    <label key={chat.id} className="flex items-center gap-3 p-3 border-b cursor-pointer hover:bg-gray-100">
                      <input type="checkbox" checked={selectedMembers.includes(getMemberId(chat.id))} onChange={() => toggleMember(getMemberId(chat.id))} />

                      <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">{chat.name.charAt(0).toUpperCase()}</div>

                      <span>{chat.name}</span>
                    </label>
                  ))}
                </div>

                <div className="flex justify-end gap-2">
                  <button onClick={() => setShowCreateGroup(false)} className="px-4 py-2 bg-gray-300 rounded-lg">Cancel</button>
                  <button onClick={handleCreateGroup} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">Create</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chat;
