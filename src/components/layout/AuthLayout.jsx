'use client'

import { Asterisk } from 'lucide-react'

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-white shadow-sm">
            <Asterisk className="h-5 w-5" />
          </div>
          <h1 className="mt-2 text-xl font-bold tracking-tight">{title}</h1>
          <p className="text-sm text-zinc-500">{subtitle}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          {children}
        </div>
        <p className="mt-6 text-center text-xs text-zinc-400">Aster — your personal workspace</p>
      </div>
    </div>
  )
}