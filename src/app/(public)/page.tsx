import { Hero } from '@/modules/home/hero'
import { AnalysisCard } from '@/modules/home/analysis-card'
import { HowItWorks } from '@/modules/home/how-it-works'
import { FeaturedArticles } from '@/modules/home/featured-articles'
import { WordRevealCard } from '@/modules/home/word-reveal-card'
import { PricingCard } from '@/modules/home/pricing-card'
import { FinalCTA } from '@/modules/home/final-cta'
import { BreadcrumbSchema } from '@/components/structured-data'
import { ClientEnv } from '@/env/client'

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

            <main className="flex-1 overflow-x-hidden">
                <Hero />

                {/* Analysis Types — Bento Grid */}
                <AnalysisCard />

                {/* Features */}

                {/* What the product does + how it works (static prose) */}
                <HowItWorks />

                {/* Featured education-hub articles — surfaces long-form content + internal links */}
                <FeaturedArticles />

                {/* Scrubbing text reveal */}
                <WordRevealCard words={HOME_REVEAL_WORDS} />

                {/* Pricing */}
                <PricingCard />

                {/* Final CTA */}
                <FinalCTA />
            </main>
        </>
    )
}
