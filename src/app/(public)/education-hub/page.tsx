import type { Metadata } from 'next'
import { ClientEnv } from '@/env/client'
import * as motion from 'motion/react-client'
import { EducationHubList } from '@/modules/education-hub/education-hub-list'
import { BreadcrumbSchema } from '@/components/structured-data'

export const dynamic = 'force-static'

const SITE_URL = ClientEnv.NEXT_PUBLIC_WEBSITE_URL
const META_TITLE = 'Education Hub'
const META_DESCRIPTION =
    'Free educational guides on stock analysis, valuation, competitive moats, risk assessment, and financial metrics — written for investors of all levels.'
const META_URL = `${SITE_URL}/education-hub`

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

export default function EducationHubPage() {
    return (
        <>
            <BreadcrumbSchema
                items={[
                    { name: 'Home', url: `${SITE_URL}/` },
                    { name: META_TITLE, url: META_URL },
                ]}
            />

            <main className="flex-1">
                <section className="border-b border-border bg-card/50">
                    <div className="max-w-7xl mx-auto px-6 py-12 lg:py-12">
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
                                reading financial reports to understanding competitive moats and
                                risk.
                            </p>
                        </motion.div>
                    </div>
                </section>

                <EducationHubList />
            </main>
        </>
    )
}
