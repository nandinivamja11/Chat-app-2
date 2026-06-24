import api from "./api";

// Get all chats of logged in user
export const getChats = async () => {
  const response = await api.get("/chats");

  return response.data;
};

// Get single chat by id
export const getChatById = async (
  chatId: string
) => {
  const response = await api.get(
    `/chats/${chatId}`
  );

  return response.data;
};

// Create new chat
export const createChat = async (
  receiverId: string
) => {
  const response = await api.post(
    "/chats",
    {
      receiverId,
    }
  );

  return response.data;
};

// Delete chat
export const deleteChat = async (
  chatId: string
) => {
  const response = await api.delete(
    `/chats/${chatId}`
  );

  return response.data;
};