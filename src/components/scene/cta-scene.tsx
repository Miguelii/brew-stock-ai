import { cn } from '@/lib/utils'

type Props = {
    className?: string
}

/** Closing-section figure: a coin stack under a rising arrow, bleeding off the edge. */
export function CtaScene({ className }: Props) {
    return (
        <svg
            viewBox="0 0 360 320"
            fill="none"
            aria-hidden="true"
            className={cn('block h-auto w-full', className)}
        >
            <path
                d="M40 250 120 176l58 44 104-124"
                stroke="var(--tangerine-soft)"
                strokeWidth="18"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M244 96h44v44"
                stroke="var(--tangerine-soft)"
                strokeWidth="18"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            <g>
                <ellipse cx="132" cy="292" rx="72" ry="20" fill="var(--ink)" opacity="0.14" />
                <rect x="66" y="258" width="132" height="28" rx="14" fill="var(--amber)" />
                <rect x="80" y="228" width="104" height="28" rx="14" fill="var(--amber-soft)" />
                <rect x="94" y="198" width="76" height="28" rx="14" fill="var(--amber)" />
            </g>
        </svg>
    )
}
