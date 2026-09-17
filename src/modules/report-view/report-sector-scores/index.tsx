import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { StockScores } from '@/types/ReportDTO'
import { ScoreGaugeCard } from '@/modules/report-view/report-sector-scores/score-gauge-card'
import { useSectorScores } from '@/modules/report-view/report-sector-scores/hooks/use-sector-scores'

type Props = {
    scores: StockScores | null
}

export function ReportSectorScores({ scores }: Props) {
    const rows = useSectorScores(scores)

    return (
        <Card className="h-fit gap-0">
            <CardHeader className="border-b-2 border-ink/8 pb-4">
                <CardTitle className="display text-2xl">How It Compares</CardTitle>
                <CardDescription className="text-xs text-ink/60">
                    How this company scores against the rest of its sector, from 0 to 100
                </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-5 pt-5">
                <ul className="grid gap-3 sm:grid-cols-3">
                    {rows.map((row) => (
                        <li key={row.label}>
                            <ScoreGaugeCard score={row} />
                        </li>
                    ))}
                </ul>

                <ScoreLegend />
            </CardContent>
        </Card>
    )
}

function ScoreLegend() {
    return (
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-ink/60">
            <span className="flex items-center gap-1.5">
                <span aria-hidden="true" className="h-1.5 w-4 rounded-full bg-blue" />
                This company
            </span>
            <span className="flex items-center gap-1.5">
                <span aria-hidden="true" className="h-3 w-0.5 rounded-full bg-ink" />
                Sector average
            </span>
            <span className="flex items-center gap-1.5">
                <span aria-hidden="true" className="w-4 border-t-2 border-dashed border-ink/25" />
                Data not available
            </span>
        </div>
    )
}
