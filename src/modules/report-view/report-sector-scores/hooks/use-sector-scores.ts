import type { StockScores } from '@/types/ReportDTO'
import type { SectorScore } from '@/types/SectorScore'
import { getSectorScores } from '@/_bff/core/helpers/sector-scores.helper'

export const useSectorScores = (scores: StockScores | null): SectorScore[] =>
    getSectorScores(scores)
