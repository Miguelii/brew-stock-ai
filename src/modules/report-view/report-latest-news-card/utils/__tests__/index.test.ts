import { describe, it, expect } from 'vitest'
import { formatNewsAge, toIsoDateTime } from '@/modules/report-view/report-latest-news-card/utils'

const NOW_MS = Date.UTC(2026, 8, 17, 12, 0, 0)
const toSeconds = (ms: number) => ms / 1000

describe('formatNewsAge', () => {
    it('shows minutes under an hour, never less than one', () => {
        expect(formatNewsAge(toSeconds(NOW_MS - 5 * 60 * 1000), NOW_MS)).toBe('5m ago')
        expect(formatNewsAge(toSeconds(NOW_MS - 10 * 1000), NOW_MS)).toBe('1m ago')
    })

    it('treats timestamps in the future as just published', () => {
        expect(formatNewsAge(toSeconds(NOW_MS + 60 * 60 * 1000), NOW_MS)).toBe('1m ago')
    })

    it('shows hours under a day', () => {
        expect(formatNewsAge(toSeconds(NOW_MS - 9 * 60 * 60 * 1000), NOW_MS)).toBe('9h ago')
    })

    it('shows days under a week', () => {
        expect(formatNewsAge(toSeconds(NOW_MS - 2 * 24 * 60 * 60 * 1000), NOW_MS)).toBe('2d ago')
    })

    it('falls back to the calendar date after a week', () => {
        expect(formatNewsAge(toSeconds(Date.UTC(2026, 8, 1, 12)), NOW_MS)).toBe('Sep 1, 2026')
    })
})

describe('toIsoDateTime', () => {
    it('converts a Unix timestamp to an ISO string', () => {
        expect(toIsoDateTime(toSeconds(NOW_MS))).toBe('2026-09-17T12:00:00.000Z')
    })
})
