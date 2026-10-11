'use client'

import { useRef } from 'react'
import { useLocation, useNavigate } from '@/src/lib/router-compat'
import { Copy, Pencil, Star, StarOff, Trash2 } from 'lucide-react'
import useClickOutside from '../../hooks/useClickOutside'
import { usePagesStore } from '../../store/pagesStore'
import { toast } from '../../store/toastStore'
import { getErrorMessage } from '../../services/api'

export default function PageMenu({ page, onClose, showRename = true }) {
  const ref = useRef(null)
  useClickOutside(ref, onClose)
  const navigate = useNavigate()
  const location = useLocation()
  const toggleFavorite = usePagesStore((s) => s.toggleFavorite)
  const duplicatePage = usePagesStore((s) => s.duplicatePage)
  const deletePage = usePagesStore((s) => s.deletePage)

  const handleFavorite = async () => {
    onClose()
    try {
      const isFavorite = await toggleFavorite(page._id)
      toast.success(isFavorite ? 'Added to favorites' : 'Removed from favorites')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Could not update favorites'))
    }
  }

  const handleRename = () => {
    onClose()
    navigate(`/page/${page._id}`, { state: { focusTitle: true } })
  }

  const handleDuplicate = async () => {
    onClose()
    try {
      const copy = await duplicatePage(page._id)
      toast.success('Page duplicated')
      navigate(`/page/${copy._id}`)
    } catch (error) {
      toast.error(getErrorMessage(error, 'Could not duplicate the page'))
    }
  }

  const handleDelete = async () => {
    onClose()
    try {
      await deletePage(page._id)
      toast.success('Page moved to trash')
      if (location.pathname === `/page/${page._id}`) navigate('/')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Could not delete the page'))
    }
  }

  return (
    <div ref={ref} className="absolute right-0 top-full z-50 mt-1.5 w-52 rounded-lg border border-zinc-200 bg-white p-1 shadow-xl dark:border-zinc-700 dark:bg-zinc-800">
      <button onClick={handleFavorite} className="menu-item">
        {page.isFavorite ? <StarOff className="h-4 w-4" /> : <Star className="h-4 w-4" />}
        {page.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      </button>
      {showRename && (
        <button onClick={handleRename} className="menu-item">
          <Pencil className="h-4 w-4" /> Rename
        </button>
      )}
      <button onClick={handleDuplicate} className="menu-item">
        <Copy className="h-4 w-4" /> Duplicate
      </button>
      <div className="my-1 h-px bg-zinc-100 dark:bg-zinc-700" />
      <button
        onClick={handleDelete}
        className="menu-item text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
      >
        <Trash2 className="h-4 w-4" /> Move to trash
      </button>
    </div>
  )
}