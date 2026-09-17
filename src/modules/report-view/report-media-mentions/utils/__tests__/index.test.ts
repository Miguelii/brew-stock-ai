import { describe, it, expect } from 'vitest'
import { truncateText } from '@/modules/report-view/report-media-mentions/utils'

describe('truncateText', () => {
    it('keeps text that fits', () => {
        expect(truncateText('Apple beats estimates', 21)).toBe('Apple beats estimates')
    })

    it('cuts longer text and appends an ellipsis', () => {
        expect(truncateText('Apple beats estimates', 5)).toBe('Apple…')
    })

    it('returns an empty string unchanged', () => {
        expect(truncateText('', 10)).toBe('')
    })
})
