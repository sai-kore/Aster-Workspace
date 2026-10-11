'use client'

export function SidebarSkeleton() {
  return (
    <div className="space-y-1.5 p-1">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-7 animate-pulse rounded-md bg-zinc-200/70 dark:bg-zinc-800" />
      ))}
    </div>
  )
}

export function PageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-3xl animate-pulse px-6 pb-24 pt-12 sm:px-10">
      <div className="mb-4 h-14 w-14 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
      <div className="mb-10 h-10 w-2/3 rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="space-y-3">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-4 rounded bg-zinc-200 dark:bg-zinc-800" style={{ width: `${88 - (i % 4) * 14}%` }} />
        ))}
      </div>
    </div>
  )
}