import { Reveal } from '@/components/ui/motion/reveal'
import { cn } from '@/lib/utils'
import { SectionHeader } from '@/components/ui/section-header'
import { ANALYSIS_TYPES } from '@/lib/analysis-content'

export function AnalysisTypesGrid() {
    return (
        <section id="analysis-types" data-tone="paper" className="bg-tone text-tone-ink">
            <div className="section-shell section-pad">
                <SectionHeader
                    eyebrow="Analysis types"
                    title="Pick what you want to know"
                    lede="Each report answers a different question about the stock, from financial health to long-term growth. The credit cost is shown next to every option in the form."
                />

                {/*
                 * A static grid rather than the homepage's scroll-driven deck: this page
                 * exists to get the form filled, and 460svh of scroll would bury it.
                 */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {ANALYSIS_TYPES.map((type, i) => {
                        const Icon = type.icon

                        return (
                            <Reveal
                                key={type.title}
                                delay={i * 0.05}
                                className={cn('h-full', i === 0 && 'lg:col-span-2')}
                            >
                                <article
                                    data-tone={type.tone}
                                    className="surface flex h-full flex-col gap-4 bg-tone p-7 text-tone-ink"
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <span className="eyebrow opacity-80">{type.tag}</span>
                                        <Icon className="size-7 shrink-0" strokeWidth={1.75} />
                                    </div>
                                    <h3 className="display display-card max-w-[14ch]">
                                        {type.title}
                                    </h3>
                                    <p className="max-w-[46ch] text-[15px] leading-snug opacity-85">
                                        {type.description}
                                    </p>
                                </article>
                            </Reveal>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
