import axios from "axios";

// Create and export the basic Axios instance without interceptors
const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  withCredentials: true,
});

export default api;
