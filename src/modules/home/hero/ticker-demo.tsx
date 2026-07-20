'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { CheckIcon, SearchIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EASE } from '@/modules/home/shared/motion'

type Phase = 'typing' | 'generating' | 'ready'

const TICKERS = ['NVDA', 'AAPL', 'ASML', 'GOOGL'] as const
const TYPE_INTERVAL_MS = 160
const GENERATING_MS = 1800
const READY_MS = 1600

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

    const effectivePhase: Phase = phase

    return (
        <Link
            href="/analysis"
            prefetch={false}
            aria-label="Start a stock analysis"
            className="group block w-full max-w-md"
        >
            <div className="rounded-none bg-card/40 p-1.5 ring-1 ring-foreground/10 transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 group-hover:shadow-lg group-hover:shadow-accent-blue/5">
                <div className="rounded-none bg-card ring-1 ring-foreground/10">
                    <div className="flex items-center gap-3 px-4 py-3">
                        <SearchIcon className="size-4 shrink-0 text-primary-muted" />
                        <span className="flex-1 text-left font-mono text-sm font-semibold tracking-widest text-foreground">
                            {displayed}
                            {effectivePhase === 'typing' && (
                                <span
                                    aria-hidden
                                    className="ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 animate-pulse bg-accent-blue"
                                />
                            )}
                        </span>
                        <span
                            className={cn(
                                'flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest',
                                effectivePhase === 'ready'
                                    ? 'text-accent-green'
                                    : 'text-primary-muted'
                            )}
                        >
                            {effectivePhase === 'typing' && 'Try it free'}
                            {effectivePhase === 'generating' && 'Analyzing'}
                            {effectivePhase === 'ready' && (
                                <>
                                    <CheckIcon className="size-3" />
                                    Report ready
                                </>
                            )}
                        </span>
                    </div>
                    <div className="h-0.5 w-full overflow-hidden bg-border">
                        {effectivePhase === 'generating' && (
                            <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: GENERATING_MS / 1000, ease: EASE }}
                                className="h-full w-full origin-left bg-accent-blue"
                            />
                        )}
                        {effectivePhase === 'ready' && (
                            <div className="h-full w-full bg-accent-green" />
                        )}
                    </div>
                </div>
            </div>
        </Link>
    )
}
