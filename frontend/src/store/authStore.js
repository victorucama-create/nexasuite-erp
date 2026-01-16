import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      
      // Actions
      login: async (email, password) => {
        set({ loading: true, error: null });
        
        try {
          const response = await api.post('/auth/login', { email, password });
          const { user, token, refreshToken } = response.data;
          
          // Update state
          set({
            user,
            token,
            refreshToken,
            isAuthenticated: true,
            loading: false,
            error: null
          });
          
          // Set default headers for future requests
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          return { success: true, user };
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Erro ao fazer login';
          set({ loading: false, error: errorMessage });
          return { success: false, error: errorMessage };
        }
      },
      
      logout: () => {
        // Clear state
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          loading: false,
          error: null
        });
        
        // Remove authorization header
        delete api.defaults.headers.common['Authorization'];
        
        // Clear localStorage via persist
        localStorage.removeItem('auth-storage');
      },
      
      register: async (userData) => {
        set({ loading: true, error: null });
        
        try {
          const response = await api.post('/auth/register', userData);
          const { user, token, refreshToken } = response.data;
          
          set({
            user,
            token,
            refreshToken,
            isAuthenticated: true,
            loading: false,
            error: null
          });
          
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          return { success: true, user };
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Erro ao registrar';
          set({ loading: false, error: errorMessage });
          return { success: false, error: errorMessage };
        }
      },
      
      updateProfile: async (profileData) => {
        set({ loading: true, error: null });
        
        try {
          const response = await api.put('/auth/profile', profileData);
          const { user } = response.data;
          
          set({
            user: { ...get().user, ...user },
            loading: false,
            error: null
          });
          
          return { success: true, user };
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Erro ao atualizar perfil';
          set({ loading: false, error: errorMessage });
          return { success: false, error: errorMessage };
        }
      },
      
      changePassword: async (currentPassword, newPassword) => {
        set({ loading: true, error: null });
        
        try {
          await api.post('/auth/change-password', {
            currentPassword,
            newPassword
          });
          
          set({ loading: false, error: null });
          return { success: true };
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Erro ao alterar senha';
          set({ loading: false, error: errorMessage });
          return { success: false, error: errorMessage };
        }
      },
      
      refreshToken: async () => {
        const { refreshToken } = get();
        if (!refreshToken) return { success: false };
        
        try {
          const response = await api.post('/auth/refresh', { refreshToken });
          const { token, refreshToken: newRefreshToken } = response.data;
          
          set({
            token,
            refreshToken: newRefreshToken
          });
          
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          return { success: true };
        } catch (error) {
          // If refresh fails, logout user
          get().logout();
          return { success: false };
        }
      },
      
      clearError: () => set({ error: null }),
      
      // Getters
      getUser: () => get().user,
      getToken: () => get().token,
      isLoading: () => get().loading,
      hasRole: (role) => {
        const user = get().user;
        return user?.roles?.includes(role) || false;
      },
      
      // Check permissions
      hasPermission: (permission) => {
        const user = get().user;
        if (!user?.permissions) return false;
        
        // Check direct permission
        if (user.permissions.includes(permission)) return true;
        
        // Check wildcard permissions
        return user.permissions.some(p => {
          if (p.endsWith('.*')) {
            const prefix = p.slice(0, -2);
            return permission.startsWith(prefix);
          }
          return false;
        });
      }
    }),
    {
      name: 'auth-storage', // unique name for localStorage key
      getStorage: () => localStorage,
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated
      }),
      onRehydrateStorage: () => (state) => {
        // When rehydrating from localStorage, set axios header
        if (state?.token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
        }
      }
    }
  )
);

export default useAuthStore;
