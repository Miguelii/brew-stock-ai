import type { Metadata } from 'next'
import { FinalCTA } from '@/modules/home/final-cta'
import { WordRevealCard } from '@/modules/home/word-reveal-card'
import { ReportMacbookScroll } from '@/modules/home/report-macbook-scroll'
import { ClientEnv } from '@/env/client'
import { BreadcrumbSchema } from '@/components/structured-data'
import { ReportSections } from '@/modules/home/report-sections'
import { ReportHero } from '@/modules/home/report-hero'

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

export const REPORT_REVEAL_WORDS =
    'Every risk surfaced. Every number explained. Every opportunity quantified. In under two minutes.'.split(
        ' '
    )

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
                <ReportHero />

                <ReportMacbookScroll />

                <ReportSections />

                <WordRevealCard words={REPORT_REVEAL_WORDS} />

                <FinalCTA />
            </main>
        </>
    )
}
