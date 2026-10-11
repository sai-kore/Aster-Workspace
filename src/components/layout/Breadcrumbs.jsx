'use client'

import { Fragment, useMemo } from 'react'
import { Link, useLocation, useParams } from '@/src/lib/router-compat'
import { Asterisk, ChevronRight } from 'lucide-react'
import { usePagesStore } from '../../store/pagesStore'

export default function Breadcrumbs() {
  const { pageId } = useParams()
  const location = useLocation()
  const pages = usePagesStore((s) => s.pages)

  const chain = useMemo(() => {
    if (!pageId) return []
    const byId = new Map(pages.map((p) => [p._id, p]))
    const result = []
    let current = byId.get(pageId)
    let guard = 0
    while (current && guard++ < 25) {
      result.unshift(current)
      current = current.parentPage ? byId.get(current.parentPage) : null
    }
    return result
  }, [pageId, pages])

  if (location.pathname.startsWith('/trash')) {
    return <span className="px-1 text-sm font-semibold">Trash</span>
  }
  if (chain.length === 0) {
    return <span className="px-1 text-sm font-semibold">Workspace</span>
  }

  const VISIBLE = 3
  const visible = chain.length > VISIBLE ? chain.slice(-VISIBLE) : chain
  const truncated = chain.length > visible.length
  const current = visible[visible.length - 1]

  return (
    <nav className="flex min-w-0 flex-1 items-center gap-0.5 text-sm" aria-label="Breadcrumb">
      <Link to="/" className="shrink-0 rounded p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800" title="Workspace">
        <Asterisk className="h-4 w-4" />
      </Link>
      {truncated && <span className="px-0.5 text-zinc-300 dark:text-zinc-600">…</span>}
      {visible.slice(0, -1).map((page) => (
        <Fragment key={page._id}>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-zinc-300 dark:text-zinc-600" />
          <Link
            to={`/page/${page._id}`}
            className="max-w-[9rem] shrink-0 truncate rounded px-1.5 py-0.5 text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            {page.icon} {page.title || 'Untitled'}
          </Link>
        </Fragment>
      ))}
      <ChevronRight className="h-3.5 w-3.5 shrink-0 text-zinc-300 dark:text-zinc-600" />
      <span className="max-w-[12rem] truncate px-1 font-medium">
        {current.icon} {current.title || 'Untitled'}
      </span>
    </nav>
  )
}