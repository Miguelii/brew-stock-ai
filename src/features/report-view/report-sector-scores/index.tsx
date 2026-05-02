import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { StockScores } from '@/types/ReportDTO'

type ScoreRow = {
    label: string
    companyScore: number | null
    sectorAvg: number | null
}

type Props = {
    scores: StockScores | null
}

function toRows(scores: StockScores | null): ScoreRow[] {
    return [
        {
            label: 'Innovation',
            companyScore: scores?.company?.innovativeness ?? null,
            sectorAvg: scores?.sector.innovativeness ?? null,
        },
        {
            label: 'Hiring',
            companyScore: scores?.company?.hiring ?? null,
            sectorAvg: scores?.sector?.hiring ?? null,
        },
        {
            label: 'Sustainability',
            companyScore: scores?.company?.sustainability ?? null,
            sectorAvg: scores?.sector?.sustainability ?? null,
        },
    ]
}

export function ReportSectorScores({ scores }: Props) {
    const rows = toRows(scores)

    return (
        <Card className="h-fit">
            <CardHeader className="border-b">
                <CardTitle className="text-base font-semibold">Company vs Sector Scores</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
                <p className="text-sm text-muted-foreground">
                    Comparison of AI-derived metrics against industry sector averages (Scale 0.0 -
                    1.0).
                </p>

                <div className="flex flex-col gap-5">
                    {rows.map((row) => (
                        <ScoreRowItem key={row.label} score={row} />
                    ))}
                </div>

                <ScoreLegend />
            </CardContent>
        </Card>
    )
}

function ScoreRowItem({ score }: { score: ScoreRow }) {
    const isNA = score.companyScore === null

    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-primary">{score.label}</span>
                <span className="text-sm shrink-0">
                    {isNA ? (
                        <span className="text-muted-foreground">N/A</span>
                    ) : (
                        <span className="font-semibold text-primary">
                            {score.companyScore!.toFixed(2)}
                        </span>
                    )}
                    <span className="text-muted-foreground font-normal">
                        {' '}
                        vs {score.sectorAvg !== null ? score.sectorAvg.toFixed(2) : 'N/A'}
                    </span>
                </span>
            </div>

            {/* Track */}
            <div
                className={cn(
                    'relative h-3 rounded-full overflow-hidden',
                    isNA ? 'bg-muted' : 'bg-primary/20'
                )}
            >
                {isNA ? (
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage:
                                'repeating-linear-gradient(45deg, #d1d5db 0px, #d1d5db 3px, transparent 3px, transparent 8px)',
                        }}
                    />
                ) : (
                    <div
                        className="absolute inset-y-0 left-0 rounded-full transition-all duration-500 bg-accent-blue"
                        style={{ width: `${score.companyScore! * 100}%` }}
                    />
                )}

                {/* Sector avg tick — only render when sectorAvg is known */}
                {score.sectorAvg !== null && (
                    <div
                        className="absolute inset-y-0 w-0.5 bg-primary/20 z-10"
                        style={{ left: `${score.sectorAvg * 100}%` }}
                    />
                )}
            </div>
        </div>
    )
}

function ScoreLegend() {
    return (
        <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
                <div className="size-2.5 rounded-full bg-accent-blue" />
                <span className="text-xs text-muted-foreground">Company</span>
            </div>

            <span className="text-xs text-muted-foreground">|</span>

            <div className="flex items-center gap-1.5">
                <div className="size-2.5 rounded-full bg-primary/30" />
                <span className="text-xs text-muted-foreground">Sector Avg</span>
            </div>

            <span className="text-xs text-muted-foreground">|</span>

            <div className="flex items-center gap-1.5">
                <div
                    className="size-2.5 rounded-full"
                    style={{
                        backgroundImage:
                            'repeating-linear-gradient(45deg, #d1d5db 0px, #d1d5db 3px, transparent 3px, transparent 8px)',
                    }}
                />
                <span className="text-xs text-muted-foreground">Data N/A</span>
            </div>
        </div>
    )
}
