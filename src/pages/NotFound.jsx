'use client'

import { Link } from '@/src/lib/router-compat'
import { Compass } from 'lucide-react'
import EmptyState from '../components/ui/EmptyState'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-6 py-16">
      <EmptyState
        icon={Compass}
        title="Page not found"
        description="The page you are looking for doesn’t exist or has been moved."
      >
        <Link to="/" className="btn-primary mt-3">Back to workspace</Link>
      </EmptyState>
    </div>
  )
}