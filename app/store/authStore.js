import { create } from "zustand";
import axiosInstance from "@/lib/axios";

const useAuthStore = create((set) => {
  // Initial state
  const initialState = {
    isAdmin: false,
    isLoading: false,
    error: null,
    user: null,
  };

  return {
    ...initialState,

    // Signup
    signup: async (userData) => {
      set({ isLoading: true, error: null });
      try {
        const response = await axiosInstance.post('/auth/signup', userData);
        set({ user: response.data, isLoading: false });
        return response.data;
      } catch (error) {
        const errorMessage = error.response?.data?.error || error.message || "Signup failed";
        set({ error: errorMessage, isLoading: false });
        console.error("Signup failed:", error);
        throw new Error(errorMessage);
      }
    },

    // Login
    login: async (userData) => {
      set({ isLoading: true, error: null });
      try {
        const response = await axiosInstance.post('/auth/login', userData);
        set({ user: response.data, isLoading: false });
        return response.data;
      } catch (error) {
        const errorMessage = error.response?.data?.error || error.message || "Login failed";
        set({ error: errorMessage, isLoading: false });
        console.error("Login failed:", error);
        throw new Error(errorMessage);
      }
    },

    // Logout
    logout: async () => {
      set({ isLoading: true, error: null });
      try {
        await axiosInstance.post('/auth/logout');
        set(initialState);
      } catch (error) {
        console.error("Logout failed:", error);
        // Even if logout fails, clear local state
        set(initialState);
      }
    },

    // Delete Account
    deleteAccount: async () => {
      set({ isLoading: true, error: null });
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }
        
        await axiosInstance.delete('/auth/delete', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        // Clear localStorage
        localStorage.removeItem('token');
        // Reset store state
        set(initialState);
      } catch (error) {
        const errorMessage = error.response?.data?.error || error.message || "Delete account failed";
        set({ error: errorMessage, isLoading: false });
        console.error("Delete account failed:", error);
        throw new Error(errorMessage);
      }
    },

    // Check Admin Status
    checkAdminStatus: async () => {
      set({ isLoading: true, error: null });
      try {
        const response = await axiosInstance.get('/auth/check-admin');
        set({ isAdmin: response.data.isAdmin, isLoading: false });
        return response.data.isAdmin;
      } catch (error) {
        const errorMessage = error.response?.data?.error || error.message || "Failed to check admin status";
        set({ error: errorMessage, isLoading: false });
        console.error("Failed to check admin status:", error);
        throw new Error(errorMessage);
      }
    },

    // Clear error
    clearError: () => set({ error: null }),

    // Reset loading
    resetLoading: () => set({ isLoading: false }),
  };
});

export default useAuthStore;
