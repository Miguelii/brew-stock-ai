import { describe, it, expect } from 'vitest'
import { SystemPrompt } from '../system.prompt'

describe('SystemPrompt', () => {
    it('instructs JSON response with analysis and sentiment', () => {
        expect(SystemPrompt).toContain('"analysis"')
        expect(SystemPrompt).toContain('"sentiment"')
    })

    it('defines sentiment scale 0-100', () => {
        expect(SystemPrompt).toContain('0 to 100')
    })

    it('instructs to reference Key Financial Indicators', () => {
        expect(SystemPrompt).toContain('Key Financial Indicators')
    })

    it('requires Investment Thesis Summary', () => {
        expect(SystemPrompt).toContain('Investment Thesis Summary')
    })

    it('instructs to use real numbers for sentiment justification', () => {
        expect(SystemPrompt).toContain('justify your sentiment score')
    })
})
