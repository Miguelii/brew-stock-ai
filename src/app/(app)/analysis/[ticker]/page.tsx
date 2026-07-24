import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AnalysisFormCard } from '@/modules/analysis/analysis-form-card'
import { getCachedSession } from '@/_bff/modules/auth/services/get-cached-session.service'
import { TICKER_PAGES, resolveTickerPage } from '@/modules/analysis/ticker-pages'
import { AnalysisHero } from '@/modules/analysis/analysis-hero'
import { TickerFaq } from '@/modules/analysis/ticker-faq'
import { TickerContentSections } from '@/modules/analysis/ticker-content-sections'
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

    const { content } = page

    const pageUrl = `${SITE_URL}/analysis/${page.slug}`

    const faqQuestions = [
        {
            question: `What is ${page.name} (${page.ticker})?`,
            answer: content.businessModel,
        },
        {
            question: `Is ${page.name} (${page.ticker}) a good investment?`,
            answer: `Whether ${page.name} is a good investment depends on your strategy and risk tolerance. ${content.whatToWatch} This is educational information, not investment advice.`,
        },
        {
            question: `What are the main risks of investing in ${page.name} stock?`,
            answer: `Key risks for ${page.name} (${page.ticker}) include: ${content.keyRisks.join('; ')}.`,
        },
        {
            question: `Who are ${page.name}'s main competitors?`,
            answer: `${page.name} (${page.ticker}) operates in the ${page.sector} sector and competes with ${content.competitors.join(', ')}.`,
        },
        ...(content.faq ?? []),
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

                <section className="max-w-7xl mx-auto mt-16 lg:mt-26 flex flex-col gap-12 lg:gap-16">
                    <TickerContentSections page={page} />

                    <TickerFaq
                        companyName={`${page.name} (${page.ticker})`}
                        questions={faqQuestions}
                    />
                </section>
            </main>
        </>
    )
}
