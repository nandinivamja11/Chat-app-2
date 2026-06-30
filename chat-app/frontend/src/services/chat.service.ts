import api from "./api";

export const getMessages = async () => {
  const response = await api.get("/chat/messages");
  return response.data;
};

export const sendMessage = async (message: string) => {
  const response = await api.post("/chat/messages", { message });
  return response.data;
};