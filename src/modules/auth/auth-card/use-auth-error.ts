'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

const ERROR_MESSAGES: Record<string, string> = {
    oauth: 'Google sign-in failed. Please try again.',
}

export function useAuthError() {
    const searchParams = useSearchParams()
    const router = useRouter()

    useEffect(() => {
        const error = searchParams.get('error')
        if (!error) return

        const message = ERROR_MESSAGES[error] ?? 'Authentication failed. Please try again.'
        toast.error(message)

        // Remove the error param from the URL without adding a history entry
        const params = new URLSearchParams(searchParams.toString())
        params.delete('error')
        const clean = params.size > 0 ? `?${params.toString()}` : window.location.pathname
        router.replace(clean)
    }, []) // eslint-disable-line react-hooks/exhaustive-deps
}
