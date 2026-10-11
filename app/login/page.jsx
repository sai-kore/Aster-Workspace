'use client'
import { RedirectIfAuthed } from '../../src/components/auth/RequireAuth'
import Login from '../../src/pages/Login'
export default function LoginPage() { return <RedirectIfAuthed><Login /></RedirectIfAuthed> }
