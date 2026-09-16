/**
 * Return the HTML that follows the final "Investment Thesis Summary" <h3> of an
 * analysis, or null when the section is missing.
 */
export function extractInvestmentThesis(html: string): string | null {
    const match = /<h3[^>]*>[\s\S]*?Investment Thesis Summary[\s\S]*?<\/h3>([\s\S]*)$/iu.exec(html)
    if (!match) return null
    return match[1].trim()
}
