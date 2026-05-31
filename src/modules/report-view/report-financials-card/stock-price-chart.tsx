'use client'

import { useMemo, useState } from 'react'
import {
    Area,
    AreaChart,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'
import { cn } from '@/lib/utils'
import { fmtPrice } from '@/lib/formatters'
import { trpc } from '@/server/trpc-client'

const RANGES = ['1M', '3M', '6M', '1Y'] as const
type Range = (typeof RANGES)[number]

const RANGE_DAYS: Record<Range, number> = { '1M': 30, '3M': 90, '6M': 180, '1Y': 365 }

type Props = {
    ticker: string
    low?: number | null
    high?: number | null
}

type TooltipProps = {
    active?: boolean
    payload?: { value: number }[]
    label?: number
}

function PriceTooltip({ active, payload, label }: TooltipProps) {
    if (!active || !payload?.length || label == null) return null
    return (
        <div className="rounded border bg-card px-3 py-2 shadow text-xs">
            <p className="text-muted-foreground">
                {new Date(label).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                })}
            </p>
            <p className="font-semibold text-primary">{fmtPrice(payload[0].value)}</p>
        </div>
    )
}

export function StockPriceChart({ ticker, low, high }: Props) {
    const [range, setRange] = useState<Range>('1Y')
    const { data, isLoading } = trpc.priceHistory.useQuery({ ticker })

    const filtered = useMemo(() => {
        if (!data) return []
        const cutoff = Date.now() - RANGE_DAYS[range] * 86_400_000
        return data.filter((p) => p.date >= cutoff)
    }, [data, range])

    const formatXAxis = (ms: number) => new Date(ms).toLocaleDateString('en-GB', { month: 'short' })

    if (isLoading) {
        return <div className="h-52 animate-pulse rounded-sm bg-muted" />
    }

    if (!data?.length) {
        return (
            <div className="flex h-52 items-center justify-center rounded-sm bg-muted/40">
                <span className="text-xs text-muted-foreground">No price data available</span>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Where the stock has traded in the last year
                </span>
                <div className="flex gap-0.5">
                    {RANGES.map((r) => (
                        <button
                            key={r}
                            type="button"
                            onClick={() => setRange(r)}
                            className={cn(
                                'px-2 py-0.5 text-xs rounded transition-colors',
                                r === range
                                    ? 'bg-accent-blue text-primary-foreground font-medium'
                                    : 'text-muted-foreground hover:text-primary'
                            )}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            </div>

            <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={filtered} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--accent-blue)" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="var(--accent-blue)" stopOpacity={0} />
                        </linearGradient>
                    </defs>

                    <XAxis
                        dataKey="date"
                        tickFormatter={formatXAxis}
                        tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                        axisLine={false}
                        tickLine={false}
                        minTickGap={40}
                    />
                    <YAxis
                        tickFormatter={(v: number) => fmtPrice(v)}
                        tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                        axisLine={false}
                        tickLine={false}
                        width={60}
                        domain={['auto', 'auto']}
                    />

                    <Tooltip
                        content={<PriceTooltip />}
                        cursor={{ stroke: 'var(--border)', strokeWidth: 1 }}
                    />

                    {high != null && (
                        <ReferenceLine
                            y={high}
                            stroke="var(--accent-blue)"
                            strokeDasharray="3 3"
                            strokeOpacity={0.5}
                        />
                    )}
                    {low != null && (
                        <ReferenceLine
                            y={low}
                            stroke="var(--muted-foreground)"
                            strokeDasharray="3 3"
                            strokeOpacity={0.5}
                        />
                    )}

                    <Area
                        type="monotone"
                        dataKey="close"
                        stroke="var(--accent-blue)"
                        strokeWidth={1.5}
                        fill="url(#priceGrad)"
                        dot={false}
                        activeDot={{ r: 3, fill: 'var(--accent-blue)', strokeWidth: 0 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
