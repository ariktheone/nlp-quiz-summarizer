import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// File upload requires multipart/form-data
const fileApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export const summarizeText = async (text) => {
  const response = await api.post('/summarize', { text });
  return response.data;
};

export const generateMCQs = async (text) => {
  const response = await api.post('/mcqs', { text });
  return response.data;
};

export const processFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fileApi.post('/process-file', formData);
  return response.data;
};

export const processURL = async (url) => {
  const response = await api.post('/process-url', { url });
  return response.data;
};

// For history feature (if implemented)
export const saveToHistory = async (data) => {
  const response = await api.post('/history', data);
  return response.data;
};

export const getHistory = async () => {
  const response = await api.get('/history');
  return response.data;
};