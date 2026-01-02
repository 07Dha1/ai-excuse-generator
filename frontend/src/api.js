import axios from "axios";

const API = axios.create({
  REACT_APP_API_URL = https://ai-excuse-generator-j2se.onrender.com,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("excuse_token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
