'use client'
import { RequireAuth } from '../src/components/auth/RequireAuth'
import AppLayout from '../src/layouts/AppLayout'
import Home from '../src/pages/Home'
export default function WorkspacePage() { return <RequireAuth><AppLayout><Home /></AppLayout></RequireAuth> }
