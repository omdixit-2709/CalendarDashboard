import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5001',
    withCredentials: true
});

export const checkAuthStatus = async () => {
    try {
        const response = await api.get('/auth/status');
        return response.data;
    } catch (error) {
        console.error('Auth status check failed:', error);
        return { isAuthenticated: false, user: null };
    }
};