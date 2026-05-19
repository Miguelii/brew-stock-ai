import { useState, useEffect } from 'react'

const LAST_USED_KEY = 'auth_last_used'

type LastUsed = 'google' | 'email'

export const useLastUsed = () => {
    const [lastUsed, setLastUsed] = useState<LastUsed | null>(null)

    useEffect(() => {
        const stored = localStorage.getItem(LAST_USED_KEY) as LastUsed | null
        setLastUsed(stored)
    }, [])

    const saveLastUsed = (method: LastUsed) => {
        localStorage.setItem(LAST_USED_KEY, method)
        setLastUsed(method)
    }

    return { lastUsed, saveLastUsed }
}
