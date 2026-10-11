'use client'

import { useEffect, useRef, useState } from 'react'
import { useNavigate } from '@/src/lib/router-compat'
import { Search } from 'lucide-react'
import { useUiStore } from '../../store/uiStore'
import pageService from '../../services/pageService'
import useDebounce from '../../hooks/useDebounce'
import Spinner from '../ui/Spinner'

export default function SearchModal() {
  const searchOpen = useUiStore((s) => s.searchOpen)
  const setSearchOpen = useUiStore((s) => s.setSearchOpen)
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 250)
  const [results, setResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [searched, setSearched] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const navigate = useNavigate()
  const inputRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen(!useUiStore.getState().searchOpen)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [setSearchOpen])

  useEffect(() => {
    if (searchOpen) {
      setQuery('')
      setResults([])
      setSearched(false)
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [searchOpen])

  useEffect(() => {
    const q = debouncedQuery.trim()
    if (!searchOpen || !q) {
      setResults([])
      setSearched(false)
      return
    }
    let cancelled = false
    setIsSearching(true)
    pageService
      .searchPages(q)
      .then(({ data }) => {
        if (cancelled) return
        setResults(data.data.pages)
        setSearched(true)
        setSelectedIndex(0)
      })
      .catch(() => { if (!cancelled) { setResults([]); setSearched(true) } })
      .finally(() => { if (!cancelled) setIsSearching(false) })
    return () => { cancelled = true }
  }, [debouncedQuery, searchOpen])

  const openPage = (page) => {
    setSearchOpen(false)
    navigate(`/page/${page._id}`)
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault()
      openPage(results[selectedIndex])
    } else if (e.key === 'Escape') {
      setSearchOpen(false)
    }
  }

  if (!searchOpen) return null

  return (
    <div className="fixed inset-0 z-[120] flex items-start justify-center p-4 pt-[10vh]">
      <div className="absolute inset-0 bg-black/30" onClick={() => setSearchOpen(false)} />
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-900"
        onKeyDown={onKeyDown}
      >
        <div className="flex items-center gap-2.5 border-b border-zinc-200 px-4 dark:border-zinc-800">
          <Search className="h-4 w-4 text-zinc-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages and content…"
            className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
          />
          {isSearching && <Spinner className="h-4 w-4" />}
          <kbd className="rounded border border-zinc-200 px-1.5 text-[10px] text-zinc-400 dark:border-zinc-700">ESC</kbd>
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {!query.trim() && (
            <p className="px-3 py-8 text-center text-sm text-zinc-400">
              Type to search across your page titles and content.
            </p>
          )}
          {query.trim() && searched && !isSearching && results.length === 0 && (
            <p className="px-3 py-8 text-center text-sm text-zinc-400">
              No results for “{query.trim()}”
            </p>
          )}
          {results.map((page, index) => (
            <button
              key={page._id}
              onClick={() => openPage(page)}
              onMouseEnter={() => setSelectedIndex(index)}
              className={`flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left ${
                index === selectedIndex ? 'bg-zinc-100 dark:bg-zinc-800' : ''
              }`}
            >
              <span className="mt-0.5 text-base leading-none">{page.icon || '📄'}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-zinc-800 dark:text-zinc-100">
                  {page.title || 'Untitled'}
                </span>
                {page.snippet && <span className="mt-0.5 block truncate text-xs text-zinc-400">{page.snippet}</span>}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}