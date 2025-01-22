import api from './api';

const API_URL = process.env.REACT_APP_API_URL || 'https://calendar-dashboard-backend.onrender.com';

export const loginWithGoogle = () => {
    window.location.href = `https://calendar-dashboard-backend.onrender.com/auth/google`;
};

export const logout = () => {
    window.location.href = `https://calendar-dashboard-backend.onrender.com/auth/logout`;
};