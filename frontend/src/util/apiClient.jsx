import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

console.log(import.meta.env.VITE_API_BASE_URL); // Should log your backend URL

export default apiClient;