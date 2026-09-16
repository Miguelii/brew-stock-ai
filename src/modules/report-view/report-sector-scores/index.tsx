import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { fmtNum } from '@/_bff/core/utils/formatters.utils'
import { SECTOR_SCORE_ROWS } from '@/_bff/core/constants/sector-scores.constants'
import type { StockScores } from '@/types/ReportDTO'

type ScoreRow = {
    label: string
    description: string
    companyScore: number | null
    sectorAvg: number | null
}

type Props = {
    scores: StockScores | null
}

function toRows(scores: StockScores | null): ScoreRow[] {
    return SECTOR_SCORE_ROWS.map(({ key, label, description }) => ({
        label,
        description,
        companyScore: scores?.company?.[key] ?? null,
        sectorAvg: scores?.sector?.[key] ?? null,
    }))
}

export function ReportSectorScores({ scores }: Props) {
    const rows = toRows(scores)

    return (
        <Card className="h-fit">
            <CardHeader className="border-b-2 border-ink/8 pb-4">
                <CardTitle className="display text-2xl">How It Compares</CardTitle>
                <p className="text-xs text-ink/60">
                    How this company stacks up against others in the same sector (scale 0 to 1,
                    higher is better)
                </p>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
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
            <div className="flex flex-col gap-0.5">
                <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-ink">{score.label}</span>
                    <span className="text-sm shrink-0">
                        {isNA ? (
                            <span className="text-ink/60">N/A</span>
                        ) : (
                            <span className="font-semibold text-ink">
                                {fmtNum(score.companyScore)}
                            </span>
                        )}
                        <span className="text-ink/60 font-normal">
                            {' '}
                            vs {fmtNum(score.sectorAvg)}
                        </span>
                    </span>
                </div>
                <span className="text-xs text-ink/60">{score.description}</span>
            </div>

            {/* Track */}
            <div
                className={cn(
                    'relative h-3 rounded-full overflow-hidden',
                    isNA ? 'bg-ink/8' : 'bg-ink/15'
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
                        className="absolute inset-y-0 left-0 rounded-full transition-all duration-500 bg-blue"
                        style={{ width: `${score.companyScore! * 100}%` }}
                    />
                )}

                {/* Sector avg tick — only render when sectorAvg is known */}
                {score.sectorAvg !== null && (
                    <div
                        className="absolute inset-y-0 w-0.5 bg-ink/15 z-10"
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
                <div className="size-2.5 rounded-full bg-blue" />
                <span className="text-xs text-ink/60">This company</span>
            </div>

            <span className="text-xs text-ink/60">|</span>

            <div className="flex items-center gap-1.5">
                <div className="size-2.5 rounded-full bg-ink/25" />
                <span className="text-xs text-ink/60">Sector average</span>
            </div>

            <span className="text-xs text-ink/60">|</span>

            <div className="flex items-center gap-1.5">
                <div
                    className="size-2.5 rounded-full"
                    style={{
                        backgroundImage:
                            'repeating-linear-gradient(45deg, #d1d5db 0px, #d1d5db 3px, transparent 3px, transparent 8px)',
                    }}
                />
                <span className="text-xs text-ink/60">Data not available</span>
            </div>
        </div>
    )
}
