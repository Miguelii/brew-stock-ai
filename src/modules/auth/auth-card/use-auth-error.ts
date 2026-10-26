'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { hasOwnKey } from '@/_bff/core/utils/lookup.utils'

const ERROR_MESSAGES = {
    oauth: 'Google sign-in failed. Please try again.',
} satisfies Record<string, string>

export function useAuthError() {
    const searchParams = useSearchParams()
    const router = useRouter()

    useEffect(() => {
        const error = searchParams.get('error')
        if (!error) return

        const message = hasOwnKey(ERROR_MESSAGES, error)
            ? ERROR_MESSAGES[error]
            : 'Authentication failed. Please try again.'
        toast.error(message)

        // Remove the error param from the URL without adding a history entry
        const params = new URLSearchParams(searchParams.toString())
        params.delete('error')
        const clean = params.size > 0 ? `?${params.toString()}` : window.location.pathname
        router.replace(clean)
    }, []) // eslint-disable-line react-hooks/exhaustive-deps
}
