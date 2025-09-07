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
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
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
            set({ 
              isLoading: false,
              isAuthenticated: false,
              user: null,
              token: null
            });
          }
        } catch (error) {
          // Token is invalid or expired
          console.log('Token validation failed, clearing auth');
          localStorage.removeItem('auth_token');
          set({ 
            isLoading: false,
            isAuthenticated: false,
            user: null,
            token: null
          });
        }
      } else {
        set({ 
          isLoading: false,
          isAuthenticated: false,
          user: null,
          token: null
        });
      }
    } catch (error) {
      console.error('Auth init error:', error);
      localStorage.removeItem('auth_token');
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
      
      if (response.success && response.token) {
        // Store token
        localStorage.setItem('auth_token', response.token);
        
        set({
          user: response.user,
          organization: response.organization,
          token: response.token,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
        
        return response;
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error) {
      set({ 
        error: error.message || 'Login failed',
        isLoading: false,
        isAuthenticated: false
      });
      throw error;
    }
  },

  // Register
  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.auth.register(data);
      
      if (response.success && response.token) {
        // Store token
        localStorage.setItem('auth_token', response.token);
        
        set({
          user: response.user,
          organization: response.organization,
          token: response.token,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
        
        return response;
      } else {
        throw new Error(response.error || 'Registration failed');
      }
    } catch (error) {
      set({ 
        error: error.message || 'Registration failed',
        isLoading: false,
        isAuthenticated: false
      });
      throw error;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('auth_token');
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
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  }
}));

export default useAuthStore;
