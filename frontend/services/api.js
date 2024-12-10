import axios from "axios";

export const api = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true,
    validateStatus: (status) => status >= 200 && status < 500,
});

export default api;