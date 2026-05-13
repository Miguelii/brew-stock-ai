import type { Metadata } from 'next'
import { AnalysisHero } from '@/components/analysis-hero'
import { AnalysisFormCard } from '@/modules/analysis/analysis-form-card'
import { getCachedSession } from '@/services/auth/get-cached-session'
import { BreadcrumbSchema } from '@/components/structured-data'
import { ClientEnv } from '@/env/client'

export const metadata: Metadata = {
    title: 'AI Stock Analysis — Instant Reports for Any Ticker',
    description:
        'Get a free AI-powered stock analysis in under 1 minute. Enter any stock ticker — financial health, risk assessment, and growth potential included. No credit card needed.',
    alternates: {
        canonical: '/analysis',
    },
    openGraph: {
        title: 'AI Stock Analysis — Instant Reports for Any Ticker | StockBrewAI',
        description:
            'Get a free AI-powered stock analysis in under 1 minute. Enter any stock ticker — financial health, risk assessment, and growth potential included.',
    },
}

const siteUrl = ClientEnv.NEXT_PUBLIC_WEBSITE_URL

export default async function AnalysisPage() {
    const user = await getCachedSession()
    return (
        <>
            <BreadcrumbSchema
                items={[
                    { name: 'Home', url: `${siteUrl}/` },
                    { name: 'Analysis', url: `${siteUrl}/analysis` },
                ]}
            />
            <main id="#main" className="flex-1 max-w-7xl mx-auto w-full px-6 py-16 lg:py-24">
                <AnalysisHero>
                    <AnalysisFormCard isAuthenticated={!!user} />
                </AnalysisHero>
            </main>
        </>
    )
}
