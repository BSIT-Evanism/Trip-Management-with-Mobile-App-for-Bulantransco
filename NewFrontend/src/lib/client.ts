import axios from "axios";

export const fetchClient = axios.create({
  baseURL: "http://localhost:5002",
  timeout: 1000,
});
