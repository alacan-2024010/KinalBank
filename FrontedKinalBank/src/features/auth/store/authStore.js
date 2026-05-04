import { create } from 'zustand'
import { loginRequest, registerRequest, forgotPasswordRequest, profileRequest } from '../../../shared/api'

export const useAuthStore = create((set) => ({
    user: null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,

    login: async (data) => {
        try {
            set({ loading: true, error: null })

            const res = await loginRequest(data)

            localStorage.setItem('token', res.data.token)

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
            return { success: false }
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
            return { success: false }
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
        } catch {
            localStorage.removeItem('token')
            set({ user: null, token: null })
        }
    },

    logout: () => {
        localStorage.removeItem('token')
        set({ user: null, token: null })
    }
}))