'use client'

import { useState } from 'react'
import { Link, useNavigate } from '@/src/lib/router-compat'
import AuthLayout from '../components/layout/AuthLayout'
import { useAuthStore } from '../store/authStore'
import { getErrorMessage } from '../services/api'
import { toast } from '../store/toastStore'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const register = useAuthStore((s) => s.register)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError('Please fill in all fields')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    setIsSubmitting(true)
    try {
      const data = await register(form)
      toast.success('Welcome to your workspace!')
      navigate(`/page/${data.pageId}`)
    } catch (err) {
      setError(getErrorMessage(err, 'Registration failed'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout title="Create your workspace" subtitle="A personal space for notes, plans and ideas">
      <form onSubmit={handleSubmit} className="space-y-3">
        {error && (
          <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">
            {error}
          </div>
        )}
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Name</label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            className="input"
            placeholder="Alex Doe"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="input"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            className="input"
            placeholder="At least 8 characters"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-zinc-500">
        Already have an account? <Link to="/login" className="font-medium text-accent hover:underline">Log in</Link>
      </p>
    </AuthLayout>
  )
}