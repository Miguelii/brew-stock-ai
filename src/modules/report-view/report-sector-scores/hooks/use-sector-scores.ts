import type { StockScores } from '@/types/ReportDTO'
import { SECTOR_SCORE_ROWS } from '@/_bff/core/constants/sector-scores.constants'
import { compareWithSector, toScore100 } from '@/modules/report-view/report-sector-scores/utils'

export type SectorScore = {
    label: string
    description: string
    company: number | null
    sector: number | null
    comparison: ReturnType<typeof compareWithSector> | null
}

export const useSectorScores = (scores: StockScores | null): SectorScore[] =>
    SECTOR_SCORE_ROWS.map(({ key, label, description }) => {
        const company = toScore100(scores?.company?.[key])
        const sector = toScore100(scores?.sector?.[key])

        return {
            label,
            description,
            company,
            sector,
            comparison:
                company !== null && sector !== null ? compareWithSector(company, sector) : null,
        }
    })
