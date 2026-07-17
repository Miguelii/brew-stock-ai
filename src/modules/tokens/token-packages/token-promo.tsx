export function TokenPromo() {
    return (
        <div className="bg-accent-blue w-full flex items-stretch mb-8">
            {/* Left — label + copy */}
            <div className="flex flex-col justify-center gap-1.5 px-6 py-5 flex-1">
                <div className="flex items-center gap-2">
                    <span className="relative flex h-1.5 w-1.5 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-background opacity-60" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-background" />
                    </span>
                    <span className="text-[9px] font-bold tracking-[0.25em] text-background/70 uppercase">
                        Limited Time Offer
                    </span>
                </div>
                <p className="text-base font-bold text-background leading-snug">
                    Starter pack 50% off.
                </p>
                <p className="text-xs text-background/60">Special offer, ending soon.</p>
            </div>

            {/* Divider */}
            <div className="w-px bg-background/20 self-stretch my-4" />

            {/* Right — big number */}
            <div className="flex items-center justify-center gap-1 px-8 py-5 shrink-0">
                <span className="text-5xl font-black tabular-nums leading-none text-background">
                    50%
                </span>
                <span className="text-sm font-semibold text-background/60 self-end mb-1 ml-1">
                    off
                </span>
            </div>
        </div>
    )
}
