import { BackgroundLines } from '@/modules/home/hero/background-lines'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, FileText } from 'lucide-react'
import * as motion from 'motion/react-client'
import { TickerDemo } from '@/modules/home/hero/ticker-demo'
import { EASE } from '@/modules/home/shared/motion'

const STATS = [
    { label: '999+ Reports Generated' },
    { label: '5 Analysis Types' },
    { label: '< 120s Delivery' },
] as const

export function Hero() {
    return (
        <BackgroundLines className="flex items-center justify-center w-full flex-col px-4 h-full">
            <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: EASE }}
                className="flex flex-col items-center text-center max-w-7xl mx-auto relative z-20 mt-10"
            >
                {/* <ReleaseBanner /> */}
                <h1 className="bg-clip-text text-transparent bg-linear-to-b from-foreground to-foreground/70 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] py-3">
                    AI-Powered Stock Analysis
                    <br />
                    For Smarter Investing
                </h1>
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
                    className="mt-6 flex w-full justify-center"
                >
                    <TickerDemo />
                </motion.div>
                <p className="mt-6 max-w-2xl text-base md:text-lg text-muted-foreground">
                    Professional-level stock analysis covering the key numbers, market sentiment,
                    and price signals. All for less than a coffee ☕.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-fit">
                    <Link href="/analysis" prefetch={false} className="contents">
                        <Button size="lg" className="group gap-2 pl-4 pr-1.5 h-10 w-full sm:w-fit">
                            Start Free Analysis
                            <span className="flex size-7 items-center justify-center bg-primary-foreground/15 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5">
                                <ArrowRight className="size-4" />
                            </span>
                        </Button>
                    </Link>
                    <Link href="/example-report" prefetch={false} className="contents">
                        <Button
                            size="lg"
                            variant="outline"
                            className="gap-2 px-4 h-10 w-full sm:w-fit"
                        >
                            <FileText className="size-4" />
                            See a Sample Report
                        </Button>
                    </Link>
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-8 mb-12 flex flex-wrap justify-center gap-3"
                >
                    {STATS.map((stat) => (
                        <span
                            key={stat.label}
                            className="px-4 py-1.5 rounded-full border border-border bg-card/60 text-xs text-muted-foreground backdrop-blur-sm"
                        >
                            {stat.label}
                        </span>
                    ))}
                </motion.div>
            </motion.div>
        </BackgroundLines>
    )
}
