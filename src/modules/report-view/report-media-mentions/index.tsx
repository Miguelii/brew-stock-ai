import { FileTextIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { StockReports } from '@/types/ReportDTO'
import { ExpertReportItem } from '@/modules/report-view/report-media-mentions/expert-report-item'

type Props = {
    reports: StockReports[]
}

export function ReportMediaMentions({ reports }: Props) {
    return (
        <Card className="h-fit gap-0 pb-0!">
            <CardHeader className="border-b-2 border-ink/8 pb-4">
                <CardTitle className="display text-2xl">What Experts Are Saying</CardTitle>
                <CardDescription className="text-xs text-ink/60">
                    Recent reports and research from professional investors and analysts
                </CardDescription>
            </CardHeader>

            <CardContent>
                {reports.length === 0 ? (
                    <div
                        data-testid="expert-reports-empty"
                        className="flex flex-col items-center justify-center gap-2 py-8 text-center"
                    >
                        <FileTextIcon aria-hidden="true" className="size-6 text-ink/30" />
                        <span className="text-xs text-ink/60">
                            Our engine couldn&apos;t find any recent analyst coverage.
                        </span>
                    </div>
                ) : (
                    <ul>
                        {reports.map((report, i) => (
                            <ExpertReportItem
                                key={`${report.provider}-${report.reportDate}-${i}`}
                                report={report}
                            />
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    )
}
