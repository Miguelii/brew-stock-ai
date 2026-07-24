export type TickerContent = {
    /** ISO day (`YYYY-MM-DD`) the entry was last materially edited — feeds the sitemap `lastmod`. */
    updatedAt: string
    /** 2-3 sentences on how the company makes money. */
    businessModel: string
    /** 3-6 core products, segments, or revenue lines. */
    keyProducts: string[]
    /** 1-2 paragraphs of bull/bear context that drives the stock (paragraphs split on a blank line). */
    investmentNarrative: string
    /** 3-5 company-specific risks investors should weigh. */
    keyRisks: string[]
    /** 1 paragraph on catalysts and metrics worth monitoring. */
    whatToWatch: string
    /** Named peers and competitors. */
    competitors: string[]
    /** Education-hub article slugs to cross-link for further reading. */
    relatedArticleSlugs?: string[]
    /**
     * Company-specific FAQ entries. These carry the page's unique FAQ value:
     * the shared, templated questions are deliberately kept to a minimum so the
     * page does not read as scaled boilerplate.
     */
    faq?: {
        question: string
        answer: string
    }[]
}

export type TickerPage = {
    ticker: string
    name: string
    slug: string
    description: string
    sector: string
    /**
     * Long-form, unique editorial content. Required, deliberately: a company
     * without a write-up should not have a page at all. Serving hundreds of
     * near-identical templated pages is what reads as thin content to a
     * publisher-policy review, and `noindex` does not exempt them from it, so
     * the quality gate lives here in the type rather than in a runtime check.
     */
    content: TickerContent
}
