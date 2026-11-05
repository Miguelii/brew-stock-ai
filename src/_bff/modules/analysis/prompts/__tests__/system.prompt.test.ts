import { describe, it, expect } from 'vitest'
import {
    AnalystMethodPrompt,
    JsonOutputFormatPrompt,
    MarkdownOutputFormatPrompt,
    ProvidedDataPrompt,
    SystemPrompt,
} from '@/_bff/modules/analysis/prompts/system.prompt'

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

    it('forbids straight double quotes inside the analysis HTML', () => {
        expect(SystemPrompt).toContain('NEVER write straight double quotes')
    })

    it('instructs to use real numbers for sentiment justification', () => {
        expect(SystemPrompt).toContain('justify your sentiment score')
    })
})

describe('SystemPrompt composition', () => {
    it('is the method, the JSON contract and the data guide, in that order', () => {
        expect(SystemPrompt).toBe(
            `${AnalystMethodPrompt}${JsonOutputFormatPrompt}${ProvidedDataPrompt}`
        )
    })

    it('keeps the Markdown contract out of the app prompt', () => {
        expect(SystemPrompt).not.toContain(MarkdownOutputFormatPrompt.trim())
    })
})

describe('MarkdownOutputFormatPrompt', () => {
    it('requires the thesis summary and the sentiment line on the 0 to 100 scale', () => {
        expect(MarkdownOutputFormatPrompt).toContain('### Investment Thesis Summary')
        expect(MarkdownOutputFormatPrompt).toContain('**Sentiment: <score>/100 (<label>)**')
        expect(MarkdownOutputFormatPrompt).toContain('0 to 24 Extreme Bearish')
    })

    it('does not ask for JSON or HTML', () => {
        expect(MarkdownOutputFormatPrompt).toContain('no JSON, no HTML')
    })
})
