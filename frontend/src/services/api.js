import { APP_CONFIG } from '../config/constants';

const getToken = () => localStorage.getItem(APP_CONFIG.STORAGE_KEYS.AUTH_TOKEN);

const api = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const response = await fetch(`${APP_CONFIG.API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `API Error: ${response.status}`);
  }
  return data;
};

export const authAPI = {
  login: (payload) => api('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  verifyOTP: (payload) => api('/auth/verify-otp', { method: 'POST', body: JSON.stringify(payload) }),
  getProfile: () => api('/auth/profile'),
  updateSettings: (settings) => api('/auth/settings', { method: 'PUT', body: JSON.stringify(settings) })
};

export const documentAPI = {
  upload: async (file) => {
    const token = getToken();
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/documents/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Upload failed');
    return data;
  },
  getDocuments: () => api('/documents'),
  getStatus: (id) => api(`/documents/${id}/status`),
  delete: (id) => api(`/documents/${id}`, { method: 'DELETE' })
};

export const aiAPI = {
  chat: (payload) => api('/ai/chat', { method: 'POST', body: JSON.stringify(payload) }),
  audioSummary: (payload) => api('/ai/audio-summary', { method: 'POST', body: JSON.stringify(payload) }),
  translate: (payload) => api('/ai/translate', { method: 'POST', body: JSON.stringify(payload) }),
  getConversations: () => api('/ai/conversations')
};

export const intelligenceAPI = {
  getOverview: () => api('/intelligence/overview'),
  detectConflicts: () => api('/intelligence/conflicts'),
  getMissingInfo: () => api('/intelligence/missing-info'),
  compareDocuments: (payload) => api('/intelligence/compare', { method: 'POST', body: JSON.stringify(payload) }),
  resolveIssue: (payload) => api('/intelligence/resolve', { method: 'POST', body: JSON.stringify(payload) }),
  getResolutionHistory: () => api('/intelligence/resolution-history'),
  getDecisionCockpit: () => api('/intelligence/cockpit'),
  getNextBestAction: () => api('/intelligence/next-best-action'),
  getChanges: () => api('/intelligence/changes')
};

export const actionsAPI = {
  getActions: () => api('/actions'),
  createAction: (payload) => api('/actions', { method: 'POST', body: JSON.stringify(payload) }),
  updateAction: (id, payload) => api(`/actions/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteAction: (id) => api(`/actions/${id}`, { method: 'DELETE' })
};

export const notificationsAPI = {
  getNotifications: () => api('/notifications')
};

export const sourcesAPI = {
  getSources: () => api('/sources')
};

export const actionAPI = actionsAPI;

