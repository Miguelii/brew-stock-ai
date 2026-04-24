import { ArrowLeftIcon } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { createCaller } from '@/server/caller'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ReportAnalysisCard } from '@/features/report-view/report-analysis-card'
import { ReportSentimentCard } from '@/features/report-view/report-sentiment-card'
import { ReportExport } from '@/features/report-view/report-export'

type Props = PageProps<'/reports/[id]'>

export default async function ReportsIdPage(props: Props) {
    const params = await props.params
    const caller = await createCaller()
    const report = await caller.getReportById({ id: params.id })

    return (
        <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
            <div className="flex flex-col gap-6">
                <Link href="/reports" prefetch={false} className="w-fit">
                    <Button variant="outline">
                        <ArrowLeftIcon />
                        Back
                    </Button>
                </Link>

                <div className="flex flex-row w-full justify-between items-center">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight text-accent-blue">
                            {report.stock}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            AI-Driven Fundamental Analysis &amp; Sentiment Report
                        </p>
                    </div>
                    <ReportExport />
                </div>
            </div>

            <Separator />

            <div className="flex flex-col-reverse md:grid md:grid-cols-[1fr_250px] lg:grid-cols-[1fr_350px] gap-6">
                <ReportAnalysisCard report={report} />

                <ReportSentimentCard report={report} />
            </div>
        </main>
    )
}
