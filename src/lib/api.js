import axios from 'axios';

const api = axios.create({
  // baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5070',
  baseURL: '',            // giữ nguyên endpoint bạn gõ (vd: /api/Categories)
  withCredentials: false, // không dùng cookie trong dev, chỉ JWT header
  headers: { 'Content-Type': 'application/json' }
});

// interceptor (log nhẹ; có thể mở rộng cho JWT sau này)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('[API ERROR]', err?.response?.status, err?.response?.data);
    return Promise.reject(err);
  }
);

export default api;
