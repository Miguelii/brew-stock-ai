import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AnalysisFormCard } from '@/modules/analysis/analysis-form-card'
import { getCachedSession } from '@/services/auth/get-cached-session'
import { TICKER_PAGES, TICKER_PAGE_MAP } from '@/lib/ticker-pages'
import { HomeLayout } from '@/components/home-layout'
import { BreadcrumbSchema, FAQSchema, FinancialProductSchema } from '@/components/structured-data'
import { ClientEnv } from '@/env/client'

type Props = PageProps<'/analysis/[ticker]'>

export function generateStaticParams() {
    return TICKER_PAGES.map((t) => ({ ticker: t.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { ticker } = await params
    const page = TICKER_PAGE_MAP.get(ticker)
    if (!page) return {}

    const pageUrl = `${ClientEnv.NEXT_PUBLIC_WEBSITE_URL}/analysis/${page.slug}`

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

    const siteUrl = ClientEnv.NEXT_PUBLIC_WEBSITE_URL
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
                ]}
            />
            <FinancialProductSchema
                ticker={page.ticker}
                name={page.name}
                description={page.description}
                url={pageUrl}
            />
            <HomeLayout companyName={`${page.name} (${page.ticker})`}>
                <AnalysisFormCard isAuthenticated={!!user} defaultTicker={page.ticker} />
            </HomeLayout>
        </>
    )
}
