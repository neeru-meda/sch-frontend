import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => {
    // FastAPI expects x-www-form-urlencoded for login
    const params = new URLSearchParams();
    params.append('username', credentials.username);
    params.append('password', credentials.password);
    return api.post('/auth/login', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  },
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/me', data),
  changePassword: (oldPassword, newPassword) =>
    api.post('/auth/change-password', { old_password: oldPassword, new_password: newPassword }),
};

// Posts API calls
export const postsAPI = {
  getAllPosts: () => api.get('/posts'),
  getPostById: (id) => api.get(`/posts/${id}`),
  createPost: (postData) => api.post('/posts/', postData),
  updatePost: (id, postData) => api.put(`/posts/${id}`, postData),
  deletePost: (id) => api.delete(`/posts/${id}`),
  likePost: (id, userId) => api.post(`/posts/${id}/like`, { user_id: userId }),
  savePost: (id, userId) => api.post(`/posts/${id}/save`, { user_id: userId }),
};

// Comments API calls
export const commentsAPI = {
  getComments: (postId) => api.get(`/comments/post/${postId}`),
  getUserComments: (userId) => api.get(`/comments/user/${userId}`),
  // Now addComment only takes commentData, expects post_id in body
  addComment: (commentData) => api.post(`/comments`, commentData),
  updateComment: (commentId, commentData) => api.put(`/comments/${commentId}`, commentData),
  deleteComment: (commentId) => api.delete(`/comments/${commentId}`),
  likeComment: (commentId, userId) => api.post(`/comments/${commentId}/like`, { user_id: userId }),
};

// Users API calls
export const usersAPI = {
  searchUsers: (query) => api.get(`/users/search?q=${encodeURIComponent(query)}`),
  getUser: (userId) => api.get(`/users/${userId}`),
  getAllUsers: () => api.get('/users'),
};

export default api; 