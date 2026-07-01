// oxlint-disable import/max-dependencies
import type { ArticleTheme, EducationHubArticle } from '@/types/EducationHubArticle'
import { HOW_TO_READ_A_STOCK_ANALYSIS_REPORT_ARTICLE } from '@/modules/education-hub/education-hub-articles/how-to-read-a-stock-analysis-report'
import { WHAT_IS_PE_RATIO_ARTICLE } from '@/modules/education-hub/education-hub-articles/what-is-pe-ratio'
import { UNDERSTANDING_COMPETITIVE_MOATS_ARTICLE } from '@/modules/education-hub/education-hub-articles/understanding-competitive-moats'
import { HOW_TO_ASSESS_STOCK_RISK_ARTICLE } from '@/modules/education-hub/education-hub-articles/how-to-assess-stock-risk'
import { WHAT_IS_EARNINGS_PER_SHARE_ARTICLE } from '@/modules/education-hub/education-hub-articles/what-is-earnings-per-share'
import { GROWTH_VS_VALUE_INVESTING_ARTICLE } from '@/modules/education-hub/education-hub-articles/growth-vs-value-investing'
import { HOW_TO_ANALYZE_CASH_FLOW_ARTICLE } from '@/modules/education-hub/education-hub-articles/how-to-analyze-cash-flow'
import { WHAT_IS_MARKET_CAP_ARTICLE } from '@/modules/education-hub/education-hub-articles/what-is-market-cap'
import { COMPOUNDING_START_EARLY_ARTICLE } from '@/modules/education-hub/education-hub-articles/compounding-start-early'
import { ETFS_VS_INDEX_FUNDS_VS_MUTUAL_FUNDS_ARTICLE } from '@/modules/education-hub/education-hub-articles/etfs-vs-index-funds-vs-mutual-funds'
import { THE_4_PERCENT_RULE_FIRE_ARTICLE } from '@/modules/education-hub/education-hub-articles/the-4-percent-rule-fire'
import { DIVIDEND_YIELD_TRAPS_ARTICLE } from '@/modules/education-hub/education-hub-articles/dividend-yield-traps'
import { LUMP_SUM_VS_DOLLAR_COST_AVERAGING_ARTICLE } from '@/modules/education-hub/education-hub-articles/lump-sum-vs-dollar-cost-averaging'
import { ROE_VS_ROIC_ARTICLE } from '@/modules/education-hub/education-hub-articles/roe-vs-roic'
import { HOW_TO_READ_A_BALANCE_SHEET_ARTICLE } from '@/modules/education-hub/education-hub-articles/how-to-read-a-balance-sheet'
import { WHAT_IS_EBITDA_ARTICLE } from '@/modules/education-hub/education-hub-articles/what-is-ebitda'
import { STOCK_BUYBACKS_EXPLAINED_ARTICLE } from '@/modules/education-hub/education-hub-articles/stock-buybacks-explained'
import { DCF_VALUATION_BASICS_ARTICLE } from '@/modules/education-hub/education-hub-articles/dcf-valuation-basics'
import { MOVING_AVERAGES_AND_RSI_ARTICLE } from '@/modules/education-hub/education-hub-articles/moving-averages-and-rsi'
import { HOW_INTEREST_RATES_MOVE_STOCKS_ARTICLE } from '@/modules/education-hub/education-hub-articles/how-interest-rates-move-stocks'
import { HOW_MANY_STOCKS_DIVERSIFICATION_ARTICLE } from '@/modules/education-hub/education-hub-articles/how-many-stocks-diversification'
import { BEHAVIORAL_BIASES_INVESTING_ARTICLE } from '@/modules/education-hub/education-hub-articles/behavioral-biases-investing'
import { SHOULD_YOU_BUY_IPOS_ARTICLE } from '@/modules/education-hub/education-hub-articles/should-you-buy-ipos'
import { EMERGENCY_FUND_BEFORE_INVESTING_ARTICLE } from '@/modules/education-hub/education-hub-articles/emergency-fund-before-investing'
import { INFLATION_AND_YOUR_SAVINGS_ARTICLE } from '@/modules/education-hub/education-hub-articles/inflation-and-your-savings'
import { SAVING_RATE_VS_RETURNS_ARTICLE } from '@/modules/education-hub/education-hub-articles/saving-rate-vs-returns'
import { HOW_DIVIDENDS_ACTUALLY_WORK_ARTICLE } from '@/modules/education-hub/education-hub-articles/how-dividends-actually-work'
import { DIVIDEND_GROWTH_INVESTING_ARTICLE } from '@/modules/education-hub/education-hub-articles/dividend-growth-investing'

// Ordered chronologically by publishedAt (ascending)
export const EDUCATION_HUB_ARTICLES: EducationHubArticle[] = [
    HOW_TO_READ_A_STOCK_ANALYSIS_REPORT_ARTICLE,
    WHAT_IS_PE_RATIO_ARTICLE,
    UNDERSTANDING_COMPETITIVE_MOATS_ARTICLE,
    HOW_TO_ASSESS_STOCK_RISK_ARTICLE,
    WHAT_IS_EARNINGS_PER_SHARE_ARTICLE,
    GROWTH_VS_VALUE_INVESTING_ARTICLE,
    HOW_TO_ANALYZE_CASH_FLOW_ARTICLE,
    WHAT_IS_MARKET_CAP_ARTICLE,
    COMPOUNDING_START_EARLY_ARTICLE,
    ETFS_VS_INDEX_FUNDS_VS_MUTUAL_FUNDS_ARTICLE,
    THE_4_PERCENT_RULE_FIRE_ARTICLE,
    DIVIDEND_YIELD_TRAPS_ARTICLE,
    LUMP_SUM_VS_DOLLAR_COST_AVERAGING_ARTICLE,
    ROE_VS_ROIC_ARTICLE,
    HOW_TO_READ_A_BALANCE_SHEET_ARTICLE,
    WHAT_IS_EBITDA_ARTICLE,
    STOCK_BUYBACKS_EXPLAINED_ARTICLE,
    DCF_VALUATION_BASICS_ARTICLE,
    MOVING_AVERAGES_AND_RSI_ARTICLE,
    HOW_INTEREST_RATES_MOVE_STOCKS_ARTICLE,
    HOW_MANY_STOCKS_DIVERSIFICATION_ARTICLE,
    BEHAVIORAL_BIASES_INVESTING_ARTICLE,
    SHOULD_YOU_BUY_IPOS_ARTICLE,
    EMERGENCY_FUND_BEFORE_INVESTING_ARTICLE,
    INFLATION_AND_YOUR_SAVINGS_ARTICLE,
    SAVING_RATE_VS_RETURNS_ARTICLE,
    HOW_DIVIDENDS_ACTUALLY_WORK_ARTICLE,
    DIVIDEND_GROWTH_INVESTING_ARTICLE,
]

export const EDUCATION_HUB_ARTICLE_MAP = new Map(EDUCATION_HUB_ARTICLES.map((a) => [a.slug, a]))

export const EDUCATION_HUB_THEMES: { value: ArticleTheme; label: string }[] = [
    { value: 'stock-analysis', label: 'Stock Analysis' },
    { value: 'investing-strategy', label: 'Investing Strategy' },
    { value: 'personal-finance', label: 'Personal Finance' },
    { value: 'dividends-income', label: 'Dividends & Income' },
]

export const EDUCATION_HUB_THEME_LABELS: Record<ArticleTheme, string> = Object.fromEntries(
    EDUCATION_HUB_THEMES.map((t) => [t.value, t.label])
) as Record<ArticleTheme, string>
