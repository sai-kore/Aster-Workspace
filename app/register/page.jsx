'use client'
import { RedirectIfAuthed } from '../../src/components/auth/RequireAuth'
import Register from '../../src/pages/Register'
export default function RegisterPage() { return <RedirectIfAuthed><Register /></RedirectIfAuthed> }
