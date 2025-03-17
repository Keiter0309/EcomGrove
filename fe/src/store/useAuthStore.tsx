import { create } from "zustand";
import { authService } from "../services/authService";
import toast from "react-hot-toast";

interface AuthState {
  user: any;
  isLoading: boolean;
  isAuthenticated: boolean;
  signup: (formData: any) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  profile: () => Promise<any>;
  checkAuth: () => Promise<void>;
  ggLogin: (credentialResponse: any) => Promise<any>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,

  signup: async (formData) => {
    set({ isLoading: true });
    try {
      const response = await authService.signup(formData);
      set({
        user: response.data.data,
        isLoading: false,
      });
      toast.success(response.data.message);
      return response;
    } catch (error: any) {
      set({ isLoading: false });
      toast.error(error.response.data.message);
      console.error("Signup error", error.response?.data || error.message);
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await authService.login(email, password);
      toast.success(response.data.message);
      set({
        user: response.data.data,
        isAuthenticated: true,
        isLoading: false,
      });

      return response;
    } catch (error: any) {
      set({ isLoading: false });
      toast.error(error.response.data.message);
      console.error("Login error", error.response?.data || error.message);
    }
  },
  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      toast.success("Logout successfully");
      window.location.href = "/login";
    } catch (error: any) {
      set({ isLoading: false });
      console.error("Logout error", error.response?.data || error.message);
    }
  },

  profile: async () => {
    set({ isLoading: true });
    try {
      const response = await authService.profile();
      set({
        user: response.data.data,
        isLoading: false,
      });

      return response;
    } catch (error) {
      set({ isLoading: false });
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const response = await authService.checkAuth();
      set({
        user: response.data.data || null,
        isAuthenticated: response.data.isAuthenticated,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false, isAuthenticated: false, user: null });
    }
  },

  ggLogin: async (crendentialResponse: any) => {
    set({ isLoading: true });
    try {
      const response = await authService.ggLogin(crendentialResponse);
      toast.success(response.data);
      set({ user: true, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false, isAuthenticated: false });
    }
  },
}));
