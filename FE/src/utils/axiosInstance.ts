import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api", // Bạn có thể để trống và gán trong provider
  withCredentials: true, // 👈 Rất quan trọng khi dùng cookie
});

export default axiosInstance;
