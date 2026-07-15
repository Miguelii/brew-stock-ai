'use client'

import { Suspense } from 'react'
import { useAuthError } from '@/modules/auth/auth-card/use-auth-error'

function AuthErrorInner() {
    useAuthError()
    return null
}

export function AuthErrorHandler() {
    return (
        <Suspense>
            <AuthErrorInner />
        </Suspense>
    )
}
