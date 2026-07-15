'use client'

import { SW_PATH } from '@/lib/constants'
import { useEffect } from 'react'

/**
 * Registers the service worker for PWA support.
 * Must be rendered as a client component in the root layout.
 */
export function ServiceWorkerRegister() {
    useEffect(function registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register(SW_PATH, {
                scope: '/',
                updateViaCache: 'none',
            })
        }
    }, [])

    return null
}
