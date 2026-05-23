import { useEffect, type RefObject } from 'react'

export function useCloseDropdownClick(
    ref: RefObject<HTMLElement | null>,
    isOpen: boolean,
    onClose: () => void
) {
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (!ref.current?.contains(e.target as Node)) onClose()
        }
        if (isOpen) document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [isOpen, onClose, ref])
}
