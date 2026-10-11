'use client'

import { useMemo } from 'react'
import { useNavigate } from '@/src/lib/router-compat'
import { Clock, Plus } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { usePagesStore } from '../store/pagesStore'
import { toast } from '../store/toastStore'
import { getErrorMessage } from '../services/api'
import { formatDate } from '../utils/date'

export default function Home() {
  const pages = usePagesStore((s) => s.pages)
  const isPagesLoaded = usePagesStore((s) => s.isPagesLoaded)
  const createPage = usePagesStore((s) => s.createPage)
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()

  const recent = useMemo(
    () => [...pages].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 5),
    [pages]
  )

  const handleNewPage = async () => {
    try {
      const page = await createPage(null)
      navigate(`/page/${page._id}`, { state: { focusTitle: true } })
    } catch (error) {
      toast.error(getErrorMessage(error, 'Could not create the page'))
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Hi {user?.name?.split(' ')[0] || 'there'} 👋</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Welcome to your workspace. Create a page or pick up where you left off.
        </p>
        <button onClick={handleNewPage} className="btn-primary mt-6">
          <Plus className="h-4 w-4" /> New page
        </button>
      </div>

      {isPagesLoaded && recent.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-400">
            <Clock className="h-3.5 w-3.5" /> Recently edited
          </h2>
          <div className="divide-y divide-zinc-100 rounded-xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
            {recent.map((page) => (
              <button
                key={page._id}
                onClick={() => navigate(`/page/${page._id}`)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-zinc-50 dark:hover:bg-zinc-900"
              >
                <span className="text-lg leading-none">{page.icon || '📄'}</span>
                <span className="flex-1 truncate text-sm font-medium">{page.title || 'Untitled'}</span>
                <span className="text-xs text-zinc-400">{formatDate(page.updatedAt)}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}