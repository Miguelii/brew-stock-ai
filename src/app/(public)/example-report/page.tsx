import type { Metadata } from 'next'
import Link from 'next/link'
import * as motion from 'motion/react-client'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

import { FinalCTA } from '@/modules/home/final-cta'
import { WordRevealCard } from '@/modules/home/word-reveal-card'
import { REPORT_REVEAL_WORDS } from '@/lib/revel-words'
import { ReportMarketingCard } from '@/modules/home/report-marketing-card'
import { ReportMacbookScroll } from '@/modules/home/report-macbook-scroll'
import { ClientEnv } from '@/env/client'
import { BreadcrumbSchema } from '@/components/structured-data'

export const dynamic = 'force-static'

const SITE_URL = ClientEnv.NEXT_PUBLIC_WEBSITE_URL
const META_TITLE = 'Example Report'
const META_DESCRIPTION =
    'See a real AI-generated stock analysis report. Institutional-grade coverage of financials, risk, growth, and competitive positioning.'
const META_URL = `${SITE_URL}/example-report`

export const metadata: Metadata = {
    title: META_TITLE,
    description: META_DESCRIPTION,
    alternates: {
        canonical: META_URL,
    },
    openGraph: {
        title: META_TITLE,
        description: META_DESCRIPTION,
        url: META_URL,
    },
    twitter: {
        title: META_TITLE,
        description: META_DESCRIPTION,
    },
}

const stats = [
    { value: '8', label: 'Report sections' },
    { value: '< 2min', label: 'Generation time' },
    { value: 'Free', label: 'First report' },
] as const

export default function ExampleReport() {
    return (
        <>
            <BreadcrumbSchema
                items={[
                    { name: 'Home', url: `${SITE_URL}/` },
                    { name: META_TITLE, url: META_URL },
                ]}
            />

            <main className="overflow-x-hidden w-full">
                {/* Hero — Editorial Split */}
                <section className="main-container-lg border-b border-border">
                    <div className="px-6 pb-24 lg:pb-32">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, y: 28 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] max-w-2xl">
                                    What does an AI analysis report look like?
                                </h1>
                                <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-xl">
                                    See exactly what StockBrewAI generates — institutional-depth
                                    analysis now available to anyone, for less than a coffee.
                                </p>
                                <div className="mt-8 flex flex-wrap gap-3">
                                    <Link href="/analysis" prefetch={false} className="contents">
                                        <Button
                                            size="lg"
                                            className="gap-2 px-4 h-10 w-full sm:w-fit"
                                        >
                                            Run your own analysis
                                            <ArrowRight className="size-4" />
                                        </Button>
                                    </Link>
                                    <Link href="/pricing" prefetch={false} className="contents">
                                        <Button
                                            size="lg"
                                            variant="outline"
                                            className="px-4 h-10 w-full sm:w-fit"
                                        >
                                            See pricing
                                        </Button>
                                    </Link>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 24 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                                className="flex flex-col gap-5"
                            >
                                {stats.map((stat, i) => (
                                    <motion.div
                                        key={stat.label}
                                        initial={{ opacity: 0, x: 16 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                            duration: 0.6,
                                            delay: 0.2 + i * 0.1,
                                            ease: [0.16, 1, 0.3, 1],
                                        }}
                                        className="flex items-baseline gap-4 border-b border-border pb-5 last:border-0 last:pb-0"
                                    >
                                        <span className="text-5xl font-bold tracking-tight tabular-nums">
                                            {stat.value}
                                        </span>
                                        <span className="text-muted-foreground text-base">
                                            {stat.label}
                                        </span>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* MacBook — dark centerpiece */}
                <ReportMacbookScroll />

                {/* What's inside — Bento Grid */}
                <ReportMarketingCard />

                {/* Scrubbing text reveal */}
                <WordRevealCard words={REPORT_REVEAL_WORDS} />

                {/* Final CTA */}
                <FinalCTA />
            </main>
        </>
    )
}
