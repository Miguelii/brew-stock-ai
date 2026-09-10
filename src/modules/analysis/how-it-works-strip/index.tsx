import { Reveal } from '@/components/motion/reveal'
import { IconEngine, IconReport, IconTicker } from '@/components/scene/step-icons'
import { STEPS } from '@/lib/analysis-content'

const ICONS = [IconTicker, IconEngine, IconReport] as const

export function HowItWorksStrip() {
    return (
        <section data-tone="paper" className="bg-tone pb-20 text-tone-ink lg:pb-30">
            <div className="section-shell">
                <Reveal className="surface bg-card p-7 sm:p-10">
                    <span className="eyebrow text-blue">How it works</span>

                    <ol className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
                        {STEPS.map((step, i) => {
                            const Icon = ICONS[i]

                            return (
                                <li key={step.title} className="flex flex-col gap-4">
                                    <Icon className="size-14 shrink-0" tint={step.tint} />
                                    <h3 className="text-xl leading-tight font-bold">
                                        {step.title}
                                    </h3>
                                    <p className="text-[15px] leading-snug opacity-70">
                                        {step.description}
                                    </p>
                                </li>
                            )
                        })}
                    </ol>
                </Reveal>
            </div>
        </section>
    )
}
