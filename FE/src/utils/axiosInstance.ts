import axios from "axios";
import { API_URL } from "./constant";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // Rất quan trọng khi dùng cookie
});

export default axiosInstance;
