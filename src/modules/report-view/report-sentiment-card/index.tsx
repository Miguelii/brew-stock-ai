import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { SentimentGauge } from '@/modules/report-view/report-sentiment-card/sentiment-gauge'
import type { ReportDTO } from '@/types/ReportDTO'
import { PropmptsEnum } from '@/types/PropmptsEnum'

type Props = {
    report: ReportDTO
}

export function ReportSentimentCard({ report }: Props) {
    const isRiskAnalysis = report.type === PropmptsEnum.RISK_ANALYSIS

    return (
        <Card className="h-79 md:h-full w-full">
            <CardHeader className="border-b">
                <CardTitle data-testid="sentiment-score" className="font-semibold">
                    {isRiskAnalysis ? 'Risk Score' : 'Sentiment Score'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <SentimentGauge score={report.sentiment ?? 0} isRiskAnalysis={isRiskAnalysis} />
            </CardContent>
        </Card>
    )
}
