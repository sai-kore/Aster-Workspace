'use client'

import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from '@/src/lib/router-compat'
import { ChevronRight, MoreHorizontal, Plus } from 'lucide-react'
import PageMenu from './PageMenu'
import { usePagesStore } from '../../store/pagesStore'
import { useUiStore } from '../../store/uiStore'
import { toast } from '../../store/toastStore'
import { getErrorMessage } from '../../services/api'

export default function TreeItem({ page, depth }) {
  const pages = usePagesStore((s) => s.pages)
  const children = useMemo(() => pages.filter((p) => p.parentPage === page._id), [pages, page._id])
  const hasChildren = children.length > 0
  const { pageId } = useParams()
  const isActive = pageId === page._id
  const isExpanded = useUiStore((s) => s.expandedIds.includes(page._id))
  const toggleExpanded = useUiStore((s) => s.toggleExpanded)
  const expand = useUiStore((s) => s.expand)
  const createPage = usePagesStore((s) => s.createPage)
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleAddChild = async (event) => {
    event.preventDefault()
    event.stopPropagation()
    try {
      const child = await createPage(page._id)
      expand(page._id)
      navigate(`/page/${child._id}`, { state: { focusTitle: true } })
    } catch (error) {
      toast.error(getErrorMessage(error, 'Could not create the page'))
    }
  }

  return (
    <div>
      <div
        className={`group relative flex items-center gap-0.5 rounded-md pr-1 text-sm ${
          isActive
            ? 'bg-zinc-200/80 font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50'
            : 'text-zinc-600 hover:bg-zinc-200/60 dark:text-zinc-400 dark:hover:bg-zinc-800/70'
        }`}
        style={{ paddingLeft: depth * 14 + 4 }}
      >
        <button
          type="button"
          onClick={(event) => { event.preventDefault(); event.stopPropagation(); toggleExpanded(page._id) }}
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded text-zinc-400 hover:bg-zinc-300/70 hover:text-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-zinc-200 ${hasChildren ? '' : 'invisible'}`}
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
        >
          <ChevronRight className={`h-3.5 w-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
        </button>

        <Link to={`/page/${page._id}`} className="flex min-w-0 flex-1 items-center gap-1.5 py-1.5">
          <span className="shrink-0 text-sm leading-none">{page.icon || '📄'}</span>
          <span className="truncate">{page.title || 'Untitled'}</span>
        </Link>

        <div className={`flex shrink-0 items-center gap-0.5 ${isMenuOpen ? '' : 'opacity-0 group-hover:opacity-100'}`}>
          <button
            type="button"
            onClick={handleAddChild}
            title="Add a page inside"
            className="rounded p-1 text-zinc-400 hover:bg-zinc-300/70 hover:text-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={(event) => { event.preventDefault(); event.stopPropagation(); setIsMenuOpen((v) => !v) }}
              title="More options"
              className="rounded p-1 text-zinc-400 hover:bg-zinc-300/70 hover:text-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </button>
            {isMenuOpen && <PageMenu page={page} onClose={() => setIsMenuOpen(false)} />}
          </div>
        </div>
      </div>

      {isExpanded && hasChildren && (
        <div>
          {children.map((child) => (
            <TreeItem key={child._id} page={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}