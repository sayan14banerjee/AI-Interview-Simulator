import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let refreshQueue = [];

const clearAuthAndRedirect = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');

  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};

const resolveRefreshQueue = (error, token = null) => {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
      return;
    }
    resolve(token);
  });
  refreshQueue = [];
};

const requestNewAccessToken = async () => {
  const refreshToken = localStorage.getItem('refresh_token');

  if (!refreshToken) {
    throw new Error('Refresh token is missing');
  }

  const response = await axios.post(`${API_URL}/auth/refresh`, null, {
    params: {
      refresh_token: refreshToken,
    },
  });

  const accessToken = response.data?.access_token;

  if (!accessToken) {
    throw new Error('Refresh response did not include an access token');
  }

  localStorage.setItem('access_token', accessToken);
  return accessToken;
};

// Add request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refresh_token');

      if (!refreshToken) {
        clearAuthAndRedirect();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        try {
          const token = await new Promise((resolve, reject) => {
            refreshQueue.push({ resolve, reject });
          });

          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }

      isRefreshing = true;

      try {
        const accessToken = await requestNewAccessToken();
        resolveRefreshQueue(null, accessToken);

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (err) {
        resolveRefreshQueue(err, null);
        clearAuthAndRedirect();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (name, email, password, role = 'candidate') =>
    api.post('/auth/register', { name, email, password, role }),
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  getMe: () => api.get('/auth/me'),
  logout: (refreshToken) =>
    api.post('/auth/logout', null, {
      params: {
        refresh_token: refreshToken,
      },
    }),
};

// Resume API calls
export const resumeAPI = {
  upload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/resume/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Interview API calls
export const interviewAPI = {
  createInterview: (role, difficulty, interviewType) =>
    api.post('/interview/create', {
      role,
      difficulty,
      interview_type: interviewType,
    }),
  generateQuestions: (sessionId) =>
    api.post(`/interview/${sessionId}/generate-questions`, {
      session_id: sessionId,
    }),
  submitAnswer: (questionId, answer, responseTime) =>
    api.post(`/interview/${questionId}/submit-answer`, {
      question_id: questionId,
      answer,
      response_time: responseTime,
    }),
  getReport: (sessionId) =>
    api.get(`/interview/${sessionId}/report`),
};

// User API calls
export const userAPI = {
  getProfile: () => api.get('/users/me'),
  getAllUsers: () => api.get('/users/admin/users'),
  getUserProfile: (userId) => api.get(`/users/admin/user/${userId}`),
};

export default api;
