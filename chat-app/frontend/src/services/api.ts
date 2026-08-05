import axios from "axios";

// In dev use direct backend to avoid proxy issues; in production use configured VITE_API_URL or /api
const API_BASE_URL = import.meta.env.PROD
  ? (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "")
  : (import.meta.env.VITE_API_URL_DEV || "http://localhost:5000/api");

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;