type Props = {
    low: number | null | undefined
    high: number | null | undefined
    current: number | null | undefined
    mean?: number | null
    lowLabel: string
    highLabel: string
}

export function RangeBar({ low, high, current, mean, lowLabel, highLabel }: Props) {
    const hasData = low != null && high != null && current != null && high > low
    const range = hasData ? high! - low! : 1
    const currentPct = hasData ? ((current! - low!) / range) * 100 : 0
    const meanPct = mean != null && hasData ? ((mean - low!) / range) * 100 : null

    return (
        <div className="flex flex-col gap-2">
            <div className="relative h-3 rounded-full overflow-hidden bg-primary/10">
                {hasData ? (
                    <>
                        <div
                            className="absolute inset-y-0 left-0 rounded-full bg-accent-blue"
                            style={{ width: `${Math.min(Math.max(currentPct, 0), 100)}%` }}
                        />
                        <div
                            className="absolute top-0 bottom-0 w-0.5 bg-accent-blue z-10"
                            style={{ left: `${Math.min(Math.max(currentPct, 0), 100)}%` }}
                        />
                        {meanPct !== null && (
                            <div
                                className="absolute top-0 bottom-0 w-0.5 bg-primary/50 z-10"
                                style={{ left: `${Math.min(Math.max(meanPct, 0), 100)}%` }}
                            />
                        )}
                    </>
                ) : (
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage:
                                'repeating-linear-gradient(45deg, #d1d5db 0px, #d1d5db 3px, transparent 3px, transparent 8px)',
                        }}
                    />
                )}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
                <span>{lowLabel}</span>
                <span>{highLabel}</span>
            </div>
        </div>
    )
}
