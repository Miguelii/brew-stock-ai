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
    '/android-chrome-192x192.png',
    '/android-chrome-512x512.png',
    CHROMIUM_PACK_PATH,
    '/ads.txt',
    '/google65ae1c769c12f01e.html',
]

export const AUTH_PAGE_PATH = '/auth'

export const PROTECTED_PATHS = new Set(['/reports', '/account', '/tokens', '/secure-admin'])

export const AUTH_PAGES_PATHS = new Set([AUTH_PAGE_PATH])

export const HOME_PAGE_PATH = '/'

export const MAX_STOCK_INPUT_LENGHT = 50

// Ticker or company name: unicode letters/digits plus the punctuation Yahoo symbols use (BRK.B, ^GSPC, "S&P", "O'Reilly").
export const STOCK_INPUT_PATTERN = /^[\p{L}\p{N} .,'&^-]+$/u

export const GTM_ID = 'G-3VFDWM9Q9V'

export const GTM_ID_WITHOUT_G: GTMWithoutPrefix<typeof GTM_ID> = GTM_ID.replace(
    'G-',
    ''
) as GTMWithoutPrefix<typeof GTM_ID>

export const CONSENT_COOKIE = 'brew_stock_cookie_consent'

export const GOOGLE_ADSENSE_ACCOUNT_ID = 'ca-pub-1939312153475109' as const

// Flip to true only after AdSense approval and after replacing the placeholder slot IDs below
export const ADS_ENABLED = false

export const AD_SLOT_TICKER = 'REPLACE_WITH_SLOT_ID'

export const AD_SLOT_ARTICLE_BOTTOM = 'REPLACE_WITH_SLOT_ID'

export const AD_SLOT_IN_ARTICLE = 'REPLACE_WITH_SLOT_ID'

export const SB_OTP_TOKEN_LENGTH = 6

export const CONTACT_FORM_MAX_MESSAGE_LENGTH = 250

export const CONTACT_FORM_MIN_MESSAGE_LENGTH = 5

export const CONTACT_FORM_MAX_NAME_LENGTH = 100

/** Site author identity reused across bylines, metadata, and structured data. */
export const SITE_AUTHOR_NAME = 'Miguel Gonçalves'

export const SITE_AUTHOR_URL = 'https://www.linkedin.com/in/miguelgoncalves18/'
