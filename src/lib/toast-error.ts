import { createElement, Fragment } from 'react'
import { toast } from 'sonner'

export function toastError(message: string, error?: unknown, description?: string): void {
    const hash = error instanceof Error ? error.message : undefined

    if (!description && !hash) {
        toast.error(message)
        return
    }

    toast.error(message, {
        description: createElement(
            Fragment,
            null,
            description ? createElement('span', { className: 'block' }, description) : null,
            hash
                ? createElement(
                      'span',
                      { className: 'block font-mono text-[10px] mt-1.5' },
                      `Error code: ${hash}`
                  )
                : null
        ),
    })
}
