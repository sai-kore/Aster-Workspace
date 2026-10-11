'use client'

import { PanelLeft, Search, Sun, Moon } from 'lucide-react'
import UserMenu from './UserMenu'
import Breadcrumbs from './Breadcrumbs'
import Spinner from '../ui/Spinner'
import { useUiStore } from '../../store/uiStore'

function SaveStatus() {
  const status = useUiStore((s) => s.saveStatus)
  if (status === 'saving') {
    return (
      <span className="flex items-center gap-1.5 text-xs text-zinc-400">
        <Spinner className="h-3 w-3" /> Saving…
      </span>
    )
  }
  if (status === 'error') return <span className="text-xs font-medium text-red-500">Save failed</span>
  if (status === 'dirty') return <span className="text-xs text-zinc-400">Unsaved changes</span>
  return <span className="hidden text-xs text-zinc-400 sm:inline">Saved</span>
}

function ThemeToggle() {
  const theme = useUiStore((s) => s.theme)
  const toggleTheme = useUiStore((s) => s.toggleTheme)
  return (
    <button onClick={toggleTheme} className="btn-ghost px-2" aria-label="Toggle theme" title="Toggle theme">
      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  )
}

export default function Topbar() {
  const setSidebarOpen = useUiStore((s) => s.setSidebarOpen)
  const setSearchOpen = useUiStore((s) => s.setSearchOpen)

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b border-zinc-200 px-3 dark:border-zinc-800">
      <button className="btn-ghost px-2 md:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
        <PanelLeft className="h-4 w-4" />
      </button>
      <Breadcrumbs />
      <div className="ml-auto flex items-center gap-1">
        <SaveStatus />
        <button onClick={() => setSearchOpen(true)} className="btn-ghost gap-1.5 text-zinc-500">
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">Search</span>
          <kbd className="ml-1 hidden rounded border border-zinc-200 px-1 text-[10px] text-zinc-400 dark:border-zinc-700 md:inline">⌘K</kbd>
        </button>
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  )
}