import { extractInvestmentThesis } from '@/_bff/core/helpers/report-html.helper'

const CLOSING_BLOCK_TAG = /<\/(p|ul|ol)>$/iu

/**
 * An analysis is complete when the model stopped on its own, the closing
 * "Investment Thesis Summary" section has content, and the HTML ends on a closed block.
 * Catches text cut mid-sentence even when the JSON itself was valid.
 */
export function isAnalysisComplete(analysis: string, finishReason: string): boolean {
    if (finishReason !== 'stop') return false

    const thesis = extractInvestmentThesis(analysis)

    if (!thesis) return false

    return CLOSING_BLOCK_TAG.test(analysis.trim())
}
