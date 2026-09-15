import type { GTMWithoutPrefix } from '@/types/GTM'
import { PropmptsEnum } from '@/types/PropmptsEnum'

// #### PATHS ####
export const SW_PATH = '/sw.js'

export const AUTH_PAGE_PATH = '/auth'

export const PROTECTED_PATHS = new Set(['/reports', '/account', '/tokens', '/config-app'])
//############

// #### INPUTS ####
export const MAX_STOCK_INPUT_LENGHT = 50

// Ticker or company name: unicode letters/digits plus the punctuation Yahoo symbols use (BRK.B, ^GSPC, "S&P", "O'Reilly").
export const STOCK_INPUT_PATTERN = /^[\p{L}\p{N} .,'&^-]+$/u

export const SB_OTP_TOKEN_LENGTH = 6

export const CONTACT_FORM_MAX_MESSAGE_LENGTH = 250

export const CONTACT_FORM_MIN_MESSAGE_LENGTH = 5

export const CONTACT_FORM_MAX_NAME_LENGTH = 100
//############

// #### GTM & GOOGLE STUFF ####
export const GTM_ID = 'G-3VFDWM9Q9V'

export const GTM_ID_WITHOUT_G: GTMWithoutPrefix<typeof GTM_ID> = GTM_ID.replace(
    'G-',
    ''
) as GTMWithoutPrefix<typeof GTM_ID>

export const CONSENT_COOKIE = 'brew_stock_cookie_consent'
//############

// #### SEO IDENTITY REUSED ####
export const SITE_AUTHOR_NAME = 'BrewStockAI'

export const SITE_AUTHOR_URL = 'https://brewstockai.com'
//############

// #### LAST UPDATE PAGES ####
export const PRIVACY_PAGE_LAST_UPDATE_AT = '2026-07-17'

export const DISCLAIMER_PAGE_LAST_UPDATE_AT = '2026-07-17'
//############

// #### ANALYSIS PROMPTS ####
// Labels and credit costs, shared by the UI and the backend (prompt bodies stay in _bff)
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
//############
