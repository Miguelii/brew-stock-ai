import type { GTMWithoutPrefix } from '@/types/GTM'
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
}

export const PROMPT_OPTIONS = Object.values(PROMPT_TYPES)

export const NEXT_IMAGE_PATH = '/_next/image'

export const SW_PATH = '/sw.js'

export const CHROMIUM_PACK_PATH = '/chromium-v148.0.0-pack.x64.tar'

export const STATIC_PREFIXES = [
    '/_next',
    '/api/',
    '/assets',
    '/favicon',
    '/robots.txt',
    '/script',
    SW_PATH,
    '/apple-touch-icon',
    '/web-app-manifest-192x192',
    '/web-app-manifest-512x512',
    CHROMIUM_PACK_PATH,
]

export const AUTH_PAGE_PATH = '/auth'

export const PROTECTED_PATHS = new Set(['/reports', '/account', '/tokens'])

export const AUTH_PAGES_PATHS = new Set([AUTH_PAGE_PATH, '/sign-in'])

export const HOME_PAGE_PATH = '/'

export const SIGN_IN_GOOGLE_API_PATH = '/api/auth/google'

export const MAX_STOCK_INPUT_LENGHT = 50

export const PUSH_DISMISSED_KEY = 'push_prompt_dismissed'

export const PUSH_DISMISS_TTL_DAYS = 7

export const GTM_ID = 'G-3VFDWM9Q9V'

export const GTM_ID_WITHOUT_G: GTMWithoutPrefix<typeof GTM_ID> = GTM_ID.replace(
    'G-',
    ''
) as GTMWithoutPrefix<typeof GTM_ID>

export const CONSENT_COOKIE = 'brew_stock_cookie_consent'
