import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AnalysisFormCard } from '@/modules/analysis/analysis-form-card'
import { getCachedSession } from '@/services/auth/get-cached-session'
import { TICKER_PAGES, TICKER_PAGE_MAP } from '@/lib/ticker-pages'
import { AnalysisHero } from '@/components/analysis-hero'
import { BreadcrumbSchema, FAQSchema, FinancialProductSchema } from '@/components/structured-data'
import { ClientEnv } from '@/env/client'
import { TickerAbout } from '@/components/ticker-about'

type Props = PageProps<'/analysis/[ticker]'>

export function generateStaticParams() {
    return TICKER_PAGES.map((t) => ({ ticker: t.slug }))
}

const siteUrl = ClientEnv.NEXT_PUBLIC_WEBSITE_URL

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { ticker } = await params
    const page = TICKER_PAGE_MAP.get(ticker)
    if (!page) return {}

    const pageUrl = `${siteUrl}/analysis/${page.slug}`

    return {
        title: `${page.name} (${page.ticker}) Stock Analysis`,
        description: `AI-powered stock analysis for ${page.name} (${page.ticker}). Get institutional-grade financial insights, market sentiment, and technical indicators for less than a coffee.`,
        alternates: {
            canonical: pageUrl,
        },
        openGraph: {
            title: `${page.name} (${page.ticker}) Stock Analysis | StockBrewAI`,
            description: `AI-powered stock analysis for ${page.name} (${page.ticker}). Financial metrics, sentiment analysis, and technical indicators.`,
            url: pageUrl,
        },
    }
}

export default async function TickerPage({ params }: Props) {
    const { ticker } = await params
    const page = TICKER_PAGE_MAP.get(ticker)

    if (!page) notFound()

    const user = await getCachedSession()

    const pageUrl = `${siteUrl}/analysis/${page.slug}`

    return (
        <>
            <BreadcrumbSchema
                items={[
                    { name: 'Home', url: `${siteUrl}/` },
                    { name: 'Analysis', url: `${siteUrl}/analysis` },
                    { name: `${page.name} (${page.ticker})`, url: pageUrl },
                ]}
            />
            <FAQSchema
                questions={[
                    {
                        question: `What is ${page.name} (${page.ticker})?`,
                        answer: page.description,
                    },
                    {
                        question: `What sector does ${page.name} belong to?`,
                        answer: `${page.name} (${page.ticker}) operates in the ${page.sector} sector.`,
                    },
                    {
                        question: `What does the AI stock analysis for ${page.name} cover?`,
                        answer: `The AI analysis for ${page.name} (${page.ticker}) covers fundamental financial metrics, market sentiment scoring, technical indicators, moat analysis, risk assessment, and growth potential — institutional-grade insights delivered in seconds.`,
                    },
                    {
                        question: `How can I get an AI analysis for ${page.name} stock?`,
                        answer: `Enter the ${page.ticker} ticker on StockBrewAI and run the analysis. You get a full report covering financials, sentiment, and technicals for less than the price of a coffee.`,
                    },
                    {
                        question: `Is ${page.name} (${page.ticker}) a good investment?`,
                        answer: `Whether ${page.name} is a good investment depends on your strategy and risk tolerance. StockBrewAI's AI analysis covers ${page.name}'s valuation metrics, growth potential, competitive moat, and risk factors so you can make an informed decision. Run a free analysis to see the full breakdown.`,
                    },
                    {
                        question: `What are the main risks of investing in ${page.name} stock?`,
                        answer: `Key risks for ${page.name} (${page.ticker}) depend on sector dynamics, competitive pressures, macroeconomic conditions, and company-specific factors. StockBrewAI's Risk Analysis report identifies debt exposure, regulatory threats, and market vulnerabilities specific to ${page.name}.`,
                    },
                    {
                        question: `How does AI stock analysis work for ${page.name}?`,
                        answer: `StockBrewAI processes ${page.name}'s earnings reports, balance sheets, cash flow statements, and market data using AI to produce institutional-grade analysis in under 1 minute. The result is a structured report covering financials, sentiment, technicals, and competitive positioning.`,
                    },
                    {
                        question: `What is the difference between StockBrewAI analysis types for ${page.name}?`,
                        answer: `StockBrewAI offers five analysis types for ${page.name} (${page.ticker}): Wall Street Analysis (full-scope), Deep Financial Breakdown (revenue, margins, cash flow), Competitive Advantage (moat analysis), Risk Analysis (debt, regulatory, macro risks), and Growth Potential (market expansion, pipelines). Each answers a different investment question.`,
                    },
                ]}
            />
            <FinancialProductSchema
                ticker={page.ticker}
                name={page.name}
                description={page.description}
                url={pageUrl}
            />
            <main id="#main" className="w-full px-6 py-16 lg:py-24">
                <section className="flex-1 max-w-7xl mx-auto">
                    <AnalysisHero companyName={`${page.name} (${page.ticker})`}>
                        <AnalysisFormCard isAuthenticated={!!user} defaultTicker={page.ticker} />
                    </AnalysisHero>
                </section>

                <TickerAbout ticker={page} />
            </main>
        </>
    )
}
