import axios from "axios";
import { APP_URL } from "../config/config";

const axiosInstance = axios.create({
  baseURL: APP_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach Authorization Header Before Each Request
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
       
      const token = localStorage.getItem("token"); // Get token from localStorage
      console.log(token)
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error fetching token:", error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle Unauthorized Responses (401)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized! Redirecting to login...");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
