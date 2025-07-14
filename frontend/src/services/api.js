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

export async function summarizeText(text) {
  const res = await fetch('/api/summarize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error('Failed to summarize');
  return await res.json();
}

export async function generateMCQs(text) {
  const res = await fetch('/api/mcqs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error('Failed to generate MCQs');
  return await res.json();
}

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
export async function getHistory() {
  const res = await fetch('/api/history/');
  if (!res.ok) throw new Error('Failed to fetch history');
  return await res.json();
}

export async function saveHistory(item) {
  const res = await fetch('/api/history/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error('Failed to save history');
  return await res.json();
}

export async function saveHistoryResponse(idx, answers) {
  const res = await fetch(`/api/history/response/${idx}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(answers),
  });
  if (!res.ok) throw new Error('Failed to save response');
  return await res.json();
}