import axios from "axios";

const instance = axios.create({
  baseURL: "https://localhost:7003/api", // backend API
});

instance.interceptors.request.use((config) => {
  //   const token = localStorage.getItem("token");
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjY4ZGFjNmU1OTYzODk1Njc0OTUzYjZhMiIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6Im5ndXllbnZhbmFAZXhhbXBsZS5jb20iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJmcmVlbGFuY2VyIiwiZXhwIjoxNzU5MjIxMDc2LCJpc3MiOiJMYW5TZXJ2ZSIsImF1ZCI6IkxhblNlcnZlQ2xpZW50In0.QjPDSBO-BHo3EIxwx6VBVKpkuzJExdJ4e5rjEtIW9O0";
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default instance;
