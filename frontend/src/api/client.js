import axios from "axios";
import { getDeviceId } from "./deviceId";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

client.interceptors.request.use((config) => {
  config.headers["X-Device-Id"] = getDeviceId();
  return config;
});

export default client;
