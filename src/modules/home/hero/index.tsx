import { BackgroundLines } from '@/modules/home/hero/background-lines'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, FileText } from 'lucide-react'
import * as motion from 'motion/react-client'

const stats = [
    { label: '999+ Reports Generated' },
    { label: '5 Analysis Types' },
    { label: '< 120s Delivery' },
] as const

export function Hero() {
    return (
        <BackgroundLines className="flex items-center justify-center w-full flex-col px-4">
            <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center text-center max-w-7xl mx-auto relative z-20"
            >
                <h1 className="bg-clip-text text-transparent bg-linear-to-b from-foreground to-foreground/70 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] py-3">
                    AI-Powered Stock Analysis
                    <br />
                    For Smarter Investing
                </h1>
                <p className="mt-6 max-w-2xl text-base md:text-lg text-muted-foreground">
                    Institutional-grade analysis covering financial metrics, market sentiment, and
                    technical indicators — for less than a coffee.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-fit">
                    <Link href="/analysis" prefetch={false} className="contents">
                        <Button size="lg" className="gap-2 px-4 h-10 w-full sm:w-fit">
                            Start Free Analysis
                            <ArrowRight className="size-4" />
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
                    className="mt-10 flex flex-wrap justify-center gap-3"
                >
                    {stats.map((stat) => (
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
