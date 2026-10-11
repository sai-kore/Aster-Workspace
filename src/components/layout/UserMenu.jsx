'use client'

import { useRef, useState } from 'react'
import { useNavigate } from '@/src/lib/router-compat'
import { LogOut } from 'lucide-react'
import useClickOutside from '../../hooks/useClickOutside'
import { useAuthStore } from '../../store/authStore'

export default function UserMenu() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useClickOutside(ref, () => setOpen(false))

  const handleLogout = async () => {
    setOpen(false)
    await logout()
    navigate('/login')
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-semibold uppercase text-white hover:bg-accent-hover"
        title={user?.email}
      >
        {user?.name?.[0] || '?'}
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border border-zinc-200 bg-white p-1.5 shadow-xl dark:border-zinc-700 dark:bg-zinc-800">
          <div className="border-b border-zinc-100 px-2.5 pb-2 pt-1 dark:border-zinc-700">
            <p className="truncate text-sm font-medium text-zinc-800 dark:text-zinc-100">{user?.name}</p>
            <p className="truncate text-xs text-zinc-400">{user?.email}</p>
          </div>
          <button onClick={handleLogout} className="menu-item mt-1">
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </div>
      )}
    </div>
  )
}