import { create } from "zustand";
import { persist } from "zustand/middleware";
import { login as loginRequest, register, forgotPassword } from "../../../shared/api";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,
      isAuthenticated: false,

      login: async ({ email, password }) => {
        try {
          set({ loading: true, error: null });

          const { data } = await loginRequest({ email, password });

          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            loading: false,
          });

          localStorage.setItem("token", data.token);

          return { success: true };

        } catch (err) {
          console.error("Login error:", err);

          const message =
            err.response?.data?.message || "Error de autenticación";

          set({ error: message, loading: false });

          return { success: false, error: message };
        }
      },

      register: async (formData) => {
        try {
          set({ loading: true, error: null });

          await register(formData);

          set({ loading: false });

          return { success: true };

        } catch (err) {
          const message =
            err.response?.data?.message || "Error en registro";

          set({ error: message, loading: false });

          return { success: false, error: message };
        }
      },

      forgotPassword: async ({ username, dpi, newPassword }) => {
        try {
          set({ loading: true, error: null });

          await forgotPassword({
            username,
            dpi,
            newPassword
          });

          set({ loading: false });

          return { success: true };

        } catch (err) {
          const message =
            err.response?.data?.message || "Error al recuperar contraseña";

          set({ error: message, loading: false });

          return { success: false, error: message };
        }
      },

      logout: () => {
        localStorage.removeItem("token");

        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

    }),
    {
      name: "auth-storage"
    }
  )
);