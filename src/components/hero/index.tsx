import { BackgroundLines } from './background-lines'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import * as motion from 'motion/react-client'

export function Hero() {
    return (
        <BackgroundLines className="flex items-center justify-center w-full flex-col px-4">
            <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center text-center max-w-6xl mx-auto relative z-20"
            >
                <h1 className="bg-clip-text text-transparent bg-linear-to-b from-neutral-900 to-neutral-600 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] py-3">
                    AI-Powered Stock Analysis
                    <br />
                    For Smarter Investing
                </h1>
                <p className="mt-6 max-w-2xl text-base md:text-lg text-muted-foreground">
                    Institutional-grade analysis covering financial metrics, market sentiment, and
                    technical indicators — For less than a coffee ☕
                </p>
                <Link href="/analysis" prefetch={false} className="mt-8">
                    <Button size="lg" className="gap-2 text-base px-8 h-12">
                        Start Free Analysis
                        <ArrowRight className="size-5" />
                    </Button>
                </Link>
            </motion.div>
        </BackgroundLines>
    )
}
