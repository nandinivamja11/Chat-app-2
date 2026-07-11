import api from "./api";

export const getMessages = async () => {
  const response = await api.get("/chat/messages");
  return response.data;
};

export const sendMessage = async (message: string) => {
  const response = await api.post("/chat/messages", { message });
  return response.data;
};

// USERS
export const getUsers = async () => {
  const res = await api.get("/auth/users");
  return res.data;
};

// UNREAD
export const getUnreadChats = async () => {
  const res = await api.get("/message/unread");
  return res.data;
};

// CONVERSATION
export const getConversation = async (userId: number) => {
  const res = await api.get(`/message/conversation/${userId}`);
  return res.data;
};