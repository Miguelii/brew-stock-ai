import type { ReportDTO } from '@/types/ReportDTO'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { PROMPT_OPTIONS } from '@/lib/constants'

type Props = {
    report: ReportDTO
}

export function ReportAnalysisCard({ report }: Props) {
    return (
        <Card>
            <CardHeader className="border-b-2 border-ink/8 pb-4">
                <CardTitle className="display text-2xl">
                    {PROMPT_OPTIONS.find((o) => o.type === report.type)?.label}
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-4 h-full md:h-full overflow-y-scroll">
                <div
                    className="analysis-prose"
                    dangerouslySetInnerHTML={{ __html: report?.ai_response ?? '' }}
                />
            </CardContent>
        </Card>
    )
}
