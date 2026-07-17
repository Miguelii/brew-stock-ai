import { ClientEnv } from '@/env/client'
import { EDUCATION_HUB_ARTICLES } from '@/modules/education-hub/education-hub-articles'
import { TICKER_PAGES, isTickerEnriched } from '@/modules/analysis/ticker-pages'

export const dynamic = 'force-static'

const SITE_URL = ClientEnv.NEXT_PUBLIC_WEBSITE_URL

/**
 * llms.txt — a curated site map for AI search engines and assistants.
 * Generated from the same content modules as the sitemap so it never drifts.
 * @see https://llmstxt.org
 */
export function GET() {
    const enrichedTickers = TICKER_PAGES.filter((t) => isTickerEnriched(t))

    const body = [
        '# BrewStockAI',
        '',
        '> AI-powered stock analysis for any equity. Institutional-grade financial metrics, market sentiment, and technical indicators, delivered in under two minutes for less than the price of a coffee. Educational information, not investment advice.',
        '',
        '## Key pages',
        '',
        `- [AI Stock Analysis](${SITE_URL}/analysis): Run an AI analysis for any stock ticker`,
        `- [Example Report](${SITE_URL}/example-report): A full sample of a BrewStockAI analysis report`,
        `- [Pricing](${SITE_URL}/pricing): Analysis credits and pricing`,
        `- [FAQ](${SITE_URL}/faq): How the analysis works, data sources, and limitations`,
        `- [About](${SITE_URL}/about): Who builds BrewStockAI`,
        '',
        '## Stock analysis pages',
        '',
        ...enrichedTickers.map(
            (t) =>
                `- [${t.name} (${t.ticker}) Stock Analysis](${SITE_URL}/analysis/${t.slug}): ${t.description}`
        ),
        '',
        '## Education Hub',
        '',
        ...EDUCATION_HUB_ARTICLES.map(
            (a) => `- [${a.title}](${SITE_URL}/education-hub/${a.slug}): ${a.description}`
        ),
        '',
    ].join('\n')

    return new Response(body, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
}
