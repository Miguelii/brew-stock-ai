import type { Metadata } from 'next'
import { AnalysisHero } from '@/components/analysis-hero'
import { AnalysisFormCard } from '@/modules/analysis/analysis-form-card'
import { getCachedSession } from '@/services/core/auth/get-cached-session'
import { BreadcrumbSchema } from '@/components/structured-data'
import { ClientEnv } from '@/env/client'

const SITE_URL = ClientEnv.NEXT_PUBLIC_WEBSITE_URL
const META_TITLE = 'AI Stock Analysis'
const META_DESCRIPTION =
    'Get a free AI-powered stock analysis in under 2 minutes. Enter any stock ticker — financial health, risk assessment, and growth potential included. No credit card needed.'
const META_URL = `${SITE_URL}/analysis`

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

export default async function AnalysisPage() {
    const user = await getCachedSession()
    return (
        <>
            <BreadcrumbSchema
                items={[
                    { name: 'Home', url: `${SITE_URL}/` },
                    { name: 'Analysis', url: META_URL },
                ]}
            />
            <main
                id="#main"
                className="flex-1 max-w-7xl mx-auto w-full px-6 pt-16 pb-20 lg:pt-24 lg:pb-36"
            >
                <AnalysisHero>
                    <AnalysisFormCard isAuthenticated={!!user} />
                </AnalysisHero>
            </main>
        </>
    )
}
