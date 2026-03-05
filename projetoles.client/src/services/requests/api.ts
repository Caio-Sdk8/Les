import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7170",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
