import { cn } from '@/lib/utils'
import type { TickerPage } from '@/types/TickerPage'
import * as motion from 'motion/react-client'

type Props = {
    ticker: TickerPage
}

const analysisDimensions = [
    {
        label: 'Wall Street Analysis',
        desc: 'Valuation, financials, and competitive positioning — the professional analyst framework.',
        wide: false,
    },
    {
        label: 'Deep Financial Breakdown',
        desc: 'Revenue trends, profit margins, cash flow health, and balance sheet strength.',
        wide: false,
    },
    {
        label: 'Competitive Advantage',
        desc: 'Brand power, network effects, switching costs — the durable moats.',
        wide: false,
    },
    {
        label: 'Risk Analysis',
        desc: 'Debt exposure, regulatory threats, and macroeconomic vulnerabilities.',
        wide: false,
    },
    {
        label: 'Growth Potential',
        desc: 'Market expansion, R&D pipelines, and emerging sector tailwinds.',
        wide: true,
    },
] as const

export function TickerAbout({ ticker }: Props) {
    return (
        <section className="border-t border-border bg-card/50 mt-12 lg:mt-20">
            <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
                    {/* Left — company brief */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-8%' }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col gap-5 lg:w-5/12 shrink-0"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-semibold tracking-widest uppercase text-accent-blue">
                                {ticker.sector}
                            </span>
                            <span className="h-px flex-1 bg-border" />
                            <span className="font-mono text-xs text-primary-muted">
                                {ticker.ticker}
                            </span>
                        </div>

                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
                            About {ticker.name}
                        </h2>

                        <p className="text-primary-muted leading-relaxed text-base">
                            {ticker.description}
                        </p>

                        <p className="text-primary-muted leading-relaxed text-sm border-t border-border pt-5">
                            StockBrewAI delivers institutional-grade AI analysis for {ticker.ticker}{' '}
                            in under 60 seconds — financial health, competitive moat, risk exposure,
                            and growth potential for less than a coffee.
                        </p>
                    </motion.div>

                    {/* Right — 5 analysis dimensions */}
                    <div className="flex flex-col gap-5 lg:w-7/12">
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-8%' }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="mb-2"
                        >
                            <p className="text-primary-muted leading-relaxed text-base">
                                Five dimensions covered in every{' '}
                                <span className="text-primary font-semibold">{ticker.ticker}</span>{' '}
                                analysis report.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 grid-flow-dense">
                            {analysisDimensions.map((item, i) => (
                                <motion.div
                                    key={item.label}
                                    initial={{ opacity: 0, y: 24 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-5%' }}
                                    transition={{
                                        duration: 0.5,
                                        delay: i * 0.07,
                                        ease: [0.16, 1, 0.3, 1],
                                    }}
                                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                    className={cn(
                                        'group p-6 border border-border rounded-xl bg-card cursor-default transition-shadow duration-300 hover:shadow-lg hover:shadow-black/5 hover:border-accent-blue/30',
                                        item.wide && 'sm:col-span-2'
                                    )}
                                >
                                    <div className="w-9 h-9 rounded-xl bg-accent-blue/10 flex items-center justify-center mb-4 shrink-0">
                                        <span className="text-accent-blue font-bold text-sm">
                                            {i + 1}
                                        </span>
                                    </div>
                                    <h3 className="text-base font-semibold mb-2 group-hover:text-accent-blue transition-colors duration-200">
                                        {item.label}
                                    </h3>
                                    <p className="text-primary-muted leading-relaxed text-sm">
                                        {item.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
