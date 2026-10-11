'use client'

import { useEffect } from 'react'
import { useLocation, useNavigate, useParams } from '@/src/lib/router-compat'
import Sidebar from '../components/sidebar/Sidebar'
import Topbar from '../components/layout/Topbar'
import SearchModal from '../components/search/SearchModal'
import { useAuthStore } from '../store/authStore'
import { usePagesStore } from '../store/pagesStore'
import { useUiStore } from '../store/uiStore'

export default function AppLayout({ children }) {
  const isPagesLoaded = usePagesStore((s) => s.isPagesLoaded)
  const loadPages = usePagesStore((s) => s.loadPages)
  const sidebarOpen = useUiStore((s) => s.sidebarOpen)
  const setSidebarOpen = useUiStore((s) => s.setSidebarOpen)
  const navigate = useNavigate()
  const location = useLocation()
  const { pageId } = useParams()

  useEffect(() => {
    if (!isPagesLoaded) loadPages()
  }, [isPagesLoaded, loadPages])

  // A 401 from any API call (expired session) logs the user out globally.
  useEffect(() => {
    const onUnauthorized = () => {
      useAuthStore.setState({ user: null })
      usePagesStore.getState().reset()
      navigate('/login', { replace: true })
    }
    window.addEventListener('auth:unauthorized', onUnauthorized)
    return () => window.removeEventListener('auth:unauthorized', onUnauthorized)
  }, [navigate])

  // Close the mobile drawer on navigation
  useEffect(() => { setSidebarOpen(false) }, [location.pathname, setSidebarOpen])

  // Auto-expand ancestors of the open page so it is visible in the sidebar tree
  useEffect(() => {
    if (!pageId) return
    const { pages, isPagesLoaded: loaded } = usePagesStore.getState()
    if (!loaded) return
    const byId = new Map(pages.map((p) => [p._id, p]))
    const missing = []
    let current = byId.get(pageId)
    let guard = 0
    while (current?.parentPage && guard++ < 25) {
      if (!useUiStore.getState().expandedIds.includes(current.parentPage)) missing.push(current.parentPage)
      current = byId.get(current.parentPage)
    }
    if (missing.length) {
      useUiStore.setState((s) => ({ expandedIds: [...s.expandedIds, ...missing] }))
    }
  }, [pageId, location.pathname, isPagesLoaded])

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-zinc-950">
      <aside className="hidden w-64 shrink-0 border-r border-zinc-200 dark:border-zinc-800 md:flex md:flex-col">
        <Sidebar />
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col border-r border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
            <Sidebar />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      <SearchModal />
    </div>
  )
}