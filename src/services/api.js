import axios from 'axios';

const api = axios.create({
  baseURL: 'https://calendar-dashboard-backend.onrender.com/',
  withCredentials: true
});

export default api;