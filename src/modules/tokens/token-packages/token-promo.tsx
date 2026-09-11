export function TokenPromo() {
    return (
        <div
            data-tone="blue"
            className="surface bg-tone text-tone-ink w-full flex items-stretch mb-8 overflow-hidden"
        >
            {/* Left — label + copy */}
            <div className="flex flex-col justify-center gap-1.5 px-6 py-5 flex-1">
                <div className="flex items-center gap-2">
                    <span className="relative flex h-1.5 w-1.5 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tone-ink opacity-60" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-tone-ink" />
                    </span>
                    <span className="text-xs font-bold tracking-[0.25em] text-tone-ink/70 uppercase">
                        Limited Time Offer
                    </span>
                </div>
                <p className="text-base font-bold leading-snug">Starter pack 50% off.</p>
                <p className="text-xs text-tone-ink/65">Special offer, ending soon.</p>
            </div>

            {/* Divider */}
            <div className="w-px bg-tone-ink/25 self-stretch my-4" />

            {/* Right — big number */}
            <div className="flex items-center justify-center gap-1 px-8 py-5 shrink-0">
                <span className="display text-[56px] tabular-nums">50%</span>
                <span className="text-sm font-semibold text-tone-ink/65 self-end mb-2 ml-1">
                    off
                </span>
            </div>
        </div>
    )
}
