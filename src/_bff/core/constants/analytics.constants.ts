import type { GTMWithoutPrefix } from '@/types/GTM'

export const GTM_ID = 'G-3VFDWM9Q9V'

export const GTM_ID_WITHOUT_G: GTMWithoutPrefix<typeof GTM_ID> = GTM_ID.replace(
    'G-',
    ''
) as GTMWithoutPrefix<typeof GTM_ID>

export const CONSENT_COOKIE = 'brew_stock_cookie_consent'
