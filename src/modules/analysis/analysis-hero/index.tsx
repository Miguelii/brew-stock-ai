import type { PropsWithChildren } from 'react'
import { AnalysisHeroScene } from '@/modules/analysis/analysis-hero/scene'
import { PRODUCT_STATS } from '@/lib/analysis-content'

type Props = PropsWithChildren<{
    companyName?: string
}>

export function AnalysisHero({ children, companyName }: Props) {
    return (
        <section
            data-tone="navy"
            className="relative isolate overflow-hidden bg-tone pt-28 pb-16 lg:pt-40 lg:pb-28"
        >
            <AnalysisHeroScene />

            <div className="section-shell relative z-10 grid items-center gap-12 lg:grid-cols-[1fr_460px] lg:gap-16">
                <div>
                    {/* The company name must live inside the H1 — it is the target keyword. */}
                    {companyName ? (
                        <h1 className="display display-section mt-6 flex flex-col gap-1 text-amber-soft">
                            <span>{companyName}</span>
                            <span>Professional Stock Analysis</span>
                        </h1>
                    ) : (
                        <h1 className="display display-section mt-6 text-amber-soft">
                            Professional Stock Analysis
                        </h1>
                    )}

                    <div className="mt-5 max-w-[46ch] text-lg leading-snug font-bold text-tone-ink">
                        <p>
                            Deep financial insights, market sentiment, and technical indicators. For
                            less than a coffee ☕
                        </p>
                    </div>

                    <div className="mt-8 hidden flex-wrap gap-2.5 sm:flex">
                        {PRODUCT_STATS.map((stat) => (
                            <span
                                key={stat.label}
                                className="eyebrow inline-flex items-center rounded-full bg-tone-ink/12 px-4 py-2 text-tone-ink"
                            >
                                {stat.label}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="w-full">{children}</div>
            </div>
        </section>
    )
}
