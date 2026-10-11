'use client'
import { useEffect, useLayoutEffect } from 'react'
import { Asterisk } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useUiStore } from '../store/uiStore'
import Toaster from './ui/Toaster'
import Spinner from './ui/Spinner'

function SplashScreen() {
  return <div className="flex h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950"><div className="flex flex-col items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-white"><Asterisk className="h-5 w-5" /></div><Spinner className="h-5 w-5" /></div></div>
}
export default function AppProviders({ children }) {
  const initialize = useAuthStore((s) => s.initialize)
  const isInitialized = useAuthStore((s) => s.isInitialized)
  useEffect(() => { initialize() }, [initialize])
  useLayoutEffect(() => {
    if (localStorage.getItem('aster-ui') === null) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      useUiStore.getState().setTheme(prefersDark ? 'dark' : 'light')
    } else document.documentElement.classList.toggle('dark', useUiStore.getState().theme === 'dark')
  }, [])
  return <>{isInitialized ? children : <SplashScreen />}<Toaster /></>
}
