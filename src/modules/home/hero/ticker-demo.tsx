'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { m } from 'motion/react'
import { CheckIcon, SearchIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TICKERS, TYPE_INTERVAL_MS, GENERATING_MS, READY_MS } from '@/modules/home/hero/constants'

type Phase = 'typing' | 'generating' | 'ready'

export function TickerDemo() {
    const [tickerIndex, setTickerIndex] = useState(0)
    const [typedCount, setTypedCount] = useState(0)
    const [phase, setPhase] = useState<Phase>('typing')

    const ticker = TICKERS[tickerIndex]

    useEffect(() => {
        if (phase === 'typing') {
            if (typedCount < ticker.length) {
                const t = setTimeout(() => setTypedCount((c) => c + 1), TYPE_INTERVAL_MS)
                return () => clearTimeout(t)
            }
            const t = setTimeout(() => setPhase('generating'), 400)
            return () => clearTimeout(t)
        }

        if (phase === 'generating') {
            const t = setTimeout(() => setPhase('ready'), GENERATING_MS)
            return () => clearTimeout(t)
        }

        const t = setTimeout(() => {
            setPhase('typing')
            setTypedCount(0)
            setTickerIndex((i) => (i + 1) % TICKERS.length)
        }, READY_MS)
        return () => clearTimeout(t)
    }, [phase, typedCount, ticker])

    const displayed = ticker.slice(0, typedCount)

    return (
        <Link
            href="/analysis"
            prefetch={false}
            aria-label="Start a stock analysis"
            className="group block w-full"
        >
            <div className="overflow-hidden rounded-[var(--radius-surface-inner)] bg-card transition-transform duration-500 ease-out-strong group-hover:-translate-y-0.5">
                <div className="flex items-center gap-3 px-4 py-3.5">
                    <SearchIcon className="size-4 shrink-0 text-ink/40" />
                    <span className="flex-1 text-left font-mono text-sm font-semibold tracking-widest text-ink">
                        {displayed}
                        {phase === 'typing' && (
                            <span
                                aria-hidden
                                className="ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 animate-caret-blink bg-blue"
                            />
                        )}
                    </span>
                    <span
                        className={cn(
                            'flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest',
                            phase === 'generating' && 'text-blue',
                            phase === 'ready' && 'text-green',
                            phase === 'typing' && 'text-ink/45'
                        )}
                    >
                        {phase === 'typing' && 'Try it free'}
                        {phase === 'generating' && 'Analyzing'}
                        {phase === 'ready' && (
                            <>
                                <CheckIcon className="size-3" />
                                Report ready
                            </>
                        )}
                    </span>
                </div>
                <div className="h-1 w-full overflow-hidden bg-ink/8">
                    {phase === 'generating' && (
                        <m.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: GENERATING_MS / 1000, ease: 'linear' }}
                            className="h-full w-full origin-left bg-blue"
                        />
                    )}
                    {phase === 'ready' && <div className="h-full w-full bg-green" />}
                </div>
            </div>
        </Link>
    )
}
