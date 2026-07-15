export const WallStreetStyleStockAnalysisPrompt = `
    Act like a senior Wall Street equity research analyst.

    Analyze the stock: ##TICKER##.

    Include:
    1. Business model and revenue streams
    2. Competitive advantages (moat)
    3. Industry trends
    4. Financial health (revenue growth, margins, debt)
    5. Key risks
    6. Valuation vs competitors
    7. Bull, bear, and base case scenarios
    8. 12–24 month outlook

    If financial data is provided, anchor your analysis with:
    - Is the P/E justified by the growth rate? (PEG ratio = P/E ÷ earnings-growth %, treating growth as a whole number; only meaningful when growth is positive)
    - How does Debt-to-Equity compare to industry norms? (it is provided as a percentage — 150 means 1.5x)
    - Is Free Cash Flow growing in line with revenue?
    - What does the spread between current price and analyst targets suggest?

    Explain in simple terms but with professional insights.
`

export const DeepFinancialBreakdownPrompt = `
    Analyze the financials for ##TICKER## using the provided data.

    Break down:
    1. Revenue growth trajectory
    2. Profit margins (operating and net) — expanding or compressing?
    3. Free cash flow and cash conversion quality (FCF vs operating income)
    4. Debt levels and leverage safety (Debt-to-Equity context — provided as a percentage, 150 means 1.5x)
    5. Return on equity — is it driven by margins, turnover, or leverage?
    6. Valuation multiples (P/E, Forward P/E, P/B) vs growth

    Use the provided indicators to assess:
    - Cash flow quality: is FCF positive and growing?
    - Leverage safety: Debt-to-Equity in context of the sector
    - Margin trajectory: are margins expanding or compressing?
    - Return efficiency: ROE quality and sustainability

    Explain whether the company is financially strong or weakening, citing specific numbers.
`

export const MoatAnalysisPrompt = `
    Evaluate the competitive moat of ##TICKER##.

    Discuss:
    1. Brand strength
    2. Network effects
    3. Switching costs
    4. Cost advantage
    5. Patents or proprietary tech

    For each moat source, provide quantitative evidence where possible:
    - Pricing power: are margins stable or growing over time?
    - Network effects: does user/revenue growth compound?
    - Switching costs: what is customer retention / churn?

    Assess moat trajectory — is it widening or narrowing?
    Compare with top competitors and rate the moat from 1–10 with justification.
`

export const RiskAnalysisPrompt = `
    Identify the biggest risks of investing in ##TICKER##.

    Include:
    1. Economic / macro risks
    2. Industry disruption
    3. Competition
    4. Regulatory threats
    5. Financial / balance sheet risks

    Quantify risks using provided data:
    - Leverage risk: flag if Debt-to-Equity is elevated for the sector (it is provided as a percentage — 150 means 1.5x)
    - Valuation risk: flag if P/E significantly exceeds the growth rate (PEG > 2, using earnings-growth % as a whole number; only meaningful when growth is positive)
    - Cash flow risk: flag if Free Cash Flow is negative or declining
    - Beta risk: assess volatility relative to broader market

    For each risk, estimate probability (high/medium/low) and potential impact.
    Identify the single "kill scenario" — the one event that would destroy the investment thesis entirely.
    Rank risks from most to least dangerous.
`

export const GrowthPotentialAnalysisPrompt = `
    Analyze the future growth potential of ##TICKER##.

    Consider:
    1. Total addressable market size and penetration
    2. Industry growth rate vs company growth rate
    3. Expansion opportunities (geographic, product, vertical)
    4. New products or services in pipeline
    5. Technology or AI advantages

    Anchor your growth thesis with data:
    - Current revenue growth rate as baseline
    - Operating margins as indicator of scalability
    - Free cash flow available for reinvestment
    - Is the company growing faster or slower than its sector?

    Estimate potential growth over the next 3–5 years with a range (bear/base/bull).
`
