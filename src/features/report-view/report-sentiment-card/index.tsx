import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { SentimentGauge } from './sentiment-gauge'
import type { ReportDTO } from '@/types/ReportDTO'

type Props = {
    report: ReportDTO
}

export function ReportSentimentCard({ report }: Props) {
    return (
        <Card className="h-76 md:h-81">
            <CardHeader className="border-b">
                <CardTitle className="text-base font-semibold">AI Sentiment Score</CardTitle>
            </CardHeader>
            <CardContent>
                <SentimentGauge score={report.sentiment ?? 0} />
            </CardContent>
        </Card>
    )
}
