// import axios from "axios";

// const api = axios.create({
//   baseURL: "https://bsp-backend-femb.onrender.com/api",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export default api;


import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

