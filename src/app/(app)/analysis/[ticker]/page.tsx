import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AnalysisFormCard } from '@/modules/analysis/analysis-form-card'
import { TICKER_PAGES, resolveTickerPage } from '@/lib/ticker-pages'
import { AnalysisHero } from '@/modules/analysis/analysis-hero'
import { TickerFaq } from '@/modules/analysis/ticker-faq'
import { TickerContentSections } from '@/modules/analysis/ticker-content-sections'
import { BreadcrumbSchema, FinancialProductSchema } from '@/components/structured-data'
import { ClientEnv } from '@/env/client'
import { truncateText } from '@/_bff/core/utils/formatters.utils'
import { getAnalysisPageData } from '@/lib/get-analysis-page-data.helper'
import { AnalysisTypesGrid } from '@/modules/analysis/analysis-types-grid'

type Props = PageProps<'/analysis/[ticker]'>

export function generateStaticParams() {
    return TICKER_PAGES.map((t) => ({ ticker: t.slug }))
}

const SITE_URL = ClientEnv.NEXT_PUBLIC_WEBSITE_URL

const META_DESCRIPTION_MAX_CHARS = 160

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { ticker } = await params
    const page = resolveTickerPage(ticker)
    if (!page) return {}

    const pageUrl = `${SITE_URL}/analysis/${page.slug}`

    const META_TITLE = `${page.name} (${page.ticker}) Stock Analysis`
    const META_DESCRIPTION = truncateText(page.description, META_DESCRIPTION_MAX_CHARS)

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

    const { isAuthenticated, isMaintenance } = await getAnalysisPageData()

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
            <FinancialProductSchema
                ticker={page.ticker}
                name={page.name}
                description={page.description}
                url={pageUrl}
            />
            {/* The hero is full-bleed under the fixed header, so it cancels its spacer. */}
            <main id="main" className="-mt-20 w-full overflow-x-clip">
                <AnalysisHero companyName={`${page.name} (${page.ticker})`}>
                    <AnalysisFormCard
                        isAuthenticated={isAuthenticated}
                        defaultTicker={page.ticker}
                        isMaintenance={isMaintenance}
                    />
                </AnalysisHero>

                <AnalysisTypesGrid />

                <section data-tone="paper" className="bg-tone text-tone-ink">
                    <div className="section-shell section-pad flex flex-col gap-12 lg:gap-16 pt-0">
                        <TickerContentSections page={page} />

                        <TickerFaq
                            companyName={`${page.name} (${page.ticker})`}
                            questions={faqQuestions}
                        />
                    </div>
                </section>
            </main>
        </>
    )
}
