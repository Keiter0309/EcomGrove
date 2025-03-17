import { create } from "zustand";
import { authService } from "../services/authService";
import toast from "react-hot-toast";
import { AuthResponse, IUserSignup, User } from "../interfaces";
import { AxiosError } from "axios";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signup: (formData: IUserSignup) => Promise<AuthResponse | void>;
  login: (email: string, password: string) => Promise<AuthResponse | void>;
  logout: () => Promise<void>;
  profile: () => Promise<unknown>;
  checkAuth: () => Promise<void>;
  ggLogin: (credentialResponse: unknown) => Promise<string | void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,

  signup: async (formData) => {
    set({ isLoading: true });
    try {
      const response = (await authService.signup(formData)) as AuthResponse;
      set({
        user: response.data.data,
        isLoading: false,
      });
      toast.success(response.data.message);
      return response;
    } catch (error: unknown) {
      set({ isLoading: false });
      if (error instanceof AxiosError && error.message) {
        toast.error(error.response?.data.message);
      }
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
    } catch (error: unknown) {
      set({ isLoading: false });
      if (error instanceof AxiosError && error.message) {
        toast.error(error.response?.data.message);
      }
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
    } catch (error: unknown) {
      set({ isLoading: false });
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response?.data || error.message);
      }
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

  ggLogin: async (crendentialResponse: unknown) => {
    set({ isLoading: true });
    try {
      const response = await authService.ggLogin(crendentialResponse);
      toast.success(response.data);
      set({ isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false, isAuthenticated: false });
    }
  },
}));
