import type { Metadata } from 'next'
import { ClientEnv } from '@/env/client'
import * as motion from 'motion/react-client'
import { EducationHubList } from '@/modules/education-hub/education-hub-list'

export const dynamic = 'force-static'

const siteUrl = ClientEnv.NEXT_PUBLIC_WEBSITE_URL

export const metadata: Metadata = {
    title: 'Stock Analysis Education Hub | StockBrewAI',
    description:
        'Free educational guides on stock analysis, valuation, competitive moats, risk assessment, and financial metrics — written for investors of all levels.',
    alternates: {
        canonical: `${siteUrl}/education-hub`,
    },
    openGraph: {
        title: 'Stock Analysis Education Hub | StockBrewAI',
        description:
            'Free educational guides on stock analysis, valuation, competitive moats, risk assessment, and financial metrics.',
        url: `${siteUrl}/education-hub`,
    },
}

export default function EducationHubPage() {
    return (
        <main className="flex-1">
            <section className="border-b border-border bg-card/50">
                <div className="max-w-4xl mx-auto px-6 py-12 lg:py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <p className="text-xs font-semibold tracking-widest uppercase text-accent-blue mb-4">
                            Education Hub
                        </p>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">
                            Stock Analysis Guides
                        </h1>
                        <p className="text-primary-muted text-lg leading-relaxed max-w-2xl">
                            Clear, practical guides on the concepts behind stock analysis — from
                            reading financial reports to understanding competitive moats and risk.
                        </p>
                    </motion.div>
                </div>
            </section>

            <EducationHubList />
        </main>
    )
}
