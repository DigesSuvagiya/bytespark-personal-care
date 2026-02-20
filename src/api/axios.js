// import axios from "axios";

// const api = axios.create({
//   baseURL: "https://bsp-backend-femb.onrender.com/api",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // export default api;

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("bytesparkToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;



