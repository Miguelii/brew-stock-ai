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
}

export type TickerPage = {
    ticker: string
    name: string
    slug: string
    description: string
    sector: string
    /**
     * Long-form, unique editorial content. Only tickers that have `content`
     * are treated as indexable: they render rich sections, appear in the
     * sitemap, and are served without a `noindex` robots tag. Tickers without
     * it stay noindexed until enriched — the thin-content gate for AdSense.
     */
    content?: TickerContent
}
