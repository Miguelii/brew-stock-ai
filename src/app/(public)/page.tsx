import { Hero } from '@/modules/home/hero'
import { HowItWorks } from '@/modules/home/how-it-works'
import { AnalysisCard } from '@/modules/home/analysis-card'
import { ReportSections } from '@/modules/home/report-sections'
import { WordRevealCard } from '@/modules/home/word-reveal-card'
import { FeaturedArticles } from '@/modules/home/featured-articles'
import { PricingCard } from '@/modules/home/pricing-card'
import { HomeFaq } from '@/modules/faq/home-faq'
import { FinalCTA } from '@/modules/home/final-cta'
import { BreadcrumbSchema } from '@/components/structured-data'
import { ClientEnv } from '@/env/client'
import { PACKAGES } from '@/_bff/modules/credits/constants'

export const dynamic = 'force-static'

const SITE_URL = ClientEnv.NEXT_PUBLIC_WEBSITE_URL

export default function HomePage() {
    return (
        <>
            <BreadcrumbSchema items={[{ name: 'Home', url: `${SITE_URL}/` }]} />

            {/* The hero is full-bleed under the fixed header, so it cancels its spacer. */}
            <main id="main" className="-mt-20 flex-1 overflow-x-clip">
                <Hero />

                <HowItWorks />

                <AnalysisCard />

                <ReportSections />

                <WordRevealCard lede="You type a ticker. Our engine gathers all the data and writes a clear, professional report. In under 120 seconds." />

                <PricingCard packages={PACKAGES} />

                <FeaturedArticles />

                <FinalCTA secondCTA="report" />

                <HomeFaq />
            </main>
        </>
    )
}
