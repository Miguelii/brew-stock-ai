import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AnalysisFormCard } from '@/features/analysis/analysis-form-card'
import { getCachedSession } from '@/services/supabase/get-cached-session'
import { TICKER_PAGES, TICKER_PAGE_MAP } from '@/lib/ticker-pages'
import { HomeLayout } from '@/components/home-layout'

type Props = PageProps<'/analysis/[ticker]'>

export function generateStaticParams() {
    return TICKER_PAGES.map((t) => ({ ticker: t.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { ticker } = await params
    const page = TICKER_PAGE_MAP.get(ticker)
    if (!page) return {}

    return {
        title: `${page.name} (${page.ticker}) Stock Analysis`,
        description: `AI-powered stock analysis for ${page.name} (${page.ticker}). Get institutional-grade financial insights, market sentiment, and technical indicators for less than a coffee.`,
        openGraph: {
            title: `${page.name} (${page.ticker}) Stock Analysis | StockBrewAI`,
            description: `AI-powered stock analysis for ${page.name} (${page.ticker}). Financial metrics, sentiment analysis, and technical indicators.`,
        },
    }
}

export default async function TickerPage({ params }: Props) {
    const { ticker } = await params
    const page = TICKER_PAGE_MAP.get(ticker)

    if (!page) notFound()

    const user = await getCachedSession()

    return (
        <HomeLayout companyName={`${page.name} (${page.ticker})`}>
            <AnalysisFormCard isAuthenticated={!!user} defaultTicker={page.ticker} />
        </HomeLayout>
    )
}
