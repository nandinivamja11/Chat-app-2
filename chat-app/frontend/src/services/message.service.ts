import axios from "axios";

const API_URL = "http://localhost:5000/api/message";

// ==========================
// Get All Users
// ==========================
export const getUsers = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    "http://localhost:5000/api/auth/users",
    {
      headers: {
        Authorization: token,
      },
    }
  );

  return response.data;
};

// ==========================
// Get Conversation
// ==========================
export const getConversation = async (
  userId: string
) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/${userId}`,
    {
      headers: {
        Authorization: token,
      },
    }
  );

  return response.data;
};

// ==========================
// Send Message
// ==========================
export const sendMessage = async (
  receiver: string,
  message: string
) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${API_URL}/send`,
    {
      receiver,
      message,
    },
    {
      headers: {
        Authorization: token,
      },
    }
  );

  return response.data;
};

// ==========================
// Get My Chats
// ==========================
export const getMyChats = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    API_URL,
    {
      headers: {
        Authorization: token,
      },
    }
  );

  return response.data;
};