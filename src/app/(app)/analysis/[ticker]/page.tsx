import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AnalysisFormCard } from '@/modules/analysis/analysis-form-card'
import { getCachedSession } from '@/_bff/modules/auth/services/get-cached-session.service'
import { TICKER_PAGES, resolveTickerPage, isTickerEnriched } from '@/modules/analysis/ticker-pages'
import { AnalysisHero } from '@/modules/analysis/analysis-hero'
import { TickerFaq } from '@/modules/analysis/ticker-faq'
import { BreadcrumbSchema, FAQSchema, FinancialProductSchema } from '@/components/structured-data'
import { AdBlock } from '@/components/ad-block'
import { ClientEnv } from '@/env/client'
import { AD_SLOT_TICKER } from '@/lib/constants'

type Props = PageProps<'/analysis/[ticker]'>

export function generateStaticParams() {
    return TICKER_PAGES.map((t) => ({ ticker: t.slug }))
}

const SITE_URL = ClientEnv.NEXT_PUBLIC_WEBSITE_URL

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { ticker } = await params
    const page = resolveTickerPage(ticker)
    if (!page) return {}

    const pageUrl = `${SITE_URL}/analysis/${page.slug}`

    const META_TITLE = `${page.name} (${page.ticker}) Stock Analysis`
    const META_DESCRIPTION = `AI-powered stock analysis for ${page.name} (${page.ticker}). Get institutional-grade financial insights, market sentiment, and technical indicators for less than a coffee.`

    return {
        title: META_TITLE,
        description: META_DESCRIPTION,
        alternates: {
            canonical: pageUrl,
        },
        // Only enriched tickers (those with long-form unique content) are indexable.
        // The rest stay noindexed until they are enriched — the thin-content gate.
        ...(isTickerEnriched(page) ? {} : { robots: { index: false, follow: true } }),
        openGraph: {
            title: META_TITLE,
            description: META_DESCRIPTION,
            url: pageUrl,
        },
        twitter: {
            title: META_TITLE,
            description: META_DESCRIPTION,
        },
    }
}

export default async function TickerPage({ params }: Props) {
    const { ticker } = await params
    const page = resolveTickerPage(ticker)

    if (!page) notFound()

    const user = await getCachedSession()
    const content = page.content

    const pageUrl = `${SITE_URL}/analysis/${page.slug}`

    const faqQuestions = [
        {
            question: `What is ${page.name} (${page.ticker})?`,
            answer: content?.businessModel ?? page.description,
        },
        {
            question: `What sector does ${page.name} belong to?`,
            answer: `${page.name} (${page.ticker}) operates in the ${page.sector} sector.`,
        },
        {
            question: `What does the AI stock analysis for ${page.name} cover?`,
            answer: `The AI analysis for ${page.name} (${page.ticker}) covers fundamental financial metrics, market sentiment scoring, technical indicators, moat analysis, risk assessment, and growth potential. You get professional-level insights in seconds.`,
        },
        {
            question: `How can I get an AI analysis for ${page.name} stock?`,
            answer: `Enter the ${page.ticker} ticker on BrewStockAI and run the analysis. You get a full report covering financials, sentiment, and technicals for less than the price of a coffee.`,
        },
        {
            question: `Is ${page.name} (${page.ticker}) a good investment?`,
            answer: content
                ? `Whether ${page.name} is a good investment depends on your strategy and risk tolerance. ${content.whatToWatch} BrewStockAI's analysis covers valuation, growth potential, competitive moat, and risk factors. This is educational information, not investment advice.`
                : `Whether ${page.name} is a good investment depends on your strategy and risk tolerance. BrewStockAI's AI analysis covers ${page.name}'s valuation metrics, growth potential, competitive moat, and risk factors so you can make an informed decision. Run a free analysis to see the full breakdown.`,
        },
        {
            question: `What are the main risks of investing in ${page.name} stock?`,
            answer: content
                ? `Key risks for ${page.name} (${page.ticker}) include: ${content.keyRisks.join('; ')}. BrewStockAI's Risk Analysis report goes deeper on each.`
                : `Key risks for ${page.name} (${page.ticker}) depend on sector dynamics, competitive pressures, macroeconomic conditions, and company-specific factors. BrewStockAI's Risk Analysis report identifies debt exposure, regulatory threats, and market vulnerabilities specific to ${page.name}.`,
        },
        {
            question: `How does AI stock analysis work for ${page.name}?`,
            answer: `BrewStockAI processes ${page.name}'s earnings reports, balance sheets, cash flow statements, and market data using AI to produce institutional-grade analysis in under 2 minutes. The result is a structured report covering financials, sentiment, technicals, and competitive positioning.`,
        },
        {
            question: `What is the difference between BrewStockAI analysis types for ${page.name}?`,
            answer: `BrewStockAI offers five analysis types for ${page.name} (${page.ticker}): Wall Street Analysis (full-scope), Deep Financial Breakdown (revenue, margins, cash flow), Competitive Advantage (moat analysis), Risk Analysis (debt, regulatory, macro risks), and Growth Potential (market expansion, pipelines). Each answers a different investment question.`,
        },
        ...(content
            ? [
                  {
                      question: `Who are ${page.name}'s main competitors?`,
                      answer: `${page.name} (${page.ticker}) competes with ${content.competitors.join(', ')}.`,
                  },
              ]
            : []),
    ]

    return (
        <>
            <BreadcrumbSchema
                items={[
                    { name: 'Home', url: `${SITE_URL}/` },
                    { name: 'Analysis', url: `${SITE_URL}/analysis` },
                    { name: `${page.name} (${page.ticker})`, url: pageUrl },
                ]}
            />
            <FAQSchema questions={faqQuestions} />
            <FinancialProductSchema
                ticker={page.ticker}
                name={page.name}
                description={page.description}
                url={pageUrl}
            />
            <main id="main" className="w-full px-6 py-16 lg:py-24">
                <section className="flex-1 max-w-7xl mx-auto">
                    <AnalysisHero companyName={`${page.name} (${page.ticker})`}>
                        <AnalysisFormCard isAuthenticated={!!user} defaultTicker={page.ticker} />
                    </AnalysisHero>
                </section>

                <AdBlock
                    slot={AD_SLOT_TICKER}
                    format="horizontal"
                    className="hidden md:block max-w-7xl mx-auto px-6 mt-8"
                />

                <div className="max-w-7xl mx-auto mt-16 lg:mt-24 flex flex-col gap-12 lg:gap-16">
                    <TickerFaq
                        companyName={`${page.name} (${page.ticker})`}
                        questions={faqQuestions}
                    />
                </div>
            </main>
        </>
    )
}
