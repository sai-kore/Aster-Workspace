'use client'

import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'
import { useToastStore } from '../../store/toastStore'

const styles = {
  success: { icon: CheckCircle2, classes: 'text-emerald-500' },
  error: { icon: AlertCircle, classes: 'text-red-500' },
  info: { icon: Info, classes: 'text-blue-500' },
}

export default function Toaster() {
  const toasts = useToastStore((s) => s.toasts)
  const dismissToast = useToastStore((s) => s.dismissToast)

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[200] flex w-80 flex-col gap-2">
      {toasts.map((t) => {
        const style = styles[t.type] || styles.info
        const Icon = style.icon
        return (
          <div
            key={t.id}
            className="pointer-events-auto flex items-start gap-2.5 rounded-lg border border-zinc-200 bg-white p-3 text-sm shadow-lg dark:border-zinc-700 dark:bg-zinc-800"
          >
            <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${style.classes}`} />
            <p className="flex-1 text-zinc-700 dark:text-zinc-200">{t.message}</p>
            <button onClick={() => dismissToast(t.id)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
              <X className="h-4 w-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}