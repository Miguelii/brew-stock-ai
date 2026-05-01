'use client'

import { Suspense } from 'react'
import { useAuthError } from './use-auth-error'

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
