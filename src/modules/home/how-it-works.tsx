import * as motion from 'motion/react-client'
import { SectionHeader } from '@/modules/home/section-header'

const STEPS = [
    {
        title: 'Pick a stock',
        description:
            'Type in any ticker — from Apple to the small-cap you just read about — and choose the angle you care about: full analysis, financials, moat, risk, or growth.',
    },
    {
        title: 'The AI does the research',
        description:
            'The engine pulls earnings history, forward estimates, analyst ratings, insider activity, technical signals, and the latest news — and weighs the evidence fundamentals-first.',
    },
    {
        title: 'Read a structured report',
        description:
            'In under two minutes you get a report you can actually act on. Every claim is grounded in data, and the numbers are shown right next to the analysis.',
    },
] as const

export function HowItWorks() {
    return (
        <section className="border-b border-border">
            <div className="max-w-7xl mx-auto px-6 py-24 lg:py-32">
                <SectionHeader
                    title="What StockBrewAI Actually Does"
                    lede="StockBrewAI processes earnings reports, balance sheets, and market data the same way professional analysts do. You get the output in under 2 minutes for less than a coffee."
                    className="mb-16"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
                    {STEPS.map((step, i) => (
                        <motion.div
                            key={step.title}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-8%' }}
                            transition={{ duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                            className="relative flex flex-col gap-4 border-t-2 border-border pt-6"
                        >
                            <span
                                aria-hidden
                                className="font-mono text-5xl font-bold leading-none text-accent-blue/20 select-none"
                            >
                                {String(i + 1).padStart(2, '0')}
                            </span>
                            <h3 className="text-xl font-semibold">{step.title}</h3>
                            <p className="text-primary-muted leading-relaxed">{step.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
