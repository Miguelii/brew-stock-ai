'use client'

import { m } from 'motion/react'

type Props = {
    label: string
    durationMs: number
}

export function RedirectProgress({ label, durationMs }: Props) {
    return (
        <span data-testid="redirect-progress" className="mt-1 flex w-full flex-col gap-1.5">
            <span data-testid="redirect-progress-label" className="text-xs">
                {label}
            </span>
            <span className="h-1 w-full overflow-hidden rounded-full bg-accent-blue/15">
                <m.span
                    className="block h-full origin-left rounded-full bg-accent-blue"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: durationMs / 1000, ease: 'linear' }}
                />
            </span>
        </span>
    )
}
