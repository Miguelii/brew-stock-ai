# Analysis Context: What the AI Sees

This document is the single source of truth for **everything fed to the model** when generating a
stock analysis: every data block, where it comes from, the exact fields, how the final prompt is
assembled, and what happens to the output. Blocks are tagged **[EXISTING]** (present before the
context-enrichment work) or **[NEW]** (added during it) so the delta is explicit.

The architecture is deliberately simple: **one** model call per report, with **structured output**
(no multi-agent orchestration). Quality comes from the breadth and quality of the injected context,
not from chaining calls.

---

## Table of Contents

1. [Pipeline](#pipeline)
2. [The assembled prompt](#the-assembled-prompt)
3. [Context blocks: master table](#context-blocks-master-table)
4. [Block details](#block-details)
    - [Key Financial Indicators (EXISTING)](#key-financial-indicators-existing)
    - [Fundamentals (NEW)](#fundamentals-new)
    - [Technical Snapshot (NEW)](#technical-snapshot-new)
    - [Recent Significant Development (EXISTING)](#recent-significant-development-existing)
    - [Analyst Coverage (EXISTING)](#analyst-coverage-existing)
    - [Company vs Sector Scores (EXISTING)](#company-vs-sector-scores-existing)
    - [Recent News (NEW)](#recent-news-new)
5. [Model & output](#model--output)
6. [Caching & resilience](#caching--resilience)
7. [File map](#file-map)

---

## Pipeline

The backend is organised NestJS-style under `src/_bff/modules/<module>/`
(controllers → services → processors/repositories/helpers). The analysis entry point is the
`getStockAnalysis` **processor** in
`src/_bff/modules/analysis/processors/get-stock-analysis.processor.ts`. It runs in the
**Trigger.dev** background runtime (`src/_bff/modules/reports/jobs/process-report.job.ts` →
`src/_bff/modules/reports/processors/process-report.processor.ts`), with an admin Supabase client
and **no user session**.

```
getStockAnalysis(stockSymbol, promptType, reportId, supabaseClient, useBaseModel?)
  │
  ├─ promptTemplate = resolvePromptTemplate(promptType)     // PROMPTS_MAP[promptType],
  │                                                         //   else InvalidPromptTypeError
  │
  ├─ marketData = fetchMarketData(stockSymbol, supabaseClient)
  │    ├─ ticker        = getYahooTicker(stockSymbol)        // NON-FATAL → null
  │    ├─ tickerForData = ticker ?? stockSymbol
  │    └─ Effect.all (parallel, concurrency: 'unbounded')
  │         ├─ yahoo        = ticker ? getYahooDataWithFallbackService(ticker, supabaseClient)
  │         │                        : null                 // fresh-first, stock_data as fallback
  │         ├─ priceHistory = getPriceHistoryService(tickerForData)  // RAW 1y daily closes, NON-FATAL
  │         └─ news         = getLatestNewsService(tickerForData)    // RAW Finnhub news, NON-FATAL
  │       → MarketData { yahoo, priceHistory, news }
  │
  ├─ fork saveFreshYahooData(yahoo)                         // upsert stock_data only when isFresh,
  │                                                         //   in the background, NON-FATAL
  │
  └─ analyzeAndSaveReport(...)  .pipe(Effect.ensuring(join save fiber))
       ├─ prompt       = buildPrompt(promptTemplate, stockSymbol, marketData)   // see below
       ├─ generateText({ model, providerOptions, output: stockAnalysisSchema,
       │                 system: SystemPrompt, prompt, maxOutputTokens })
       │    → { analysis (HTML), sentiment }
       ├─ sentiment    = normalizeSentiment(output.sentiment)
       ├─ tokenUsdCost = calculateTokenCost(model, inputTokens, outputTokens)
       ├─ logger.log('Analysis completed', ...)
       ├─ prod only: isAnalysisComplete(analysis, finishReason) or fail (ANALYSIS_AI_INCOMPLETE)
       └─ saveAnalysisToReport(reportId, analysis, ticker, tokenUsdCost, sentiment, supabaseClient)

buildPrompt:
  technicals = priceHistory?.length ? computeTechnicalIndicators(priceHistory) : null
  hasContext = (yahoo && hasAnyStockData(yahoo.data)) || technicals || news?.length
  context    = hasContext ? "\n\n" + buildYahooContext(yahoo?.data ?? EMPTY_YAHOO_DATA, technicals, news)
                          : ""
  prompt     = promptTemplate.replaceAll("##TICKER##", stockSymbol) + context
```

Key properties:

- **Every data source is non-fatal.** Ticker resolution, price history and news are wrapped in
  `logAndRecover` (logs the error, resolves to `null`); `getYahooDataWithFallbackService` never
  fails (it resolves to `null` when Yahoo and `stock_data` both have nothing). The analysis still
  runs on whatever context survives, and with no context at all the prompt is sent bare.
- **Ticker first, then everything in parallel.** `getYahooTicker` resolves the canonical symbol
  once; Yahoo data, price history and news are then fetched concurrently with that same symbol, so
  all blocks refer to the same ticker. When resolution fails, Yahoo data is skipped and price
  history and news fall back to the raw `stockSymbol`.
- **The Yahoo upsert does not block the model call.** `saveFreshYahooData` runs in a forked fiber
  while the model generates. `Effect.ensuring` joins it even when the analysis fails, so the write
  is never interrupted halfway.
- **Raw (uncached, session-less) fetchers** are used here, because the Trigger.dev runtime has no
  user session and no Next.js data cache:
    - `getPriceHistoryService` (`yahoo/services/get-price-history.service.ts`, built on
      `fetchHistoryRaw` in `yahoo/processors/fetch-history.processor.ts`)
    - `getLatestNewsService` (`finnhub/services/get-latest-news.service.ts`, built on
      `fetchLatestNewsRaw` in `finnhub/processors/fetch-latest-news.processor.ts`)

    The user-facing tRPC endpoints use separate cached wrappers: `getCachedPriceHistoryService`
    (`yahoo/services/get-cached-price-history.service.ts`, exposed by
    `yahoo/controllers/get-price-history.controller.ts`) and `getLatestNews`
    (`finnhub/services/get-latest-news-cached.service.ts`, exposed by
    `finnhub/controllers/get-latest-news.controller.ts`).

---

## The assembled prompt

The model receives three things:

### 1. System prompt: `SystemPrompt` (`src/_bff/modules/analysis/prompts/system.prompt.ts`)

Defines the persona (senior equity research analyst), the writing rules (interpret don't describe,
anchor every claim in numbers, never fabricate, stay balanced), the **required JSON output shape**,
and, critically, the **hierarchy of signals**:

> Business quality, durable cash generation, and valuation drive the thesis. Earnings/estimates and
> analyst ratings are primary fundamentals; **technicals are a secondary timing signal**; **news and
> soft scores are confirmatory only**, never the core of the case.

HTML rules the output must follow:

- Inner content only (no `<html>`, `<head>`, `<body>`).
- **No HTML attributes and no straight double quotes (`"`)** anywhere in the analysis. Quotes must
  be typographic (`“ ”`) or single (`'`).
- **Always end with `<h3>Investment Thesis Summary</h3>` followed by one concise `<p>`.** The
  incomplete-output guard (see [Post-processing](#post-processing)) and the report TL;DR card both
  depend on this section.

### 2. Per-type prompt: one of five (`PROMPTS_MAP`)

Selected by `promptType`. The five prompt strings live in
`src/_bff/modules/analysis/prompts/analysis.prompt.ts`. `PROMPTS_MAP` (prompt by type) and
`PROMPT_COSTS_MAP` (credit cost by type) live in `src/_bff/modules/analysis/constants/index.ts`,
both derived from `PROMPT_TYPES` (type, label, cost), which lives in
`src/_bff/core/constants/prompt-types.constants.ts` because the frontend also uses it. Each prompt contains `##TICKER##`, replaced with the symbol at runtime.

| Prompt constant                      | Focus                                                                                 |
| ------------------------------------ | ------------------------------------------------------------------------------------- |
| `WallStreetStyleStockAnalysisPrompt` | Full report (business, moat, financials, risks, valuation, scenarios, 12–24m outlook) |
| `DeepFinancialBreakdownPrompt`       | Financial statements deep-dive                                                        |
| `MoatAnalysisPrompt`                 | Competitive moat                                                                      |
| `RiskAnalysisPrompt`                 | Risk ranking + "kill scenario"                                                        |
| `GrowthPotentialAnalysisPrompt`      | TAM, growth runway, 3–5y scenarios                                                    |

### 3. Injected context: the `## Current Market Context` block

Built by `buildYahooContext(data, technicals?, news?)`
(`src/_bff/modules/yahoo/helpers/build-yahoo-context.helper.ts`) and appended to the per-type
prompt. The processor only appends this block when `hasContext` is true (at least one Yahoo field
has data per `hasAnyStockData`, or there are technicals, or there is news); otherwise the prompt is
sent with no context. When Yahoo data is missing but technicals or news exist, `EMPTY_YAHOO_DATA`
is passed so only those blocks render. Each section renders **only when its data is present**, in
this exact order:

```
## Current Market Context
(one-line intro: live data from Yahoo Finance, to be incorporated where relevant)

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

## Context blocks: master table

All file paths below are relative to `src/_bff/modules/`. The "Cache" column describes what the
**analysis pipeline** sees: price history and news are always fetched live there (the
`unstable_cache` TTLs only apply to the tRPC endpoints, see [Caching & resilience](#caching--resilience)).

| Block                          | Status   | Source                         | Service / file                                                                                                  | Cache (pipeline)        |
| ------------------------------ | -------- | ------------------------------ | --------------------------------------------------------------------------------------------------------------- | ----------------------- |
| Key Financial Indicators       | EXISTING | Yahoo `quoteSummary`           | `yahoo/processors/get-yahoo-data.processor.ts` (`financialData`, `summaryDetail`, `defaultKeyStatistics`)       | `stock_data` (fallback) |
| Earnings History               | NEW      | Yahoo `quoteSummary`           | `yahoo/processors/get-yahoo-data.processor.ts` + `yahoo/helpers/map-fundamentals.helper.ts` (`earningsHistory`) | `stock_data` (fallback) |
| Forward Estimates              | NEW      | Yahoo `quoteSummary`           | `yahoo/helpers/map-fundamentals.helper.ts` (`earningsTrend`)                                                    | `stock_data` (fallback) |
| Revenue & Net Income Trend     | NEW      | Yahoo `fundamentalsTimeSeries` | `yahoo/helpers/map-fundamentals.helper.ts` (`financials`, annual)                                               | `stock_data` (fallback) |
| Analyst Rating Distribution    | NEW      | Yahoo `quoteSummary`           | `yahoo/helpers/map-fundamentals.helper.ts` (`recommendationTrend`)                                              | `stock_data` (fallback) |
| Insider Activity               | NEW      | Yahoo `quoteSummary`           | `yahoo/helpers/map-fundamentals.helper.ts` (`insiderTransactions`)                                              | `stock_data` (fallback) |
| Technical Snapshot             | NEW      | Yahoo `chart` (1y daily)       | `yahoo/services/get-price-history.service.ts` → `yahoo/helpers/compute-technical-indicators.helper.ts`          | none (live)             |
| Recent Significant Development | EXISTING | Yahoo `insights`               | `yahoo/processors/get-yahoo-data.processor.ts` (`sigDevs[0]`)                                                   | `stock_data` (fallback) |
| Analyst Coverage               | EXISTING | Yahoo `insights`               | `yahoo/processors/get-yahoo-data.processor.ts` (`reports`, 3)                                                   | `stock_data` (fallback) |
| Company vs Sector Scores       | EXISTING | Yahoo `insights`               | `yahoo/processors/get-yahoo-data.processor.ts` (`companySnapshot`)                                              | `stock_data` (fallback) |
| Recent News                    | NEW      | Finnhub `company-news`         | `finnhub/services/get-latest-news.service.ts` (`fetchLatestNewsRaw`, top 3)                                     | none (live)             |

Stock field shapes live in `src/types/ReportDTO.ts`; `NewsItem` lives in `src/types/news.ts`;
`PricePoint`, `GetYahooDataResult` and `YahooDataWithFallbackResult` live in
`src/_bff/modules/yahoo/types/index.ts`.

---

## Block details

### Key Financial Indicators (EXISTING)

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

### Fundamentals (NEW)

Type `StockFundamentals`. Fetched independently of `financials` so a failure here never compromises
the snapshot above. Mapped in `src/_bff/modules/yahoo/helpers/map-fundamentals.helper.ts`.

- **`earningsHistory: EarningsQuarter[]`** (last 4 quarters, from `earningsHistory`):
  `period`, `quarter`, `epsActual`, `epsEstimate`, `surprisePercent`. Rendered with a beat/miss
  verdict per quarter.
- **`forwardEstimates: ForwardEstimate[]`** (from `earningsTrend`, periods `0q/+1q/0y/+1y`):
  `epsAvg`, `epsGrowth`, `revenueAvg`, `revenueGrowth`.
- **`revenueTrend: RevenueTrendPoint[]`** (up to 4 years, newest first): `endDate`, `totalRevenue`,
  `netIncome`. **Sourced from `fundamentalsTimeSeries` (`module: 'financials'`, `type: 'annual'`),
  NOT the `incomeStatementHistory` quoteSummary module.** Yahoo has emptied that module for most
  tickers since late 2024, so the time-series endpoint is the reliable source.
- **`analystRatings: AnalystRatings | null`** (latest period, from `recommendationTrend`):
  `strongBuy`, `buy`, `hold`, `sell`, `strongSell`. The prompt uses the **distribution** as a
  consensus-strength signal, not just the price target.
- **`insiders: InsiderActivity | null`** (from `insiderTransactions`): `buyCount`, `sellCount`,
  `netShares` (buys positive, sells negative; classified from each transaction's text). Weighted
  lightly by the prompt.

### Technical Snapshot (NEW)

Type `StockTechnicals`. Computed by `compute-technical-indicators.helper.ts` (pure function) from the
1-year daily close series returned by `getPriceHistoryService`. A **compact summary is injected,
never the ~252 raw points.** Framed in the prompt as a secondary timing/momentum signal.

- **Moving averages / regime:** `sma50`, `sma200`, `priceVsSma50Pct`, `priceVsSma200Pct`,
  `trend` (`golden-cross` | `death-cross` | `neutral`).
- **Momentum / position:** `rsi14`, `high52w`/`low52w`, `pctFrom52wHigh`, `pctFrom52wLow`,
  `return1m`, `return3m`, `return6m`, `return12m`.
- **Risk:** `annualizedVolatilityPct`.

Every metric is guarded for short history (e.g. `sma200` is `null` with under 200 points). An empty
price series skips the block entirely.

### Recent Significant Development (EXISTING)

Type `StockSigDev` (Yahoo `insights.sigDevs[0]`): `headline` + `date`. The single most notable
recent event. Confirmatory weight only.

### Analyst Coverage (EXISTING)

Type `StockReports[]` (Yahoo `insights.reports`, up to 3): `title`/`reportTitle`, `provider`,
`reportDate`. Surfaced as titles; the prompt treats these as secondary, confirmatory signals.

### Company vs Sector Scores (EXISTING)

Type `StockScores` (Yahoo `insights.companySnapshot`): company vs sector on a 0.0–1.0 scale for
`innovativeness`, `hiring`, `sustainability`. Soft signals, confirmatory only.

### Recent News (NEW)

`NewsItem[]` from Finnhub `company-news` (top 3). Each item: `headline`, `source`, `datetime`
(unix seconds), `summary` (truncated to `NEWS_SUMMARY_MAX_CHARS` = 200 chars in the prompt), plus
`category`/`image`/`url`. Framed as a confirmatory signal: used to confirm or challenge the thesis,
never to drive it. Missing `NEXT_FINNHUB_API_KEY` fails the fetch (`LATEST_NEWS_API_KEY_MISSING`),
which the pipeline recovers as "no news".

The report page's "Recent news" card does **not** use this top 3. It reads the cached tRPC path
(`finnhub.getLatestNews`), which runs `selectCardNews` (`finnhub/helpers/select-card-news.helper.ts`)
over the full response: headlines are de-duplicated, the newest story with a real photo from the
last `NEWS_LEAD_MAX_AGE_SECONDS` (7 days) is featured first, and the `NEWS_CARD_LIST_SIZE` (4) most
recent remaining headlines follow. Images are blanked unless `getNewsImageUrl`
(`src/_bff/core/helpers/news-image.helper.ts`) accepts them: only the https hosts and paths in
`NEWS_IMAGE_SOURCES` (`src/_bff/core/constants/news.constants.ts`) pass, which drops the Yahoo
Finance placeholder logo carried by most items. The same list feeds `images.remotePatterns` in
`next.config.ts`, so photos are served through `/_next/image` and the page CSP stays unchanged.

> Note: the fundamentals, technicals and news data are also surfaced in the report UI (the
> "Key Financial Metrics" card, the "Market & Analyst Outlook" card and the exported PDF), not just
> the prompt.

---

## Model & output

Selected in `generateAnalysis` (`get-stock-analysis.processor.ts`), constants in
`src/_bff/modules/analysis/constants/index.ts`. `useBaseModel` is `getIsDev()` at enqueue time, so
the free tier only runs in development.

| Tier | Model (`useBaseModel`)            | Thinking                                                                   | `maxOutputTokens`                |
| ---- | --------------------------------- | -------------------------------------------------------------------------- | -------------------------------- |
| Free | `FREE_MODEL` = `claude-haiku-4-5` | disabled (`providerOptions` undefined)                                     | `MAX_OUTPUT_TOKENS_FREE` = 8000  |
| Paid | `PROD_MODEL` = `claude-sonnet-5`  | **adaptive** (`providerOptions.anthropic.thinking = { type: 'adaptive' }`) | `MAX_OUTPUT_TOKENS_PROD` = 16000 |

> **Token invariant:** with adaptive thinking there is no fixed thinking budget, but the thinking
> tokens still count toward `max_tokens`. `MAX_OUTPUT_TOKENS_PROD` must leave comfortable room for
> the full HTML answer after the model reasons; otherwise it spends the whole budget thinking and
> emits no JSON (surfaces as `AI_NoOutputGeneratedError`, or as a truncated analysis caught by the
> guard below).

**Structured output**: `stockAnalysisSchema` (Vercel AI SDK `Output.object`, native Anthropic
`json_schema`):

```ts
{
    analysis: string // full analysis as inner HTML (no <html>/<body>)
    sentiment: number // asked as an integer 0–100 (0–24 extreme bearish … 76–100 extreme bullish)
}
```

The `ai` and `@ai-sdk/anthropic` packages are imported dynamically inside the call. Any SDK error is
logged and mapped to `AiGenerationError` (`ANALYSIS_AI_GENERATION`).

### Post-processing

Applied in `analyzeAndSaveReport`, in this order:

1. **`normalizeSentiment`** (`analysis/helpers/normalize-sentiment.helper.ts`): the schema can't
   enforce the integer range, so the value is rounded and clamped to 0–100. A non-finite value
   falls back to 50 (neutral).
2. **`calculateTokenCost`** (`analysis/helpers/calculate-token-cost.helper.ts`): USD cost per call.
   Pricing per 1M input/output tokens: `claude-haiku-4-5` $1/$5, `claude-sonnet-5` $2/$10. Returns
   `'N/A'` for an unknown model or missing token counts.
3. **Log**: `logger.log('Analysis completed', { reportId, tokenUsdCost, finishReason, outputTokens,
hasPriceHistory, hasNews, hasYahooFreshData })` records cost, truncation and context-coverage
   diagnostics.
4. **Incomplete-output guard** (prod only, skipped when `useBaseModel`):
   `isAnalysisComplete(analysis, finishReason)` (`analysis/helpers/is-analysis-complete.helper.ts`)
   requires all of:
    - `finishReason === 'stop'`
    - a non-empty "Investment Thesis Summary" section, read with `extractInvestmentThesis`
      (`src/_bff/core/helpers/report-html.helper.ts`, shared with the report TL;DR card)
    - the HTML ending on a closed block (`</p>`, `</ul>` or `</ol>`)

    This catches text cut mid-sentence even when the JSON itself is valid. On failure it logs
    `Incomplete analysis` and fails with `AiGenerationError` (`ANALYSIS_AI_INCOMPLETE`), so a
    truncated analysis is **never saved**: the job marks the report FAILED and refunds (see below).

5. **`saveAnalysisToReport`** (`reports/processors/save-analysis-to-report.processor.ts`): persists
   the analysis HTML, resolved ticker, cost and sentiment.

---

## Caching & resilience

| Store                          | Scope                                               | TTL      | Used by                           | Source constant         |
| ------------------------------ | --------------------------------------------------- | -------- | --------------------------------- | ----------------------- |
| `stock_data` table             | Yahoo financials + fundamentals + insights snapshot | fallback | analysis pipeline                 | (none, fresh-first)     |
| `unstable_cache` price-history | 1y daily closes (per ticker)                        | 12 h     | tRPC `yahoo.getPriceHistory` only | `GET_PRICE_HISTORY_TTL` |
| `unstable_cache` latest-news   | Finnhub company-news card selection (per ticker)    | 1 day    | tRPC `finnhub.getLatestNews` only | `LATEST_NEWS_TTL`       |

- Yahoo data is **fresh-first** (`getYahooDataWithFallbackService`): every analysis fetches live
  from Yahoo (the package has no rate limit).
    - All five fields present (`hasAllStockData`): used as is, `isFresh: true`.
    - Total Yahoo failure: the stored row is used wholesale (`rowToYahooData`), `isFresh: false`,
      or `null` when there is no row.
    - Partial failure: missing fields are filled from the row (`mergeWithDbFallback`); `isFresh` is
      true when Yahoo returned at least one field (`hasAnyStockData`).
- Only fresh data is upserted back into `stock_data` (`saveFreshYahooData` → `saveYahooData`), in a
  background fiber. A failed upsert is logged and ignored.
- Admins can refresh a stored ticker without running an analysis, from the **Tickers** tab of
  `/config-app` (`admin.refreshStockData` → `refreshStockData` in
  `src/_bff/modules/admin/services/refresh-stock-data.service.ts`). It runs the same
  `getYahooDataWithFallbackService` → `saveYahooData` steps, fails instead of saving when nothing
  came fresh from Yahoo, and then expires the report page cache for that ticker
  (`revalidateStockDataCache`). That last step is only possible because it runs in the Next
  runtime; the Trigger.dev pipeline still relies on the 1h `STOCK_DATA_CACHE_TTL`.
- The `stock_data` row carries financials **and** fundamentals (column `fundamentals jsonb`).
  Missing columns read back as `null`, handled gracefully by the null-checks in
  `buildYahooContext`.
- Every supplementary source (ticker, price history, news, and Yahoo itself) is **non-fatal**:
  missing data removes its block but never aborts the analysis. The model is told to reason around
  missing metrics rather than invent them.

### Failure, refund & idempotency

A report deducts credits when it is created, so every failure path must end in FAILED + refund,
exactly once.

- **`createReport`** (`reports/services/create-report.service.ts`): validates the prompt type,
  deducts `PROMPT_COSTS_MAP[type]` credits, inserts the report (refunds if the insert fails), then
  calls `enqueueReportProcessing`.
- **`enqueueReportProcessing`** (`reports/jobs/process-report.job.ts`): triggers the task with
  `idempotencyKey: reportId`, so a duplicate trigger never pays for a second generation. It never
  fails: when queueing fails it marks the report FAILED and refunds, so the report never stays
  GENERATING forever.
- **`process-report` task**: `maxDuration: 300`, `retry.maxAttempts: 1`. Its `onFailure` calls
  `markReportFailedAndRefund` (`reports/services/mark-report-failed-and-refund.service.ts`), the
  single owner of the GENERATING → FAILED transition. `markReportFailed` only updates rows not yet
  FAILED, so the refund happens once.
- **`processReport`**: skips any report that is not in `GENERATING` (duplicate or late runs). A
  failed push notification after completion is swallowed so it never fails the task.
- **`updateReportWithAnalysis`** (`reports/repositories/reports.repository.ts`): only writes when
  `status = GENERATING`, so a late analysis never overwrites a report that already FAILED and was
  refunded.

---

## File map

All backend code lives under `src/_bff/modules/<module>/`, split NestJS-style
(controllers → services → processors/repositories/helpers).

```
src/_bff/modules/analysis/
├── processors/
│   └── get-stock-analysis.processor.ts     # orchestration: fetch → prompt → generateText → guard → save
├── constants/index.ts                      # models, token budgets, stockAnalysisSchema, PROMPTS_MAP, PROMPT_COSTS_MAP
├── types/index.ts                          # MarketData, AnalyzeReportInput
├── prompts/
│   ├── system.prompt.ts                    # SystemPrompt (persona, rules, HTML rules, signal hierarchy)
│   └── analysis.prompt.ts                  # the 5 per-type prompt strings
└── helpers/
    ├── calculate-token-cost.helper.ts      # per-call USD cost
    ├── normalize-sentiment.helper.ts       # round + clamp sentiment to 0–100
    └── is-analysis-complete.helper.ts      # incomplete-output guard

src/_bff/modules/yahoo/
├── yahoo.router.ts                         # YAHOO_ROUTER (price-history controller)
├── controllers/
│   └── get-price-history.controller.ts     # tRPC binding → cached price-history service
├── services/
│   ├── get-yahoo-data-with-fallback.service.ts # fresh-first fetch, stock_data as fallback
│   ├── get-price-history.service.ts        # RAW 1y daily closes (analysis pipeline)
│   └── get-cached-price-history.service.ts # cached price history (tRPC)
├── processors/
│   ├── get-yahoo-data.processor.ts         # quoteSummary + fundamentalsTimeSeries + insights
│   ├── get-yahoo-ticker.processor.ts       # symbol → canonical ticker
│   ├── fetch-history.processor.ts          # fetchHistoryRaw / fetchHistoryCached
│   └── save-yahoo-data.processor.ts        # persist financials + fundamentals
├── repositories/
│   └── stock-data.repository.ts            # stock_data table access
├── constants/index.ts                      # GET_PRICE_HISTORY_TTL, cache key
├── types/index.ts                          # PricePoint, GetYahooDataResult, YahooDataWithFallbackResult
└── helpers/
    ├── build-yahoo-context.helper.ts       # assembles the "## Current Market Context" block
    ├── map-fundamentals.helper.ts          # quoteSummary/time-series → StockFundamentals
    ├── compute-technical-indicators.helper.ts  # price series → StockTechnicals
    ├── get-yahoo-data-with-fallback.service.helper.ts # hasAnyStockData, hasAllStockData, mergeWithDbFallback, rowToYahooData, selectDbRow
    └── utils.helper.ts                     # hasStockData, NEWS_SUMMARY_MAX_CHARS

src/_bff/modules/finnhub/
├── finnhub.router.ts                       # FINNHUB_ROUTER (latest-news controller)
├── controllers/
│   └── get-latest-news.controller.ts       # tRPC binding → cached news service
├── services/
│   ├── get-latest-news.service.ts          # RAW Finnhub news (analysis pipeline)
│   └── get-latest-news-cached.service.ts   # cached news (tRPC)
├── processors/
│   └── fetch-latest-news.processor.ts      # fetchLatestNewsRaw (top 3) / fetchLatestNewsCached (card selection)
├── helpers/
│   └── select-card-news.helper.ts          # selectCardNews: featured photo story + latest headlines
└── constants/index.ts                      # LATEST_NEWS_TTL, cache key, ANALYSIS_NEWS_COUNT, card sizes

src/_bff/modules/reports/
├── jobs/process-report.job.ts              # Trigger.dev task + enqueueReportProcessing
├── services/
│   ├── create-report.service.ts            # validate → deduct credits → insert → enqueue
│   └── mark-report-failed-and-refund.service.ts # GENERATING → FAILED + credit refund
├── processors/
│   ├── process-report.processor.ts         # loads report → getStockAnalysis → notify
│   └── save-analysis-to-report.processor.ts # persist analysis HTML + sentiment + cost
└── repositories/reports.repository.ts      # reports table access

src/_bff/core/constants/prompt-types.constants.ts  # PROMPT_TYPES (type, label, cost), shared with the frontend
src/_bff/core/constants/news.constants.ts   # NEWS_IMAGE_SOURCES, shared with next.config.ts and the news card
src/_bff/core/helpers/news-image.helper.ts  # getNewsImageUrl, shared with the news card
src/_bff/core/helpers/report-html.helper.ts # extractInvestmentThesis, shared with the TL;DR card
src/types/ReportDTO.ts                      # StockFinancials, StockFundamentals, StockTechnicals, ...
src/types/news.ts                           # NewsItem
```
