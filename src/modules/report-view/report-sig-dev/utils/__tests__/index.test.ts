import { describe, it, expect } from 'vitest'
import {
    formatEventAge,
    getCalendarParts,
    getDayDiff,
} from '@/modules/report-view/report-sig-dev/utils'

describe('getDayDiff', () => {
    it('counts calendar days and ignores the time of day', () => {
        expect(getDayDiff('2026-09-05T23:59:00Z', '2026-09-08T00:01:00Z')).toBe(3)
        expect(getDayDiff('2024-02-01T00:00:00Z', '2024-02-01T10:00:00Z')).toBe(0)
    })

    it('is negative when the second date is earlier', () => {
        expect(getDayDiff('2026-09-08T00:00:00Z', '2026-09-05T00:00:00Z')).toBe(-3)
    })
})

describe('formatEventAge', () => {
    it('names today and yesterday', () => {
        expect(formatEventAge(0)).toBe('Today')
        expect(formatEventAge(1)).toBe('Yesterday')
    })

    it('counts days under a month', () => {
        expect(formatEventAge(29)).toBe('29 days ago')
    })

    it('counts months under a year', () => {
        expect(formatEventAge(30)).toBe('1 month ago')
        expect(formatEventAge(364)).toBe('12 months ago')
    })

    it('counts years after that', () => {
        expect(formatEventAge(365)).toBe('1 year ago')
        expect(formatEventAge(800)).toBe('2 years ago')
    })
})

describe('getCalendarParts', () => {
    it('reads the date in UTC', () => {
        expect(getCalendarParts('2024-02-01T00:00:00Z')).toEqual({
            month: 'Feb',
            day: '01',
            year: '2024',
        })
        expect(getCalendarParts('2026-09-05T23:30:00Z')).toEqual({
            month: 'Sep',
            day: '05',
            year: '2026',
        })
    })
})
