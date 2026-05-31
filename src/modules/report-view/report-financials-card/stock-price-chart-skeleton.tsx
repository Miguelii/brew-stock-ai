import { RANGES } from './constants'

export function StockPriceChartSkeleton() {
    return (
        <div className="flex flex-col gap-2">
            {/* Header — mesma estrutura que o real */}
            <div className="flex items-center justify-between">
                <div className="h-3 w-44 rounded bg-muted animate-pulse" />
                <div className="flex gap-0.5">
                    {RANGES.map((r) => (
                        <div key={r} className="h-5 w-7 rounded bg-muted animate-pulse" />
                    ))}
                </div>
            </div>

            {/* Chart body — mesma altura que o ResponsiveContainer (180px) */}
            <div className="relative h-45 w-full">
                {/* Y-axis ticks */}
                <div className="absolute left-0 top-1 bottom-5 w-14 flex flex-col justify-between">
                    {[0, 1, 2, 3].map((i) => (
                        <div key={i} className="h-2.5 w-9 rounded bg-muted animate-pulse" />
                    ))}
                </div>

                {/* Plot area com SVG wave */}
                <div className="absolute left-14 right-0 top-0 bottom-5 overflow-hidden">
                    <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 500 140"
                        preserveAspectRatio="none"
                        className="animate-pulse"
                    >
                        <defs>
                            <linearGradient id="skelGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--accent-blue)"
                                    stopOpacity={0.12}
                                />
                                <stop offset="95%" stopColor="var(--accent-blue)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <path
                            d="M0,100 C60,85 110,60 170,70 C230,80 270,30 330,45 C390,60 430,35 500,50 L500,140 L0,140 Z"
                            fill="url(#skelGrad)"
                        />
                        <path
                            d="M0,100 C60,85 110,60 170,70 C230,80 270,30 330,45 C390,60 430,35 500,50"
                            fill="none"
                            stroke="var(--accent-blue)"
                            strokeWidth="1.5"
                            strokeOpacity={0.25}
                        />
                    </svg>
                </div>

                {/* X-axis ticks */}
                <div className="absolute left-14 right-0 bottom-0 flex justify-between">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-2.5 w-6 rounded bg-muted animate-pulse" />
                    ))}
                </div>
            </div>
        </div>
    )
}
