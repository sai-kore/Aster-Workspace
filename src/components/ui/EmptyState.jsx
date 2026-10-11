'use client'

export default function EmptyState({ icon: Icon, title, description, children }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
      {Icon && <Icon className="h-8 w-8 text-zinc-300 dark:text-zinc-600" />}
      <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-300">{title}</h3>
      {description && <p className="max-w-sm text-sm text-zinc-400">{description}</p>}
      {children}
    </div>
  )
}