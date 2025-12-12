import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,   // for Vite
});

// Attach token for protected routes
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("excuse_token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
