import type { Metadata } from 'next'
import { ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ReportAnalysisCard } from '@/features/report-view/report-analysis-card'
import { ReportSentimentCard } from '@/features/report-view/report-sentiment-card'
import { ReportExport } from '@/features/report-view/report-export'
import { notFound } from 'next/navigation'
import { Effect } from 'effect'
import { getReportById } from '@/services/reports/get-report-by-id'
import { cache } from 'react'
import type { ReportDTO } from '@/types/ReportDTO'
import { ReportTldrCard } from '@/features/report-view/report-tldr-card'
import { ReportSigDev } from '@/features/report-view/report-sig-dev'
import { ReportLatestNews } from '@/features/report-view/report-latest-news'
import { ReportSectorScores } from '@/features/report-view/report-sector-scores'
import { ReportSectionNav } from '@/features/report-view/report-section-nav'

type Props = PageProps<'/reports/[id]'>

const getCachedReportById = cache(async (id: ReportDTO['id']) => {
    return await Effect.runPromise(
        getReportById(id).pipe(Effect.catchAll(() => Effect.succeed(null)))
    )
})

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params

    const response = await getCachedReportById(id)

    const report = response?.report

    if (report?.stock) {
        return {
            title: report.stock.charAt(0).toUpperCase() + report.stock.slice(1).toLowerCase(),
        }
    }
    return {
        title: 'See Report',
    }
}

export default async function ReportsIdPage(props: Props) {
    const params = await props.params

    const response = await getCachedReportById(params.id)

    const report = response?.report

    const stockData = response?.stockData

    if (!report) return notFound()

    return (
        <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
            <div className="flex flex-col gap-6">
                <Link href="/reports" prefetch={false} className="w-fit">
                    <Button variant="outline" size="sm" className="rounded-none">
                        <ArrowLeftIcon />
                        Back
                    </Button>
                </Link>

                <div className="flex flex-col gap-6 md:gap-0 items-start md:flex-row w-full justify-between md:items-center">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight text-accent-blue font-mono">
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
                <ReportLatestNews news={stockData?.reports ?? []} />
            </section>

            <section id="sector-scores">
                <ReportSectorScores scores={stockData?.scores ?? null} />
            </section>
        </main>
    )
}
