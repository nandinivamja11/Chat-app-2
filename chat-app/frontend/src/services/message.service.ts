import api from "./api";

// ==========================
// Get All Users
// ==========================
export const getUsers = async () => {
  const response = await api.get("/auth/users");
  return response.data;
};

// ==========================
// Get Conversation
// ==========================
export const getConversation = async (userId: string) => {
  const response = await api.get(`/message/conversation/${userId}`);
  return response.data;
};

// ==========================
// Send Message
// ==========================
export const sendMessage = async (receiver: string, message: string) => {
  const response = await api.post("/message/send", {
    receiver,
    message,
  });
  return response.data;
};

// ==========================
// Get My Chats
// ==========================
export const getMyChats = async () => {
  const response = await api.get("/message/chats");
  return response.data;
};

export const getUnreadCounts = async () => {
  return api.get("/message/unread");
};

export const markSeen = async (senderId: number)=>{

    return api.put("/message/seen/" + senderId);
};