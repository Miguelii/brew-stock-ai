// oxlint-disable import/max-dependencies
import type { Metadata } from 'next'
import { ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ReportAnalysisCard } from '@/modules/report-view/report-analysis-card'
import { ReportSentimentCard } from '@/modules/report-view/report-sentiment-card'
import { ReportExport } from '@/modules/report-view/report-export'
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
import { PROMPT_OPTIONS } from '@/lib/constants'
import { createCaller } from '@/_trpc/server/caller'
import { sanitizeReportHtml } from '@/_bff/modules/reports/helpers/sanitize-report-html.helper'

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
            <main id="main" className="main-container-lg">
                <div className="flex flex-col gap-6">
                    <Link href="/reports" prefetch={false} className="w-fit">
                        <Button variant="outline" size="sm" className="rounded-none">
                            <ArrowLeftIcon />
                            Back
                        </Button>
                    </Link>

                    <div className="flex flex-col gap-6 md:gap-0 items-start md:flex-row w-full justify-between md:items-center">
                        <div className="space-y-3">
                            {reportTypeLabel && (
                                <span className="inline-flex items-center rounded px-2 py-1 text-xs font-semibold bg-accent-blue-light text-accent-blue">
                                    {reportTypeLabel}
                                </span>
                            )}
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-accent-blue font-mono">
                                {report.stock}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                AI-Driven Fundamental Analysis &amp; Sentiment Report
                            </p>
                        </div>
                        <ReportExport reportId={report.id} />
                    </div>
                </div>

                <ReportSectionNav />

                <section id="overview">
                    <div className="flex flex-col md:grid md:grid-cols-[1fr_250px] lg:grid-cols-[1fr_350px] gap-6">
                        <ReportTldrCard report={report} />
                        <ReportSentimentCard report={report} />
                    </div>
                </section>

                <section id="market-outlook">
                    <ReportMarketOutlookCard
                        financials={stockData?.financials ?? null}
                        fundamentals={stockData?.fundamentals ?? null}
                        ticker={stockTicker}
                    />
                </section>

                <section id="key-metrics">
                    <ReportFinancialsCard
                        financials={stockData?.financials ?? null}
                        fundamentals={stockData?.fundamentals ?? null}
                    />
                </section>

                <section id="analysis">
                    <ReportAnalysisCard report={report} />
                </section>

                <section id="sig-dev">
                    <ReportSigDev
                        headline={stockData?.sig_dev?.headline}
                        date={stockData?.sig_dev?.date}
                    />
                </section>

                <section id="latest-news">
                    <Suspense fallback={<ReportLatestNewsCardSkeleton />}>
                        <ReportLatestNewsServer ticker={stockTicker} />
                    </Suspense>
                </section>

                <section id="media-mentions">
                    <ReportMediaMentions news={stockData?.reports ?? []} />
                </section>

                <section id="sector-scores">
                    <ReportSectorScores scores={stockData?.scores ?? null} />
                </section>
            </main>
        </>
    )
}
