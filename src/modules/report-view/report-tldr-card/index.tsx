import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import type { ReportDTO } from '@/types/ReportDTO'

type Props = {
    report: ReportDTO
}

function extractInvestmentThesis(html: string): string | null {
    const match = /<h3[^>]*>[\s\S]*?Investment Thesis Summary[\s\S]*?<\/h3>([\s\S]*)$/iu.exec(html)
    if (!match) return null
    return match[1].trim()
}

export function ReportTldrCard({ report }: Props) {
    const thesis = extractInvestmentThesis(report.ai_response ?? '')

    if (!thesis) return null

    return (
        <Card>
            <CardHeader className="border-b-2 border-ink/8 pb-4">
                <CardTitle className="flex items-center gap-2">
                    <span className="eyebrow inline-flex items-center rounded-full bg-blue-soft px-3 py-1.5 text-blue">
                        Summary of what our engine found:
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
                <div
                    className="analysis-prose"
                    dangerouslySetInnerHTML={{ __html: thesis ?? '' }}
                />
            </CardContent>
        </Card>
    )
}
