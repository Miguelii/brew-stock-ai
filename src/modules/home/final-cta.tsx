import { Button } from '@/components/ui/button'
import { ArrowRightIcon } from 'lucide-react'
import * as motion from 'motion/react-client'
import Link from 'next/link'

export function FinalCTA() {
    return (
        <section className="bg-primary">
            <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-8%' }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-8"
                >
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-primary-foreground">
                            Your first analysis is free
                        </h2>
                        <p className="text-primary-foreground/60 mt-3 text-lg">
                            Pick a ticker, choose a report type, get a detailed breakdown.
                            <br />
                            No credit card required.
                        </p>
                    </div>
                    <Link href="/analysis" prefetch={false} className="shrink-0">
                        <Button
                            size="lg"
                            className="gap-2 text-base px-8 h-12 bg-background text-primary hover:bg-background/90 hover:text-primary"
                        >
                            Start free analysis
                            <ArrowRightIcon className="size-4" />
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}
