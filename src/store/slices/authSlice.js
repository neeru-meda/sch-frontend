import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      // Map full_name to name for frontend compatibility
      const user = { ...action.payload.user };
      user.name = user.full_name || user.name || '';
      user.linkedin = user.linkedin || '';
      user.github = user.github || '';
      state.user = user;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
    updateProfile: (state, action) => {
      const updated = { ...state.user, ...action.payload };
      updated.name = updated.full_name || updated.name || '';
      updated.linkedin = updated.linkedin || '';
      updated.github = updated.github || '';
      state.user = updated;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logout, 
  updateProfile, 
  clearError 
} = authSlice.actions;

export default authSlice.reducer; 