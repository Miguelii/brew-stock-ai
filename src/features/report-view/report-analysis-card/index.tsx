import type { ReportDTO } from '@/types/ReportDTO'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { PROMPT_OPTIONS } from '@/lib/constants'

type Props = {
    report: ReportDTO
}

export function ReportAnalysisCard({ report }: Props) {
    return (
        <Card>
            <CardHeader className="border-b">
                <CardTitle className="text-base font-semibold">
                    {PROMPT_OPTIONS.find((o) => o.type === report.type)?.label}
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-4 h-100 overflow-y-auto">
                <div
                    className="analysis-prose"
                    dangerouslySetInnerHTML={{ __html: report?.ai_response ?? '' }}
                />
            </CardContent>
        </Card>
    )
}
