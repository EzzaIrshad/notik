import axios from "axios";

// Axios instance for API calls
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,  // sends cookie with requests
    timeout: 5000
})