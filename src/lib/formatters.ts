// Frontend-only formatters. Formatters shared with _bff live in src/_bff/core/utils/formatters.utils.ts

/**
 * Format a minor-unit amount (e.g. cents) as a localised currency string.
 *
 * @param amount - The amount in the currency's minor unit (divided by 100 internally).
 * @param currency - The ISO 4217 currency code (case-insensitive).
 * @returns The localised currency string (e.g. `"$12.34"`).
 */
export function formatAmount(amount: number, currency: string) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency.toUpperCase(),
    }).format(amount / 100)
}

/**
 * Normalise an ISO report timestamp into a compact `YYYY-MM-DD HH:mm` display string.
 *
 * @param date - The ISO timestamp string.
 * @returns The date and time with the `T` separator replaced by a space.
 */
export const parseReportDate = (date: string) => {
    return date.slice(0, 16).replace('T', ' ')
}

/**
 * Latest ISO day in a list
 *
 * @param days - An array of ISO date strings.
 * @returns The latest ISO day as a Date object.
 */
export const latestIsoDay = (days: string[]): Date =>
    new Date(Math.max(...days.map((day) => new Date(day).getTime())))
