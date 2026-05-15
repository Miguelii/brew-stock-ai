import { Hero } from '@/modules/home/hero'
import { AnalysisCard } from '@/modules/home/analysis-card'
import { MarketingCard } from '@/modules/home/markting-card'
import { WordRevealCard } from '@/modules/home/word-reveal-card'
import { PricingCard } from '@/modules/home/pricring-card'
import { FinalCTA } from '@/modules/home/final-cta'

export const dynamic = 'force-static'

export default function HomePage() {
    return (
        <main className="flex-1 overflow-x-hidden">
            <Hero />

            {/* Analysis Types — Bento Grid */}
            <AnalysisCard />

            {/* Features */}
            <MarketingCard />

            {/* Scrubbing text reveal */}
            <WordRevealCard />

            {/* Pricing */}
            <PricingCard />

            {/* Final CTA */}
            <FinalCTA />
        </main>
    )
}
