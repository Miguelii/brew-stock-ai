import { SectionHeader } from '@/components/ui/section-header'
import { StackingCards } from '@/modules/home/stacking-cards'

export function AnalysisCard() {
    return (
        <section id="analysis-types" data-tone="paper" className="bg-tone text-tone-ink">
            <div className="section-shell pt-20 lg:pt-30">
                <SectionHeader
                    eyebrow="Analysis types"
                    title="Five stock analysis types, one platform"
                    lede="Choose the analysis that matches what you want to learn. Each report answers a different question, from financial health to long-term growth."
                />
            </div>

            <div className="section-shell pb-20 lg:pb-30">
                <StackingCards />
            </div>
        </section>
    )
}
