import type { GTMWithoutPrefix } from '@/types/GTM'

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

export const GOOGLE_ADSENSE_ACCOUNT_ID = 'ca-pub-1939312153475109' as const

// Flip to true only after AdSense approval and after replacing the placeholder slot IDs below
export const ADS_ENABLED = false

export const AD_SLOT_TICKER = 'REPLACE_WITH_SLOT_ID'

export const AD_SLOT_ARTICLE_BOTTOM = 'REPLACE_WITH_SLOT_ID'

export const AD_SLOT_IN_ARTICLE = 'REPLACE_WITH_SLOT_ID'
//############

// #### SEO IDENTITY REUSED ####
export const SITE_AUTHOR_NAME = 'Miguel Gonçalves'

export const SITE_AUTHOR_URL = 'https://www.linkedin.com/in/miguelgoncalves18/'
//############

// #### LAST UPDATE PAGES ####
export const PRIVACY_PAGE_LAST_UPDATE_AT = '2026-07-17'

export const DISCLAIMER_PAGE_LAST_UPDATE_AT = '2026-07-17'
//############
