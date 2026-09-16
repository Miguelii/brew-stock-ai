import type { Metadata } from 'next'
import { AnalysisHero } from '@/modules/analysis/analysis-hero'
import { AnalysisFormCard } from '@/modules/analysis/analysis-form-card'
import { AnalysisTypesGrid } from '@/modules/analysis/analysis-types-grid'
import { HowItWorksStrip } from '@/modules/analysis/how-it-works-strip'
import { BreadcrumbSchema } from '@/components/structured-data'
import { ClientEnv } from '@/env/client'
import { getAnalysisPageData } from '@/lib/get-analysis-page-data.helper'

const SITE_URL = ClientEnv.NEXT_PUBLIC_WEBSITE_URL
const META_TITLE = 'Stock Analysis'
const META_DESCRIPTION =
    'Get a free AI-powered stock analysis in under 2 minutes. Enter any stock ticker for financial health, risk assessment, and growth potential. No credit card needed.'
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
    const { isAuthenticated, isMaintenance } = await getAnalysisPageData()
    return (
        <>
            <BreadcrumbSchema
                items={[
                    { name: 'Home', url: `${SITE_URL}/` },
                    { name: 'Analysis', url: META_URL },
                ]}
            />
            {/* The hero is full-bleed under the fixed header, so it cancels its spacer. */}
            <main id="main" className="-mt-20 flex-1 overflow-x-clip">
                <AnalysisHero>
                    <AnalysisFormCard
                        isAuthenticated={isAuthenticated}
                        isMaintenance={isMaintenance}
                    />
                </AnalysisHero>

                <AnalysisTypesGrid />

                <HowItWorksStrip />
            </main>
        </>
    )
}
