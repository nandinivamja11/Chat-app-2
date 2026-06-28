import api from "./api";

export const registerUser = async (
  username: string,
  email: string,
  password: string
) => {
  const response = await api.post("/auth/register", {
    username,
    email,
    password,
  });

  return response.data;
};

export const loginUser = async (
  email: string,
  password: string
) => {
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  localStorage.setItem("token", response.data.token);
  localStorage.setItem("user", JSON.stringify(response.data.user));

  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
};