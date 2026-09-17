import type { StockScores } from '@/types/ReportDTO'

export const SECTOR_SCORE_ROWS = [
    {
        key: 'innovativeness',
        label: 'Innovation',
        description: 'How actively the company is developing new products and ideas',
    },
    {
        key: 'hiring',
        label: 'Workforce Growth',
        description: 'How much the company is hiring and expanding its team',
    },
    {
        key: 'sustainability',
        label: 'Sustainability',
        description: 'How focused the company is on environmental and social responsibility',
    },
] as const satisfies readonly {
    key: keyof StockScores['company']
    label: string
    description: string
}[]

// Point gaps (on the 0 to 100 scale) that separate "in line" from "above" and "well above"
export const SECTOR_SCORE_CLEAR_GAP = 8
export const SECTOR_SCORE_WIDE_GAP = 25
