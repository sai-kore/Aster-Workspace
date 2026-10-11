'use client'

import { useEffect, useRef } from 'react'
import useClickOutside from '../../hooks/useClickOutside'
import { EMOJIS } from '../../utils/emojis'

export default function EmojiPicker({ onSelect, onClose }) {
  const ref = useRef(null)
  useClickOutside(ref, onClose)

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div ref={ref} className="absolute left-0 top-full z-50 mt-2 w-72 rounded-xl border border-zinc-200 bg-white p-3 shadow-xl dark:border-zinc-700 dark:bg-zinc-800">
      <p className="mb-2 text-xs font-medium text-zinc-400">Page icon</p>
      <div className="grid max-h-56 grid-cols-8 gap-1 overflow-y-auto">
        {EMOJIS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => onSelect(emoji)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-lg hover:bg-zinc-100 dark:hover:bg-zinc-700"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  )
}