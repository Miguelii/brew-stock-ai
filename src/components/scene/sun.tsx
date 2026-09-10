import { cn } from '@/lib/utils'

type Props = {
    className?: string
}

/** Radiating disc. Reads as a rising sun over the chart horizon. */
export function Sun({ className }: Props) {
    return (
        <svg
            viewBox="0 0 120 120"
            fill="none"
            aria-hidden="true"
            className={cn('block h-auto w-full', className)}
        >
            <g stroke="var(--amber)" strokeWidth="7" strokeLinecap="round">
                <path d="M60 6v14M60 100v14M6 60h14M100 60h14M22 22l10 10M88 88l10 10M98 22 88 32M32 88l-10 10" />
            </g>
            <circle cx="60" cy="60" r="27" fill="var(--amber)" />
        </svg>
    )
}
