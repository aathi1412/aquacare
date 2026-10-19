import { create } from 'zustand';
import api from '../services/api.js';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('aquapure_admin_token') || null,
  isAuthenticated: Boolean(localStorage.getItem('aquapure_admin_token')),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;
      localStorage.setItem('aquapure_admin_token', token);
      set({ token, user, isAuthenticated: true, isLoading: false, error: null });
      return { success: true };
    } catch (err) {
      set({
        isLoading: false,
        error: err.message || 'Login failed. Please check credentials.',
      });
      return { success: false, message: err.message };
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Ignore logout errors
    } finally {
      localStorage.removeItem('aquapure_admin_token');
      set({ user: null, token: null, isAuthenticated: false });
    }
  },

  checkAuth: async () => {
    const token = localStorage.getItem('aquapure_admin_token');
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return;
    }

    try {
      const res = await api.get('/auth/me');
      set({ user: res.data, isAuthenticated: true });
    } catch (err) {
      localStorage.removeItem('aquapure_admin_token');
      set({ user: null, token: null, isAuthenticated: false });
    }
  },
}));
