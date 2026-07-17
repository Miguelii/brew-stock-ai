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

const HOME_REVEAL_WORDS =
    'You type a ticker. Our AI analyzes all the data and you get institutional-grade analysis. In under 120 seconds.'.split(
        ' '
    )

export default function HomePage() {
    return (
        <>
            <BreadcrumbSchema items={[{ name: 'Home', url: `${SITE_URL}/` }]} />

            <main id="main" className="flex-1 overflow-x-hidden">
                <Hero />

                <AnalysisCard />

                <HowItWorks />

                <ReportSections />

                <WordRevealCard words={HOME_REVEAL_WORDS} />

                <FeaturedArticles />

                <PricingCard packages={PACKAGES} />

                <HomeFaq />

                <FinalCTA />
            </main>
        </>
    )
}
