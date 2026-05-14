import { create } from 'zustand'
import { loginRequest, registerRequest, forgotPasswordRequest, profileRequest, updateMyProfile as updateProfileRequest } from '../../../shared/api'

// Cargar user y token desde localStorage al iniciar
const initialUser = JSON.parse(localStorage.getItem('user')) || null
const initialToken = localStorage.getItem('token') || null

export const useAuthStore = create((set) => ({
    user: initialUser,
    token: initialToken,
    loading: false,
    error: null,

    login: async (data) => {
        try {
            set({ loading: true, error: null })

            const res = await loginRequest(data)

            // Guardar token y user en localStorage
            localStorage.setItem('token', res.data.token)
            localStorage.setItem('user', JSON.stringify(res.data.user))

            set({
                user: res.data.user,
                token: res.data.token,
                loading: false
            })

            return { success: true, user: res.data.user }

        } catch (err) {
            set({
                error: err.response?.data?.message || 'Error de autenticación',
                loading: false
            })
            return { success: false, error: err.response?.data?.message || 'Error de autenticación' }
        }
    },

    register: async (data) => {
        try {
            set({ loading: true, error: null })
            const res = await registerRequest(data)
            set({ loading: false })
            return { success: true, data: res.data }
        } catch (err) {
            set({
                error: err.response?.data?.message || 'Error en registro',
                loading: false
            })
            return { success: false, error: err.response?.data?.message || 'Error en registro' }
        }
    },

    forgotPassword: async (data) => {
        try {
            set({ loading: true, error: null })

            await forgotPasswordRequest(data)

            set({ loading: false })

            return { success: true }

        } catch (err) {
            set({
                error: err.response?.data?.message || 'Error al recuperar contraseña',
                loading: false
            })
            return { success: false }
        }
    },

    getProfile: async () => {
        try {
            const res = await profileRequest()
            set({ user: res.data.user })
            localStorage.setItem('user', JSON.stringify(res.data.user)) // <--- persistir
        } catch {
            localStorage.removeItem('token')
            localStorage.removeItem('user') // <--- limpiar si falla
            set({ user: null, token: null })
        }
    },

    updateProfile: async (data) => {
        try {
            set({ loading: true, error: null });
            const res = await updateProfileRequest(data);
            console.log('Respuesta del backend:', res.data); // ← agrega esto
            const updatedUser = res.data.user;
            localStorage.setItem('user', JSON.stringify(updatedUser));
            set({ user: updatedUser, loading: false });
            return { success: true };
        } catch (err) {
            set({
                error: err.response?.data?.message || 'Error al actualizar perfil',
                loading: false
            });
            return { success: false };
        }
    },

    logout: () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user') // <--- limpiar usuario
        set({ user: null, token: null })
    }
}))