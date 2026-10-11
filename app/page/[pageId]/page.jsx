'use client'
import { RequireAuth } from '../../../src/components/auth/RequireAuth'
import AppLayout from '../../../src/layouts/AppLayout'
import PageView from '../../../src/pages/PageView'
export default function DocumentPage() { return <RequireAuth><AppLayout><PageView /></AppLayout></RequireAuth> }
