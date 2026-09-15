// oxlint-disable import/max-dependencies
import type { Metadata } from 'next'
import { ReportAnalysisCard } from '@/modules/report-view/report-analysis-card'
import { ReportSentimentCard } from '@/modules/report-view/report-sentiment-card'
import { ReportHero } from '@/modules/report-view/report-hero'
import { notFound } from 'next/navigation'
import { cache, Suspense } from 'react'
import type { ReportDTO } from '@/types/ReportDTO'
import { ReportTldrCard } from '@/modules/report-view/report-tldr-card'
import { ReportSigDev } from '@/modules/report-view/report-sig-dev'
import { ReportMediaMentions } from '@/modules/report-view/report-media-mentions'
import { ReportSectorScores } from '@/modules/report-view/report-sector-scores'
import { ReportSectionNav } from '@/modules/report-view/report-section-nav'
import { ReportFinancialsCard } from '@/modules/report-view/report-financials-card'
import { ReportMarketOutlookCard } from '@/modules/report-view/report-market-outlook-card'
import { BreadcrumbSchema } from '@/components/structured-data'
import { ClientEnv } from '@/env/client'
import { ReportLatestNewsServer } from '@/modules/report-view/report-latest-news-card/report-latest-news-server'
import { ReportLatestNewsCardSkeleton } from '@/modules/report-view/report-latest-news-card/report-latest-news-card-skeleton'
import { createCaller } from '@/_trpc/server/caller'
import { sanitizeReportHtml } from '@/_bff/modules/reports/helpers/sanitize-report-html.helper'
import { PROMPT_OPTIONS } from '@/lib/constants'

type Props = PageProps<'/reports/[id]'>

const SITE_URL = ClientEnv.NEXT_PUBLIC_WEBSITE_URL

const getCachedReportById = cache(async (id: ReportDTO['id']) => {
    const caller = await createCaller()
    const response = await caller.reports.getById({ id }).catch(() => null)
    // ai_response is rendered via dangerouslySetInnerHTML — sanitize at the trust boundary
    if (response?.report?.ai_response) {
        response.report.ai_response = sanitizeReportHtml(response.report.ai_response)
    }
    return response
})

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params

    const response = await getCachedReportById(id)

    const report = response?.report

    if (report?.stock) {
        const META_URL = `${SITE_URL}/reports/${report.id}`

        const title = report.ticker ?? report.stock ?? 'Report'

        const META_TITLE = title.toUpperCase()
        const META_DESCRIPTION = `AI-driven fundamental analysis and sentiment report for ${report.ticker ?? report.stock}. Key metrics, analyst targets, and sector scores.`

        return {
            title: META_TITLE,
            description: META_DESCRIPTION,
            alternates: {
                canonical: META_URL,
            },
            openGraph: {
                title: META_TITLE,
                description: META_DESCRIPTION,
                url: META_URL,
            },
            twitter: {
                title: META_TITLE,
                description: META_DESCRIPTION,
            },
        }
    }

    const NOT_FOUND_DESC = 'This report does not exist or has been removed.'

    return {
        title: 'Report Not Found',
        description: NOT_FOUND_DESC,
        openGraph: {
            title: 'Report Not Found',
            description: NOT_FOUND_DESC,
        },
        twitter: {
            title: 'Report Not Found',
            description: NOT_FOUND_DESC,
        },
    }
}

export default async function ReportsIdPage(props: Props) {
    const params = await props.params

    const response = await getCachedReportById(params.id)

    const report = response?.report

    const stockData = response?.stockData

    const stockTicker = stockData?.id ?? report?.ticker ?? report?.stock ?? undefined

    if (!report) return notFound()

    const META_URL = `${SITE_URL}/reports/${report.id}`

    const reportTypeLabel = PROMPT_OPTIONS?.find((o) => o.type === report.type)?.label

    return (
        <>
            <BreadcrumbSchema
                items={[
                    { name: 'Home', url: `${SITE_URL}/` },
                    { name: 'Reports', url: `${SITE_URL}/reports` },
                    { name: report.stock, url: META_URL },
                ]}
            />
            {/* The hero is full-bleed under the fixed header, so it cancels its spacer. */}
            <main id="main" className="-mt-20">
                <ReportHero report={report} typeLabel={reportTypeLabel} />

                <div data-tone="paper" className="bg-tone text-tone-ink">
                    {/*
                     * Opaque strip pinned to the top of the viewport so scrolled
                     * content never shows between the floating header pills. Below
                     * xl the section nav bar already does this job.
                     */}
                    <div
                        aria-hidden="true"
                        className="sticky top-0 z-30 hidden h-[72px] bg-tone xl:block"
                    />

                    <div className="section-shell pb-20 lg:pb-30">
                        <div className="flex flex-col gap-8 xl:grid xl:grid-cols-[200px_1fr] xl:gap-10">
                            <ReportSectionNav />

                            {/* min-w-0 keeps the chart and the metric tables from
                                blowing the column past its grid fraction. */}
                            <div className="flex min-w-0 flex-col gap-6">
                                <section id="overview" data-testid="report-section-overview">
                                    <div className="flex flex-col md:grid md:grid-cols-[1fr_250px] lg:grid-cols-[1fr_350px] gap-6">
                                        <ReportTldrCard report={report} />
                                        <ReportSentimentCard report={report} />
                                    </div>
                                </section>

                                <section
                                    id="market-outlook"
                                    data-testid="report-section-market-outlook"
                                >
                                    <ReportMarketOutlookCard
                                        financials={stockData?.financials ?? null}
                                        fundamentals={stockData?.fundamentals ?? null}
                                        ticker={stockTicker}
                                    />
                                </section>

                                <section id="key-metrics" data-testid="report-section-key-metrics">
                                    <ReportFinancialsCard
                                        financials={stockData?.financials ?? null}
                                        fundamentals={stockData?.fundamentals ?? null}
                                    />
                                </section>

                                <section id="analysis" data-testid="report-section-analysis">
                                    <ReportAnalysisCard report={report} />
                                </section>

                                <section id="sig-dev" data-testid="report-section-sig-dev">
                                    <ReportSigDev
                                        headline={stockData?.sig_dev?.headline}
                                        date={stockData?.sig_dev?.date}
                                    />
                                </section>

                                <section id="latest-news" data-testid="report-section-latest-news">
                                    <Suspense fallback={<ReportLatestNewsCardSkeleton />}>
                                        <ReportLatestNewsServer ticker={stockTicker} />
                                    </Suspense>
                                </section>

                                <section
                                    id="media-mentions"
                                    data-testid="report-section-media-mentions"
                                >
                                    <ReportMediaMentions news={stockData?.reports ?? []} />
                                </section>

                                <section
                                    id="sector-scores"
                                    data-testid="report-section-sector-scores"
                                >
                                    <ReportSectorScores scores={stockData?.scores ?? null} />
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}
