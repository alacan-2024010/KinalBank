// front/src/features/admin-general/store/usersStore.js
import { create } from "zustand";
import { getPendingUsers, approveUser } from "../../../shared/api/users.js";

export const useUsersStore = create((set) => ({
  pendingUsers: [],
  loading: false,
  error: null,

  fetchPendingUsers: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await getPendingUsers();
      set({ pendingUsers: data.users });
    } catch (err) {
      set({ error: err.response?.data?.message ?? "Error al cargar usuarios" });
    } finally {
      set({ loading: false });
    }
  },

  approveUser: async (userId, role = "CLIENT") => {
    set({ loading: true, error: null });
    try {
      await approveUser(userId, role);
      // Quitar al usuario aprobado de la lista local
      set((state) => ({
        pendingUsers: state.pendingUsers.filter((u) => u.Id !== userId),
      }));
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message ?? "Error al aprobar usuario";
      set({ error: msg });
      return { success: false, message: msg };
    } finally {
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));