# Analysis Context — What the AI Sees

This document is the single source of truth for **everything fed to the model** when generating a
stock analysis: every data block, where it comes from, the exact fields, and how the final prompt
is assembled. Blocks are tagged **[EXISTING]** (present before the context-enrichment work) or
**[NEW]** (added during it) so the delta is explicit.

The architecture is deliberately simple: **one** model call per report, with **structured output**
(no multi-agent orchestration). Quality comes from the breadth and quality of the injected context,
not from chaining calls.

---

## Table of Contents

1. [Pipeline](#pipeline)
2. [The assembled prompt](#the-assembled-prompt)
3. [Context blocks — master table](#context-blocks--master-table)
4. [Block details](#block-details)
    - [Key Financial Indicators — EXISTING](#key-financial-indicators--existing)
    - [Fundamentals — NEW](#fundamentals--new)
    - [Technical Snapshot — NEW](#technical-snapshot--new)
    - [Recent Significant Development — EXISTING](#recent-significant-development--existing)
    - [Analyst Coverage — EXISTING](#analyst-coverage--existing)
    - [Company vs Sector Scores — EXISTING](#company-vs-sector-scores--existing)
    - [Recent News — NEW](#recent-news--new)
5. [Model & output](#model--output)
6. [Caching & resilience](#caching--resilience)
7. [File map](#file-map)

---

## Pipeline

The backend is organised NestJS-style under `src/_backend/modules/<module>/`
(controllers → services → processors/repositories/helpers). The analysis entry point is the
`getStockAnalysis` **processor** in
`src/_backend/modules/analysis/processors/get-stock-analysis.processor.ts`. It runs in the
**Trigger.dev** background runtime (`src/_backend/modules/reports/jobs/process-report.job.ts` →
`src/_backend/modules/reports/processors/process-report.processor.ts`), with an admin Supabase client
and **no user session**.

```
getStockAnalysis(stockSymbol, promptType, reportId, supabaseClient?, useBaseModel?)
  │
  ├─ basePrompt        = PROMPTS_MAP[promptType]            // per-type prompt
  │
  ├─ yahooPreFetch     = getYahooTtlData(stockSymbol)       // ticker + financials + fundamentals
  │                                                          //   + sigDev + reports + scores (TTL-cached)
  ├─ tickerForData     = yahooPreFetch?.ticker ?? stockSymbol
  │
  ├─ Effect.all (parallel, both NON-FATAL → null on failure)
  │    ├─ priceHistory = getPriceHistory(tickerForData)        // RAW 1y daily closes (yahoo/processors)
  │    └─ news         = getLatestNewsService(tickerForData)   // RAW Finnhub company-news (finnhub/services)
  │
  ├─ technicals        = priceHistory?.length ? computeTechnicalIndicators(priceHistory) : null
  │
  ├─ context           = "\n\n" + buildYahooContext(yahooData, technicals, news)   // see below
  ├─ resolvedPrompt    = basePrompt.replaceAll("##TICKER##", stockSymbol) + context
  │
  └─ generateText({ model, thinking?, output: stockAnalysisSchema, system: SystemPrompt,
                    prompt: resolvedPrompt, maxOutputTokens })
       → { analysis (HTML), sentiment (0–100) }
```

Key properties:

- **Price history and news are non-fatal.** A failure in either resolves to `null` and the analysis
  proceeds without that block. Yahoo data itself (`getYahooTtlData`) also resolves to `null` on
  failure — the analysis still runs on whatever context survives.
- **Raw (uncached, session-less) fetchers** are used here — `getPriceHistory`
  (`yahoo/processors/get-price-history.processor.ts`) and `getLatestNewsService`
  (`finnhub/services/get-latest-news.service.ts`). The user-facing tRPC endpoints use separate
  cached + session-gated wrappers — `getPriceHistory` (`yahoo/services/get-price-history.service.ts`,
  exposed by `yahoo/controllers/get-price-history.controller.ts`) and `getLatestNews`
  (`finnhub/services/get-latest-news-cached.service.ts`, exposed by
  `finnhub/controllers/get-latest-news.controller.ts`); see `spec/e2e.md` and the source for the
  split rationale.
- **Same `ticker`** (resolved once by `getYahooTtlData`) is reused for news and price history so all
  blocks refer to the same symbol.

---

## The assembled prompt

The model receives three things:

### 1. System prompt — `SystemPrompt` (`src/_backend/modules/analysis/prompts/system.prompt.ts`)

Defines the persona (senior equity research analyst), the writing rules (interpret don't describe,
anchor every claim in numbers, never fabricate, stay balanced), the **required JSON output shape**,
and — critically — the **hierarchy of signals**:

> Business quality, durable cash generation, and valuation drive the thesis. Earnings/estimates and
> analyst ratings are primary fundamentals; **technicals are a secondary timing signal**; **news and
> soft scores are confirmatory only** — never the core of the case.

### 2. Per-type prompt — one of five (`PROMPTS_MAP`)

Selected by `promptType`. The five prompt strings live in
`src/_backend/modules/analysis/prompts/analysis.prompt.ts`; `PROMPTS_MAP` (which keys them by type)
lives in `src/_backend/modules/analysis/constants/index.ts`. Each contains `##TICKER##`, replaced with
the symbol at runtime.

| Prompt constant                      | Focus                                                                                 |
| ------------------------------------ | ------------------------------------------------------------------------------------- |
| `WallStreetStyleStockAnalysisPrompt` | Full report (business, moat, financials, risks, valuation, scenarios, 12–24m outlook) |
| `DeepFinancialBreakdownPrompt`       | Financial statements deep-dive                                                        |
| `MoatAnalysisPrompt`                 | Competitive moat                                                                      |
| `RiskAnalysisPrompt`                 | Risk ranking + "kill scenario"                                                        |
| `GrowthPotentialAnalysisPrompt`      | TAM, growth runway, 3–5y scenarios                                                    |

### 3. Injected context — the `## Current Market Context` block

Built by `buildYahooContext(data, technicals?, news?)`
(`src/_backend/modules/yahoo/helpers/build-yahoo-context.helper.ts`) and appended to the per-type
prompt. The processor only assembles this block when at least one source survived (`hasContext`);
otherwise the prompt is sent with no context appended. Each section renders **only when its data is
present**, in this exact order:

```
## Current Market Context
Live data from Yahoo Finance — incorporate these insights into your analysis where relevant.

**Key Financial Indicators:**            [EXISTING]   (data.financials)
**Earnings History ...**                 [NEW]        (data.fundamentals.earningsHistory)
**Forward Estimates ...**                [NEW]        (data.fundamentals.forwardEstimates)
**Revenue & Net Income Trend ...**       [NEW]        (data.fundamentals.revenueTrend)
**Analyst Rating Distribution ...**      [NEW]        (data.fundamentals.analystRatings)
**Insider Activity ...**                 [NEW]        (data.fundamentals.insiders)
**Technical Snapshot ...**               [NEW]        (technicals)
**Recent Significant Development:**      [EXISTING]   (data.sigDev)
**Analyst Coverage:**                    [EXISTING]   (data.reports)
**Company vs Sector Scores ...**         [EXISTING]   (data.scores)
**Recent News ...**                      [NEW]        (news)
```

---

## Context blocks — master table

All file paths below are relative to `src/_backend/modules/`.

| Block                          | Status   | Source                         | Service / file                                                                                                  | Cache (TTL)           |
| ------------------------------ | -------- | ------------------------------ | --------------------------------------------------------------------------------------------------------------- | --------------------- |
| Key Financial Indicators       | EXISTING | Yahoo `quoteSummary`           | `yahoo/processors/get-yahoo-data.processor.ts` (`financialData`, `summaryDetail`, `defaultKeyStatistics`)       | `stock_data` (3 days) |
| Earnings History               | NEW      | Yahoo `quoteSummary`           | `yahoo/processors/get-yahoo-data.processor.ts` + `yahoo/helpers/map-fundamentals.helper.ts` (`earningsHistory`) | `stock_data` (3 days) |
| Forward Estimates              | NEW      | Yahoo `quoteSummary`           | `yahoo/helpers/map-fundamentals.helper.ts` (`earningsTrend`)                                                    | `stock_data` (3 days) |
| Revenue & Net Income Trend     | NEW      | Yahoo `fundamentalsTimeSeries` | `yahoo/helpers/map-fundamentals.helper.ts` (`financials`, annual)                                               | `stock_data` (3 days) |
| Analyst Rating Distribution    | NEW      | Yahoo `quoteSummary`           | `yahoo/helpers/map-fundamentals.helper.ts` (`recommendationTrend`)                                              | `stock_data` (3 days) |
| Insider Activity               | NEW      | Yahoo `quoteSummary`           | `yahoo/helpers/map-fundamentals.helper.ts` (`insiderTransactions`)                                              | `stock_data` (3 days) |
| Technical Snapshot             | NEW      | Yahoo `chart` (1y daily)       | `yahoo/processors/get-price-history.processor.ts` → `yahoo/helpers/compute-technical-indicators.helper.ts`      | price-history (12 h)  |
| Recent Significant Development | EXISTING | Yahoo `insights`               | `yahoo/processors/get-yahoo-data.processor.ts` (`sigDevs[0]`)                                                   | `stock_data` (3 days) |
| Analyst Coverage               | EXISTING | Yahoo `insights`               | `yahoo/processors/get-yahoo-data.processor.ts` (`reports`, 3)                                                   | `stock_data` (3 days) |
| Company vs Sector Scores       | EXISTING | Yahoo `insights`               | `yahoo/processors/get-yahoo-data.processor.ts` (`companySnapshot`)                                              | `stock_data` (3 days) |
| Recent News                    | NEW      | Finnhub `company-news`         | `finnhub/services/get-latest-news.service.ts` (top 3)                                                           | latest-news (1 day)   |

All field shapes live in `src/types/ReportDTO.ts`.

---

## Block details

### Key Financial Indicators — EXISTING

Type `StockFinancials`. A current snapshot from `quoteSummary`
(`financialData` + `summaryDetail` + `defaultKeyStatistics`). Rendered as a single bullet list.

- **Valuation:** `currentPrice`, `marketCap`, `enterpriseValue`, `trailingPE`, `forwardPE`,
  `priceToBook`, `beta`, `dividendYield`, `fiftyTwoWeekHigh`/`fiftyTwoWeekLow`.
- **Quality / health:** `profitMargins`, `operatingMargins`, `returnOnEquity`, `freeCashflow`,
  `operatingCashflow`, `ebitda`, `totalDebt`, `debtToEquity`.
- **Growth:** `revenueGrowth`, `earningsGrowth`, `totalRevenue`.
- **Analyst targets:** `targetLowPrice` / `targetMeanPrice` / `targetHighPrice`.

The system prompt instructs the model to compute derived ratios from these (implied PEG, EV/EBITDA,
FCF yield, forward-vs-trailing P/E, price-vs-target range).

### Fundamentals — NEW

Type `StockFundamentals`. Fetched independently of `financials` so a failure here never compromises
the snapshot above. Mapped in `src/_backend/modules/yahoo/helpers/map-fundamentals.helper.ts`.

- **`earningsHistory: EarningsQuarter[]`** (last 4 quarters, from `earningsHistory`) —
  `period`, `quarter`, `epsActual`, `epsEstimate`, `surprisePercent`. Rendered with a beat/miss
  verdict per quarter.
- **`forwardEstimates: ForwardEstimate[]`** (from `earningsTrend`, periods `0q/+1q/0y/+1y`) —
  `epsAvg`, `epsGrowth`, `revenueAvg`, `revenueGrowth`.
- **`revenueTrend: RevenueTrendPoint[]`** (up to 4 years, newest first) — `endDate`, `totalRevenue`,
  `netIncome`. **Sourced from `fundamentalsTimeSeries` (`module: 'financials'`, `type: 'annual'`),
  NOT the `incomeStatementHistory` quoteSummary module** — Yahoo has emptied that module for most
  tickers since late 2024, so the time-series endpoint is the reliable source.
- **`analystRatings: AnalystRatings | null`** (latest period, from `recommendationTrend`) —
  `strongBuy`, `buy`, `hold`, `sell`, `strongSell`. The prompt uses the **distribution** as a
  consensus-strength signal, not just the price target.
- **`insiders: InsiderActivity | null`** (from `insiderTransactions`) — `buyCount`, `sellCount`,
  `netShares` (buys positive, sells negative; classified from each transaction's text). Weighted
  lightly by the prompt.

### Technical Snapshot — NEW

Type `StockTechnicals`. Computed by `compute-technical-indicators.helper.ts` (pure function) from the
1-year daily close series returned by `getPriceHistory`. A **compact summary is injected — never the ~252
raw points.** Framed in the prompt as a secondary timing/momentum signal.

- **Moving averages / regime:** `sma50`, `sma200`, `priceVsSma50Pct`, `priceVsSma200Pct`,
  `trend` (`golden-cross` | `death-cross` | `neutral`).
- **Momentum / position:** `rsi14`, `high52w`/`low52w`, `pctFrom52wHigh`, `pctFrom52wLow`,
  `return1m`, `return3m`, `return6m`, `return12m`.
- **Risk:** `annualizedVolatilityPct`.

Every metric is guarded for short history (e.g. `sma200` is `null` with under 200 points).

### Recent Significant Development — EXISTING

Type `StockSigDev` (Yahoo `insights.sigDevs[0]`) — `headline` + `date`. The single most notable
recent event. Confirmatory weight only.

### Analyst Coverage — EXISTING

Type `StockReports[]` (Yahoo `insights.reports`, up to 3) — `title`/`reportTitle`, `provider`,
`reportDate`. Surfaced as titles; the prompt treats these as secondary, confirmatory signals.

### Company vs Sector Scores — EXISTING

Type `StockScores` (Yahoo `insights.companySnapshot`) — company vs sector on a 0.0–1.0 scale for
`innovativeness`, `hiring`, `sustainability`. Soft signals, confirmatory only.

### Recent News — NEW

`NewsItem[]` from Finnhub `company-news` (top 3). Each item: `headline`, `source`, `datetime`
(unix seconds), `summary` (truncated to 200 chars in the prompt), plus `category`/`image`/`url`.
Framed as a confirmatory signal — used to confirm or challenge the thesis, never to drive it.

> Note: the fundamentals, technicals and news data are also surfaced in the report UI (the
> "Key Financial Metrics" card and the exported PDF), not just the prompt.

---

## Model & output

Selected in `get-stock-analysis.processor.ts`, constants in
`src/_backend/modules/analysis/constants/index.ts`.

| Tier | Model (`useBaseModel`)                      | Thinking                                 | `maxOutputTokens`                |
| ---- | ------------------------------------------- | ---------------------------------------- | -------------------------------- |
| Free | `FREE_MODEL` = `claude-haiku-4-5`           | disabled                                 | `MAX_OUTPUT_TOKENS_FREE` = 8000  |
| Paid | `PROD_MODEL` = `claude-sonnet-4-5-20250929` | enabled, `THINKING_BUDGET_TOKENS` = 6000 | `MAX_OUTPUT_TOKENS_PROD` = 16000 |

> **Token invariant:** with extended thinking, thinking tokens count toward `max_tokens`, so
> `maxOutputTokens` MUST be comfortably larger than `THINKING_BUDGET_TOKENS` — otherwise the model
> spends its whole budget reasoning and emits no JSON (surfaces as `AI_NoOutputGeneratedError`).
> `16000 > 6000` leaves ~10k for the answer.

**Structured output** — `stockAnalysisSchema` (Vercel AI SDK `Output.object`, native Anthropic
`json_schema`):

```ts
{
    analysis: string // full analysis as inner HTML (no <html>/<body>)
    sentiment: number // integer 0–100 (0–24 extreme bearish … 76–100 extreme bullish)
}
```

`logger.log('Analysis completed', { reportId, tokenUsdCost, finishReason, outputTokens })` records
cost and truncation diagnostics. Per-call cost is computed by `calculateTokenCost` (Haiku
$0.80/$4.00, Sonnet $3.00/$15.00 per 1M input/output tokens).

---

## Caching & resilience

| Store                          | Scope                                               | TTL    | Source constant         |
| ------------------------------ | --------------------------------------------------- | ------ | ----------------------- |
| `stock_data` table             | Yahoo financials + fundamentals + insights snapshot | 3 days | `YAHOO_DATA_TTL`        |
| `unstable_cache` price-history | 1y daily closes (per ticker)                        | 12 h   | `GET_PRICE_HISTORY_TTL` |
| `unstable_cache` latest-news   | Finnhub company-news (per ticker)                   | 1 day  | `LATEST_NEWS_TTL`       |

- The TTL-cached `stock_data` row carries financials **and** fundamentals (column `fundamentals jsonb`).
  Rows cached before the fundamentals column existed read back as `null` until they refresh past the
  TTL — handled gracefully by the null-checks in `buildYahooContext`.
- Every supplementary source (price history, news, and Yahoo itself) is **non-fatal**: missing data
  removes its block but never aborts the analysis. The model is told to reason around missing metrics
  rather than invent them.

---

## File map

All backend code lives under `src/_backend/modules/<module>/`, split NestJS-style
(controllers → services → processors/repositories/helpers).

```
src/_backend/modules/analysis/
├── processors/
│   └── get-stock-analysis.processor.ts     # orchestration: assemble context → generateText → save
├── constants/index.ts                      # models, token budgets, stockAnalysisSchema, PROMPTS_MAP
├── prompts/
│   ├── system.prompt.ts                    # SystemPrompt (persona, rules, signal hierarchy)
│   └── analysis.prompt.ts                  # the 5 per-type prompt strings
└── helpers/
    └── calculate-token-cost.helper.ts      # per-call USD cost

src/_backend/modules/yahoo/
├── yahoo.router.ts                         # YAHOO_ROUTER (price-history controller)
├── controllers/
│   └── get-price-history.controller.ts     # tRPC binding → cached price-history service
├── services/
│   └── get-price-history.service.ts        # cached, session-gated price history (tRPC)
├── processors/
│   ├── get-yahoo-ttl-data.processor.ts     # TTL read/refresh of stock_data (accepts a client)
│   ├── get-yahoo-data.processor.ts         # quoteSummary + fundamentalsTimeSeries + insights
│   ├── get-yahoo-ticker.processor.ts       # symbol → canonical ticker
│   ├── get-price-history.processor.ts      # RAW 1y daily closes (analysis pipeline)
│   ├── fetch-history.processor.ts          # fetchHistoryRaw / fetchHistoryCached
│   └── save-yahoo-data-to-ttl.processor.ts # persist financials + fundamentals
├── repositories/
│   └── stock-data.repository.ts            # stock_data table access
├── constants/index.ts                      # YAHOO_DATA_TTL, GET_PRICE_HISTORY_TTL, cache key
├── types/index.ts
└── helpers/
    ├── build-yahoo-context.helper.ts       # assembles the "## Current Market Context" block
    ├── map-fundamentals.helper.ts          # quoteSummary/time-series → StockFundamentals
    └── compute-technical-indicators.helper.ts  # price series → StockTechnicals

src/_backend/modules/finnhub/
├── finnhub.router.ts                       # FINNHUB_ROUTER (latest-news controller)
├── controllers/
│   └── get-latest-news.controller.ts       # tRPC binding → cached news service
├── services/
│   ├── get-latest-news.service.ts          # RAW Finnhub news (analysis pipeline)
│   └── get-latest-news-cached.service.ts   # cached, session-gated news (tRPC)
├── processors/
│   └── fetch-latest-news.processor.ts      # fetchLatestNewsRaw / fetchLatestNewsCached
└── constants/index.ts                      # LATEST_NEWS_TTL, cache key

src/_backend/modules/reports/
├── jobs/process-report.job.ts              # Trigger.dev task — entry into the pipeline
├── processors/
│   ├── process-report.processor.ts         # loads report → getStockAnalysis → notify
│   └── save-analysis-to-report.processor.ts # persist analysis HTML + sentiment + cost
└── repositories/reports.repository.ts      # reports table access

src/types/ReportDTO.ts                      # StockFinancials, StockFundamentals, StockTechnicals, ...
```
