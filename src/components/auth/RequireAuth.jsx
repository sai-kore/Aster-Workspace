'use client'

import { Navigate, useLocation } from '@/src/lib/router-compat'
import { useAuthStore } from '../../store/authStore'

export function RequireAuth({ children }) {
  const user = useAuthStore((s) => s.user)
  const location = useLocation()
  if (!user) {
    return <Navigate to={`/login?from=${encodeURIComponent(location.pathname + location.search)}`} replace />
  }
  return children
}

export function RedirectIfAuthed({ children }) {
  const user = useAuthStore((s) => s.user)
  if (user) return <Navigate to="/" replace />
  return children
}