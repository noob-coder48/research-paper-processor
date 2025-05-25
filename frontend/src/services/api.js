import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const signup = async (userData) => {
    return axios.post(`${API_URL}/signup`, userData);
};

export const login = async (credentials) => {
    return axios.post(`${API_URL}/login`, credentials);
};

export const uploadPDF = async (formData) => {
    return axios.post(`${API_URL}/upload`, formData, {
        headers: {
            ...getAuthHeaders(),
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const fetchPapers = async () => {
    const response = await axios.get(`${API_URL}/papers`, {
        headers: getAuthHeaders(),
    });
    return response.data;
};

export const exportToExcel = async () => {
    return axios.get(`${API_URL}/papers/export`, {
        headers: getAuthHeaders(),
        responseType: 'blob',
    });
};

export const deletePaper = async (paperId) => {
    const token = localStorage.getItem('token');
    return axios.delete(`${API_URL}/papers/${paperId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
};

export default API_URL;