import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const applyTheme = (theme) => {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }
}

export const useUiStore = create(
  persist(
    (set, get) => ({
      theme: 'light',
      sidebarOpen: false,
      expandedIds: [],
      searchOpen: false,
      saveStatus: 'saved',

      setTheme: (theme) => { applyTheme(theme); set({ theme }) },
      toggleTheme: () => get().setTheme(get().theme === 'dark' ? 'light' : 'dark'),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      toggleExpanded: (id) =>
        set((s) => ({
          expandedIds: s.expandedIds.includes(id)
            ? s.expandedIds.filter((x) => x !== id)
            : [...s.expandedIds, id],
        })),
      expand: (id) =>
        set((s) => (s.expandedIds.includes(id) ? {} : { expandedIds: [...s.expandedIds, id] })),
      isExpanded: (id) => get().expandedIds.includes(id),

      setSearchOpen: (open) => set({ searchOpen: open }),
      setSaveStatus: (status) => set({ saveStatus: status }),
    }),
    {
      name: 'aster-ui',
      partialize: (state) => ({ theme: state.theme, expandedIds: state.expandedIds }),
    }
  )
)