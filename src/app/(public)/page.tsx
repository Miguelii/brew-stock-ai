import { Hero } from '@/modules/home/hero'
import { AnalysisCard } from '@/modules/home/analysis-card'
import { HowItWorks } from '@/modules/home/how-it-works'
import { WordRevealCard } from '@/modules/home/word-reveal-card'
import { PricingCard } from '@/modules/home/pricing-card'
import { FinalCTA } from '@/modules/home/final-cta'
import { HOME_REVEAL_WORDS } from '@/lib/revel-words'
import { BreadcrumbSchema } from '@/components/structured-data'
import { ClientEnv } from '@/env/client'

export const dynamic = 'force-static'

const SITE_URL = ClientEnv.NEXT_PUBLIC_WEBSITE_URL

export default function HomePage() {
    return (
        <>
            <BreadcrumbSchema items={[{ name: 'Home', url: `${SITE_URL}/` }]} />

            <main className="flex-1 overflow-x-hidden">
                <Hero />

                {/* Analysis Types — Bento Grid */}
                <AnalysisCard />

                {/* Features */}
                {/* <MarketingCard /> */}

                {/* What the product does + how it works (static prose) */}
                <HowItWorks />

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
