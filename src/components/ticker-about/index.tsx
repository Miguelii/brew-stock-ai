import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowRightIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { TickerContent, TickerPage } from '@/types/TickerPage'
import { EDUCATION_HUB_ARTICLE_MAP } from '@/lib/education-hub-articles'
import * as motion from 'motion/react-client'

type Props = {
    ticker: TickerPage
}

export function TickerAbout({ ticker }: Props) {
    if (ticker.content) {
        return <TickerAboutEnriched ticker={ticker} content={ticker.content} />
    }
    return <TickerAboutOverview ticker={ticker} />
}

/* ---------------------------------------------------------------------------
 * Enriched layout — unique long-form editorial content per ticker.
 * ------------------------------------------------------------------------- */

type EnrichedProps = {
    ticker: TickerPage
    content: TickerContent
}

function TickerAboutEnriched({ ticker, content }: EnrichedProps) {
    const relatedArticles = (content.relatedArticleSlugs ?? [])
        .map((slug) => EDUCATION_HUB_ARTICLE_MAP.get(slug))
        .filter((article) => article != null)

    return (
        <section className="border-t border-border bg-card/50 mt-12 lg:mt-20">
            <div className="max-w-4xl mx-auto px-6 py-16 lg:py-24 flex flex-col gap-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-8%' }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col gap-5"
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
                </motion.div>

                <Block heading="Business model">
                    <Paragraphs text={content.businessModel} />
                </Block>

                <Block heading="Key products & segments">
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {content.keyProducts.map((item) => (
                            <li
                                key={item}
                                className="flex items-start gap-3 p-4 border border-border rounded-xl bg-card"
                            >
                                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent-blue" />
                                <span className="text-primary-muted text-sm leading-relaxed">
                                    {item}
                                </span>
                            </li>
                        ))}
                    </ul>
                </Block>

                <Block heading="The investment case">
                    <Paragraphs text={content.investmentNarrative} />
                </Block>

                <Block heading="Key risks">
                    <ul className="flex flex-col gap-3">
                        {content.keyRisks.map((risk) => (
                            <li key={risk} className="flex items-start gap-3">
                                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-warning" />
                                <span className="text-primary-muted text-sm leading-relaxed">
                                    {risk}
                                </span>
                            </li>
                        ))}
                    </ul>
                </Block>

                <Block heading="What to watch">
                    <Paragraphs text={content.whatToWatch} />
                </Block>

                <Block heading="Competitors">
                    <div className="flex flex-wrap gap-2">
                        {content.competitors.map((competitor) => (
                            <span
                                key={competitor}
                                className="rounded-full border border-border bg-card px-3 py-1.5 text-sm text-primary-muted"
                            >
                                {competitor}
                            </span>
                        ))}
                    </div>
                </Block>

                {relatedArticles.length > 0 && (
                    <Block heading="Related reading">
                        <div className="flex flex-col divide-y divide-border">
                            {relatedArticles.map((article) => (
                                <Link
                                    key={article.slug}
                                    href={`/education-hub/${article.slug}`}
                                    prefetch={false}
                                    className="group flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                                >
                                    <span className="text-primary font-medium group-hover:text-accent-blue transition-colors duration-200">
                                        {article.title}
                                    </span>
                                    <ArrowRightIcon className="size-4 shrink-0 text-accent-blue" />
                                </Link>
                            ))}
                        </div>
                    </Block>
                )}

                <p className="text-primary-muted leading-relaxed text-sm border-t border-border pt-6">
                    StockBrewAI delivers institutional-grade AI analysis for {ticker.name} (
                    {ticker.ticker}) in under 120 seconds — covering financial health, competitive
                    moat, risk exposure, and growth potential. This overview is for educational
                    purposes only and is not investment advice.
                </p>
            </div>
        </section>
    )
}

type BlockProps = {
    heading: string
    children: ReactNode
}

function Block({ heading, children }: BlockProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-8%' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-4"
        >
            <h3 className="text-xl md:text-2xl font-semibold tracking-tight">{heading}</h3>
            {children}
        </motion.div>
    )
}

type ParagraphsProps = {
    text: string
}

function Paragraphs({ text }: ParagraphsProps) {
    return (
        <div className="flex flex-col gap-4">
            {text.split('\n\n').map((paragraph) => (
                <p
                    key={paragraph.slice(0, 32)}
                    className="text-primary-muted leading-relaxed text-base"
                >
                    {paragraph}
                </p>
            ))}
        </div>
    )
}

/* ---------------------------------------------------------------------------
 * Fallback overview — used for tickers that are not yet enriched (noindexed).
 * ------------------------------------------------------------------------- */

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

type OverviewProps = {
    ticker: TickerPage
}

function TickerAboutOverview({ ticker }: OverviewProps) {
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
                            in under 120 seconds — financial health, competitive moat, risk
                            exposure, and growth potential for less than a coffee.
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
