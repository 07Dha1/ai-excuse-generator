import axios from "axios";

const API = axios.create({
  baseURL: "https://ai-excuse-generator-j2se.onrender.com",   // for Vite
});

// Attach token for protected routes
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("excuse_token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;