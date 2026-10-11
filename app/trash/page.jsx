'use client'
import { RequireAuth } from '../../src/components/auth/RequireAuth'
import AppLayout from '../../src/layouts/AppLayout'
import Trash from '../../src/pages/Trash'
export default function TrashPage() { return <RequireAuth><AppLayout><Trash /></AppLayout></RequireAuth> }
