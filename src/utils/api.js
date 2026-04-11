import axios from 'axios';

const DEFAULT_API_BASE_URL = 'https://api.wildsafe.daniruranathunga.live/api';
const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL;
const trimmedBaseUrl = configuredBaseUrl.replace(/\/+$/, '');

export const API_BASE_URL = /\/api$/i.test(trimmedBaseUrl)
    ? trimmedBaseUrl
    : `${trimmedBaseUrl}/api`;

export const API_ORIGIN = API_BASE_URL.replace(/\/api$/i, '');

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15_000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
