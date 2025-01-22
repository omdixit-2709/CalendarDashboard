import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://calendar-dashboard-backend.onrender.com';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true
});
