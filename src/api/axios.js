import axios from "axios";

const api = axios.create({
  baseURL: "https://bsp-backend-femb.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
