import { PropmptsEnum } from '@/types/PropmptsEnum'

export const PROMPT_TYPES = {
    [PropmptsEnum.STOCK_ANALYSIS]: {
        type: PropmptsEnum.STOCK_ANALYSIS,
        label: 'Full Wall Street Style Stock Analysis',
        cost: 2,
    },
    [PropmptsEnum.DEEP_FINANCIAL_BREAKDOWN]: {
        type: PropmptsEnum.DEEP_FINANCIAL_BREAKDOWN,
        label: 'Deep Financial Breakdown',
        cost: 2,
    },
    [PropmptsEnum.MOAT_ANALYSIS]: {
        type: PropmptsEnum.MOAT_ANALYSIS,
        label: 'Competitive Advantage (Moat) Analysis',
        cost: 1,
    },
    [PropmptsEnum.RISK_ANALYSIS]: {
        type: PropmptsEnum.RISK_ANALYSIS,
        label: 'Risk Analysis',
        cost: 1,
    },
    [PropmptsEnum.GROWTH_POTENTIAL_ANALYSIS]: {
        type: PropmptsEnum.GROWTH_POTENTIAL_ANALYSIS,
        label: 'Growth Potential Analysis',
        cost: 1,
    },
} as const

export const PROMPT_OPTIONS = Object.values(PROMPT_TYPES)
