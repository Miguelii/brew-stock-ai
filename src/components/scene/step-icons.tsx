type Props = {
    className?: string
    tint: string
}

/** Step 1: a ticker being picked. The magnifier bobs. */
export function IconTicker({ className, tint }: Props) {
    return (
        <svg viewBox="0 0 66 66" fill="none" aria-hidden="true" className={className}>
            <circle cx="33" cy="33" r="33" fill={tint} />
            <g className="motion-safe:animate-bob" style={{ transformOrigin: 'center' }}>
                <circle cx="30" cy="29" r="12" stroke="#fff" strokeWidth="4" />
                <path d="m39 38 8 8" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
                <path
                    d="m24 32 5-5 4 4 6-8"
                    stroke="#fff"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </g>
        </svg>
    )
}

/** Step 2: the engine working. The cog turns forever. */
export function IconEngine({ className, tint }: Props) {
    return (
        <svg viewBox="0 0 66 66" fill="none" aria-hidden="true" className={className}>
            <circle cx="33" cy="33" r="33" fill={tint} />
            <g className="motion-safe:animate-spin-slow" style={{ transformOrigin: '33px 33px' }}>
                <path
                    d="M33 16v6M33 44v6M16 33h6M44 33h6M21 21l4 4M41 41l4 4M45 21l-4 4M25 41l-4 4"
                    stroke="#fff"
                    strokeWidth="4"
                    strokeLinecap="round"
                />
                <circle cx="33" cy="33" r="8" stroke="#fff" strokeWidth="4" />
            </g>
        </svg>
    )
}

/** Step 3: the finished report. */
export function IconReport({ className, tint }: Props) {
    return (
        <svg viewBox="0 0 66 66" fill="none" aria-hidden="true" className={className}>
            <circle cx="33" cy="33" r="33" fill={tint} />
            <rect x="20" y="16" width="26" height="34" rx="5" stroke="#fff" strokeWidth="4" />
            <path
                d="M27 26h12M27 33h12M27 40h7"
                stroke="#fff"
                strokeWidth="3.5"
                strokeLinecap="round"
            />
        </svg>
    )
}
