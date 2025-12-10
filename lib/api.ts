/// <reference types="vite/client" />
// src/services/api.ts
import axios from "axios";

// Backend base URL from .env
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
  baseURL: backendUrl,
  headers: { "Content-Type": "application/json" },
});

//  Interceptor to attach token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
