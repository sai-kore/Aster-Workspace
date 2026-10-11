import { create } from 'zustand'
import authService from '../services/authService'
import { usePagesStore } from './pagesStore'

export const useAuthStore = create((set) => ({
  user: null,
  isInitialized: false,

  initialize: async () => {
    try {
      const { data } = await authService.getMe()
      set({ user: data.data.user })
    } catch {
      set({ user: null })
    } finally {
      set({ isInitialized: true })
    }
  },

  setUser: (user) => set({ user }),

  login: async (credentials) => {
    const { data } = await authService.login(credentials)
    set({ user: data.data.user })
    return data.data
  },

  register: async (payload) => {
    const { data } = await authService.register(payload)
    set({ user: data.data.user })
    return data.data
  },

  logout: async () => {
    try { await authService.logout() } catch { /* ignore network errors on logout */ }
    usePagesStore.getState().reset()
    set({ user: null })
  },
}))