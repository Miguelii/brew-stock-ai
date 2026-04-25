import { PropmptsEnum } from '../types/PropmptsEnum'

export const PROMPT_TYPES = {
    [PropmptsEnum.STOCK_ANALYSIS]: {
        type: PropmptsEnum.STOCK_ANALYSIS,
        label: 'Full Wall Street Style Stock Analysis',
    },
    [PropmptsEnum.DEEP_FINANCIAL_BREAKDOWN]: {
        type: PropmptsEnum.DEEP_FINANCIAL_BREAKDOWN,
        label: 'Deep Financial Breakdown',
    },
    [PropmptsEnum.MOAT_ANALYSIS]: {
        type: PropmptsEnum.MOAT_ANALYSIS,
        label: 'Competitive Advantage (Moat) Analysis',
    },
    [PropmptsEnum.RISK_ANALYSIS]: {
        type: PropmptsEnum.RISK_ANALYSIS,
        label: 'Risk Analysis',
    },
    [PropmptsEnum.GROWTH_POTENTIAL_ANALYSIS]: {
        type: PropmptsEnum.GROWTH_POTENTIAL_ANALYSIS,
        label: 'Growth Potential Analysis',
    },
}

export const PROMPT_OPTIONS = Object.values(PROMPT_TYPES)

export const NEXT_IMAGE_PATH = '/_next/image'

export const STATIC_PREFIXES = ['/_next', '/api/', '/assets', '/favicon', '/robots.txt', '/script']

export const PROTECTED_PATHS = new Set(['/reports', '/account'])

export const HOME_PAGE_PATH = '/'

export const AUTH_PAGE_PATH = '/auth'

export const MAX_STOCK_INPUT_LENGHT = 50
