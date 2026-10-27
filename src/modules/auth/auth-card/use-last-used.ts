import { useSyncExternalStore } from 'react'

const LAST_USED_KEY = 'auth_last_used'
const LAST_USED_EVENT = 'auth-last-used-change'

type LastUsed = 'google' | 'email'

function subscribe(callback: () => void) {
    window.addEventListener('storage', callback)
    window.addEventListener(LAST_USED_EVENT, callback)
    return () => {
        window.removeEventListener('storage', callback)
        window.removeEventListener(LAST_USED_EVENT, callback)
    }
}

// localStorage is user-editable: anything but a known method reads as no preference
const readLastUsed = (): LastUsed | null => {
    const stored = localStorage.getItem(LAST_USED_KEY)
    return stored === 'google' || stored === 'email' ? stored : null
}

const saveLastUsed = (method: LastUsed) => {
    localStorage.setItem(LAST_USED_KEY, method)
    window.dispatchEvent(new Event(LAST_USED_EVENT))
}

export const useLastUsed = () => {
    const lastUsed = useSyncExternalStore(subscribe, readLastUsed, () => null)

    return { lastUsed, saveLastUsed }
}
