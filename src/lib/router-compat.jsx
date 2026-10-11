'use client'
import React, { useCallback, useEffect, useState } from 'react'
import NextLink from 'next/link'
import { usePathname, useRouter as useNextRouter, useParams as useNextParams } from 'next/navigation'

export function Link({ to, href, replace: _replace, state: _state, ...props }) {
  return <NextLink href={href ?? to ?? '/'} {...props} />
}
export function useNavigate() {
  const router = useNextRouter()
  return useCallback((to, options = {}) => {
    if (typeof window !== 'undefined' && options.state !== undefined) {
      const targetPath = String(to).split('?')[0]
      try { sessionStorage.setItem(`aster-router-state:${targetPath}`, JSON.stringify(options.state)) } catch {}
    }
    if (options.replace) router.replace(to)
    else router.push(to)
  }, [router])
}
export function useLocation() {
  const pathname = usePathname() || '/'
  const [state, setState] = useState(null)
  const [search, setSearch] = useState('')
  useEffect(() => {
    setSearch(window.location.search)
    try {
      const saved = sessionStorage.getItem(`aster-router-state:${pathname}`)
      setState(saved ? JSON.parse(saved) : window.history.state?.usr ?? null)
      if (saved) sessionStorage.removeItem(`aster-router-state:${pathname}`)
    } catch { setState(window.history.state?.usr ?? null) }
  }, [pathname])
  return { pathname, search, state, key: pathname }
}
export function useParams() { return useNextParams() || {} }
export function Navigate({ to, replace = false, state }) {
  const navigate = useNavigate()
  useEffect(() => { navigate(to, { replace, state }) }, [navigate, to, replace, state])
  return null
}
