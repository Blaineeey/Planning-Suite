'use client';

import { create } from 'zustand';
import { api } from '@/lib/api';

const useAuthStore = create((set, get) => ({
  user: null,
  organization: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Initialize auth from localStorage
  init: async () => {
    if (typeof window === 'undefined') return;
    
    set({ isLoading: true });
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      set({ 
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null
      });
      return;
    }

    try {
      const response = await api.auth.me();
      if (response && response.user) {
        set({
          user: response.user,
          organization: response.organization,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        // Token exists but user not found, clear it
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        localStorage.removeItem('organization');
        set({ 
          isLoading: false,
          isAuthenticated: false,
          user: null,
          token: null
        });
      }
    } catch (error) {
      // Token is invalid or expired, silently clear it
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      localStorage.removeItem('organization');
      set({ 
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null
      });
    }
  },

  // Login
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.auth.login({ email, password });
      
      if (response && response.token) {
        // Store token and user data
        localStorage.setItem('auth_token', response.token);
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
        }
        if (response.organization) {
          localStorage.setItem('organization', JSON.stringify(response.organization));
        }
        
        set({
          user: response.user,
          organization: response.organization,
          token: response.token,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
        
        return { success: true };
      } else {
        set({ 
          error: 'Invalid credentials',
          isLoading: false,
          isAuthenticated: false
        });
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (error) {
      set({ 
        error: error.message || 'Login failed',
        isLoading: false,
        isAuthenticated: false
      });
      return { success: false, error: error.message || 'Login failed' };
    }
  },

  // Register
  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.auth.register(data);
      
      if (response && response.token) {
        // Store token and user data
        localStorage.setItem('auth_token', response.token);
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
        }
        if (response.organization) {
          localStorage.setItem('organization', JSON.stringify(response.organization));
        }
        
        set({
          user: response.user,
          organization: response.organization,
          token: response.token,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
        
        return { success: true };
      } else {
        set({ 
          error: 'Registration failed',
          isLoading: false,
          isAuthenticated: false
        });
        return { success: false, error: 'Registration failed' };
      }
    } catch (error) {
      set({ 
        error: error.message || 'Registration failed',
        isLoading: false,
        isAuthenticated: false
      });
      return { success: false, error: error.message || 'Registration failed' };
    }
  },

  // Logout
  logout: () => {
    // Clear all storage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    localStorage.removeItem('organization');
    
    // Clear API token
    api.auth.logout();
    
    // Reset state
    set({
      user: null,
      organization: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  // Update user
  updateUser: (userData) => {
    set((state) => ({
      user: { ...state.user, ...userData }
    }));
    // Update localStorage
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    localStorage.setItem('user', JSON.stringify({ ...currentUser, ...userData }));
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  }
}));

export default useAuthStore;
