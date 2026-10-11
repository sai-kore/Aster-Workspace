'use client'

import { useEffect, useState } from 'react'
import { RotateCcw, Trash2, Inbox } from 'lucide-react'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import EmptyState from '../components/ui/EmptyState'
import { usePagesStore } from '../store/pagesStore'
import { toast } from '../store/toastStore'
import { getErrorMessage } from '../services/api'
import { formatDate } from '../utils/date'

export default function Trash() {
  const trash = usePagesStore((s) => s.trash)
  const loadTrash = usePagesStore((s) => s.loadTrash)
  const restorePage = usePagesStore((s) => s.restorePage)
  const permanentDelete = usePagesStore((s) => s.permanentDelete)
  const emptyTrash = usePagesStore((s) => s.emptyTrash)

  const [isLoading, setIsLoading] = useState(true)
  const [busyId, setBusyId] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [confirmEmpty, setConfirmEmpty] = useState(false)

  useEffect(() => {
    let cancelled = false
    loadTrash()
      .catch(() => {})
      .finally(() => { if (!cancelled) setIsLoading(false) })
    return () => { cancelled = true }
  }, [loadTrash])

  const handleRestore = async (page) => {
    setBusyId(page._id)
    try {
      await restorePage(page._id)
      toast.success(`“${page.title || 'Untitled'}” restored`)
    } catch (error) {
      toast.error(getErrorMessage(error, 'Could not restore the page'))
    } finally {
      setBusyId(null)
    }
  }

  const handlePermanentDelete = async () => {
    const target = confirmDelete
    setConfirmDelete(null)
    setBusyId(target._id)
    try {
      await permanentDelete(target._id)
      toast.success('Page permanently deleted')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Could not delete the page'))
    } finally {
      setBusyId(null)
    }
  }

  const handleEmptyTrash = async () => {
    const count = trash.length
    setConfirmEmpty(false)
    try {
      await emptyTrash()
      toast.success(`Permanently deleted ${count} page${count === 1 ? '' : 's'}`)
    } catch (error) {
      toast.error(getErrorMessage(error, 'Could not empty the trash'))
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Trash</h1>
        {trash.length > 0 && (
          <button
            onClick={() => setConfirmEmpty(true)}
            className="btn-ghost text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
          >
            <Trash2 className="h-4 w-4" /> Empty trash
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800/60" />
          ))}
        </div>
      ) : trash.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="Trash is empty"
          description="Deleted pages will appear here and can be restored or permanently removed."
        />
      ) : (
        <div className="divide-y divide-zinc-100 rounded-xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
          {trash.map((page) => (
            <div key={page._id} className="flex items-center gap-3 px-4 py-3">
              <span className="text-lg leading-none">{page.icon || '📄'}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{page.title || 'Untitled'}</p>
                <p className="text-xs text-zinc-400">Deleted {formatDate(page.deletedAt)}</p>
              </div>
              <button
                onClick={() => handleRestore(page)}
                disabled={busyId === page._id}
                className="btn-ghost gap-1.5"
                title="Restore this page and its sub-pages"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Restore
              </button>
              <button
                onClick={() => setConfirmDelete(page)}
                disabled={busyId === page._id}
                className="btn-ghost gap-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!confirmDelete}
        title="Delete page permanently?"
        message="This page and everything inside it will be permanently deleted. This cannot be undone."
        confirmLabel="Delete permanently"
        onConfirm={handlePermanentDelete}
        onCancel={() => setConfirmDelete(null)}
      />
      <ConfirmDialog
        open={confirmEmpty}
        title="Empty trash?"
        message={`All ${trash.length} page${trash.length === 1 ? '' : 's'} in the trash will be permanently deleted. This cannot be undone.`}
        confirmLabel="Empty trash"
        onConfirm={handleEmptyTrash}
        onCancel={() => setConfirmEmpty(false)}
      />
    </div>
  )
}