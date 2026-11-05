---
name: analysis
description: >
    Write an equity research analysis of a stock using live market data from the BrewStock MCP server.
    Use when the user asks to analyze a stock, ticker or listed company, or asks about its valuation,
    financials, competitive moat, risks or growth potential (e.g. "analyze AAPL", "is NVDA overvalued?",
    "what's the moat of ASML?", "analisa a Tesla"). Requires the `brewstock` MCP server bundled with this plugin.
---

# BrewStock analysis

The `brewstock` MCP server gathers the market data and returns a brief with the analysis method. You write the analysis yourself, following that brief. The server never generates the analysis.

## Steps

1. **Pick the analysis type** from the request:
    - General "analyze X" or no clear focus: `STOCK_ANALYSIS`
    - Financial statements, margins, cash flow: `DEEP_FINANCIAL_BREAKDOWN`
    - Competitive advantage, moat: `MOAT_ANALYSIS`
    - Risks, what could go wrong: `RISK_ANALYSIS`
    - Growth runway, TAM, long-term scenarios: `GROWTH_POTENTIAL_ANALYSIS`

    If the request fits several types and the choice matters, call the brewstock `list_analysis_types` tool and ask the user which one.

2. **Call the brewstock `get_analysis_brief` tool** with the ticker and the type. A company name works too: the server resolves it to a ticker. For several companies, call it once per company.

3. **Follow the brief exactly.** It contains the analyst method, the requested sections, data notes and the market context. In particular:
    - Use only the figures in the brief. Never invent numbers; when a metric is missing, say so.
    - If the data notes say the data is a stored snapshot or that there is no market data, tell the user at the start.
    - End with the Investment Thesis Summary and the sentiment line, in the format the brief defines.

4. **Write in the user's language.** Keep metric names and tickers as they are. Close with one short line saying this is not financial advice.

## When the server is unavailable

If the brewstock tools are missing or return an authorization error, tell the user the BrewStock MCP server is not connected. The token is set in the plugin options:

```
/plugin configure brewstock@brewstockai
```

Then reconnect the server from `/mcp` or start a new session.

Do not fall back to an analysis from memory unless the user asks for one, and label it as not backed by live data if they do.
