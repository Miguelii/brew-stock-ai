import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { SentimentGauge } from './sentiment-gauge'
import type { ReportDTO } from '@/types/ReportDTO'
import { PropmptsEnum } from '@/types/PropmptsEnum'

type Props = {
    report: ReportDTO
}

export function ReportSentimentCard({ report }: Props) {
    const isRiskAnalysis = report.type === PropmptsEnum.RISK_ANALYSIS

    return (
        <Card className="h-79 md:h-81">
            <CardHeader className="border-b">
                <CardTitle className="text-base font-semibold">
                    {isRiskAnalysis ? 'AI Risk Score' : 'AI Sentiment Score'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <SentimentGauge score={report.sentiment ?? 0} isRiskAnalysis={isRiskAnalysis} />
            </CardContent>
        </Card>
    )
}
