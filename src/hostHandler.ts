import axios, { AxiosInstance } from 'axios';

let baseURL: string;

if (process.env.NODE_ENV === 'development') {
    baseURL = 'http://localhost:5000/api';
} else {
    baseURL = '/api';
}

const axiosInstance: AxiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 5000,
});

export default axiosInstance;