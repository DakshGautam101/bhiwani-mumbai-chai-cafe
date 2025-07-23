import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'https://bhiwani-mumbai-chai-cafe.vercel.app/api', // Use your actual API base URL
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle auth errors
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Token is invalid, clear it
            localStorage.removeItem('token');
            window.location.href = '/auth';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;