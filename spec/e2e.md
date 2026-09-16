# Smoke (E2E) Test Suite

Playwright-based end-to-end tests that run against the full Next.js application with **zero real database or external API calls**, except one known case (see [Known exception: live Yahoo price chart](#known-exception-live-yahoo-price-chart)). Everything else is intercepted by a local mock server or Playwright's `page.route()`.

---

## Table of Contents

1. [Why full mock?](#why-full-mock)
2. [Architecture](#architecture)
3. [Mock server](#mock-server)
4. [Auth: fake cookies](#auth-fake-cookies)
5. [tRPC mocking](#trpc-mocking)
6. [Selectors](#selectors)
7. [Test suites](#test-suites)
8. [Running locally](#running-locally)
9. [CI/CD](#cicd)
10. [File map](#file-map)
11. [Live Yahoo contract test](#live-yahoo-contract-test)
12. [Adding new tests](#adding-new-tests)

---

## Why full mock?

The report page (`/reports/[id]`) is **server-rendered**. The Effect services `getReportById` and `getSession` make HTTP calls from the **Node.js process** (not the browser) to Supabase. Playwright's `page.route()` only intercepts browser requests; it has no visibility into server-side fetches.

Two layers of interception are therefore needed:

| Layer                        | What it intercepts                                                 | Mechanism                                    |
| ---------------------------- | ------------------------------------------------------------------ | -------------------------------------------- |
| **Mock server** (port 54321) | Server-side requests from Next.js → Supabase REST + Auth + Finnhub | `node:http` server started in `globalSetup`  |
| **`page.route()`**           | Browser-side tRPC calls                                            | Playwright route handler registered per-test |

The Next.js dev/prod server is pointed at the mock server via env vars in `playwright.config.ts` `webServer.command`.

### Known exception: live Yahoo price chart

The report's "Market & Analyst Outlook" card renders `StockPriceChartServer` (`src/modules/report-view/report-market-outlook-card/stock-price-chart/server.tsx`), which calls `caller.yahoo.getPriceHistory` **server-side**. That goes through `yahoo-finance2`, which has no configurable base URL, so neither the mock server nor `page.route()` can intercept it: the suite hits the real Yahoo API there. The call is wrapped in `.catch(() => [])`, so a Yahoo failure (or no network) just renders an empty chart, and the specs only assert the section copy, never chart data. Keep it that way: don't add assertions that depend on live price data.

---

## Architecture

```
pnpm e2e
  │
  ├─ globalSetup
  │    ├─ startMockSupabase()  →  port 54321 listening
  │    └─ write auth-state.json  (fake Supabase session cookies)
  │
  ├─ webServer (playwright.config.ts)
  │    └─ Next.js on port 3001
  │         NEXT_SUPABASE_URL=http://localhost:54321
  │         NEXT_FINNHUB_BASE_URL=http://localhost:54321/api/v1
  │
  ├─ tests (Chromium, workers: 1, sequential)
  │    ├─ 01-auth.spec.ts        page.route() → tRPC auth.sendOtp / auth.verifyOtp
  │    ├─ 02-create-report.spec  page.route() → tRPC credits.get / reports.create / reports.getAll
  │    ├─ 03-view-report.spec    page.route() → tRPC finnhub.getLatestNews
  │    │                         mock server  → Supabase reports + stock_data
  │    │                         live Yahoo   → price chart (server-side, see above)
  │    ├─ 04-export-report.spec  page.route() → tRPC reports.export
  │    ├─ 05-full-flow.spec      all of the above combined
  │    └─ 06-tokens.spec         page.route() → tRPC credits.*
  │
  └─ globalTeardown
       └─ stopMockSupabase()  →  port 54321 closed
```

---

## Mock server

**File:** `e2e/mock-server.ts`

A plain `node:http` server with no extra dependencies. Started on `127.0.0.1:54321` before Playwright launches the Next.js web server. If the port is already in use (a previous session left it running), `startMockSupabase` logs a warning and reuses it instead of failing, so `--ui` mode still loads.

### Routes

| URL prefix                     | Response                                                                          |
| ------------------------------ | --------------------------------------------------------------------------------- |
| `GET /auth/v1/user`            | `MOCK_USER` object (authenticated user)                                           |
| `*  /auth/v1/*`                | `{}` (catch-all for token refresh, JWKS, etc.)                                    |
| `GET /api/v1/company-news*`    | `MOCK_NEWS_ITEMS[]` (Finnhub proxy)                                               |
| `GET /rest/v1/reports*`        | `MOCK_REPORT` (object if `Accept: application/vnd.pgrst.object+json`, else array) |
| `GET /rest/v1/stock_data*`     | `MOCK_STOCK_DATA` (same object/array logic)                                       |
| `GET /rest/v1/*`               | `[]` or `{}` (catch-all for other tables)                                         |
| `POST/PATCH/DELETE /rest/v1/*` | `{}`                                                                              |

### Shutdown behaviour

`stopMockSupabase` calls `server.closeAllConnections()` before `server.close()`. This force-drains keep-alive connections that Next.js holds open, which would otherwise prevent the `close()` callback from firing and leave `pnpm e2e` hanging.

The teardown always resolves: if the server was already closed by a SIGINT handler, `ERR_SERVER_NOT_RUNNING` is silently ignored.

### SIGINT / SIGTERM handling

`globalSetup` registers `process.once('SIGINT', forceClose)` and `process.once('SIGTERM', forceClose)` immediately after the server starts. This ensures the socket is released even when Ctrl+C is pressed before `globalTeardown` runs.

`process.once` (not `on`) is intentional: it does not shadow Playwright's own signal handler.

---

## Auth: fake cookies

**File:** `e2e/global-setup.ts`

No browser, no magic link, no Supabase Admin API. `globalSetup` generates fake cookies entirely in Node.js and writes them to `e2e/fixtures/auth-state.json`.

### Cookie derivation

`@supabase/ssr` derives the storage key from the Supabase URL hostname:

```
NEXT_SUPABASE_URL=http://localhost:54321
→ hostname: "localhost"
→ cookie name: "sb-localhost-auth-token.0"   (chunk 0, the session fits in one chunk)
```

The cookie value is:

```
"base64-" + base64url(JSON.stringify(session))
```

where `session` is a minimal Supabase session object containing a fake JWT and a mock user.

### Fake JWT

```
header  = base64url({"alg":"HS256","typ":"JWT"})
payload = base64url({"sub":"pw-test-user-id","email":"playwright@test.local","role":"authenticated","aud":"authenticated","exp":<now+1year>})
sig     = "bW9jaw"   (static mock bytes, never verified)
```

The signature is never checked. The token is consumed in two ways:

- **Authorization** (`getSession()` / `protectedProcedure`) calls `getUser()`, which hits the mock `/auth/v1/user` route and always gets `MOCK_USER`.
- **UI identity** (header, avatar, auth-aware CTAs, and the user id in `runEffect` error logs) comes from `getCachedClaims()` (`src/_bff/modules/auth/services/get-cached-claims.service.ts`), which calls `supabase.auth.getClaims()`. Because the header uses a symmetric algorithm (`HS256`), auth-js cannot verify it locally and falls back to `getUser()` (again the mock route). Once that succeeds, it **trusts the JWT payload**, so the `sub` and `email` in the payload above are what the UI renders. Keep them in sync with `MOCK_USER`.

> **Keep `alg: HS256` and don't add a `kid`.** With an asymmetric algorithm and a `kid`, `getClaims()` would try to fetch the JWKS from the mock server (`/auth/v1/.well-known/jwks.json`), get `{}` from the catch-all, fail to find a signing key, and `getCachedClaims()` would return `null`: every page would render as signed out.

### Why `auth-state.json` is git-ignored

The file contains `expires_at` computed from `Date.now()`, so it changes on every test run. It is regenerated by `globalSetup` before each run. The `.gitignore` entry is `/e2e/fixtures/auth-state.json`.

`playwright.config.ts` ensures an empty placeholder exists at startup (for `--ui` mode, which reads the config before `globalSetup` runs):

```ts
if (!existsSync(AUTH_STATE_PATH)) {
    mkdirSync('./e2e/fixtures', { recursive: true })
    writeFileSync(AUTH_STATE_PATH, JSON.stringify({ cookies: [], origins: [] }, null, 2))
}
```

---

## tRPC mocking

**File:** `e2e/support/mock-trpc.ts`

tRPC v11 with `httpBatchLink` wraps every response as a JSON array:

```json
[{ "result": { "data": <value> } }]
```

Each helper registers a `page.route()` handler that fulfills matching tRPC requests with the expected shape. Procedures are namespaced by module (`<module>.<procedure>`):

```ts
export async function mockGetCredits(page: Page, credits = MOCK_CREDITS) {
    // RegExp with a lookahead so `credits.get` never swallows `credits.getInvoices`
    await page.route(/\/api\/trpc\/credits\.get(?![A-Za-z])/u, (route) =>
        route.fulfill({ contentType: 'application/json', body: batchResponse(credits) })
    )
}
```

These intercept **browser-side** calls only. Server-side tRPC calls (from RSC via `createCaller`) run in the Node.js process: the ones backed by Supabase or Finnhub go through the mock server; `yahoo.getPriceHistory` goes to live Yahoo (see [Known exception](#known-exception-live-yahoo-price-chart)).

### Available helpers

| Function                    | Procedure mocked                |
| --------------------------- | ------------------------------- |
| `mockGetCredits`            | `credits.get`                   |
| `mockGetReports`            | `reports.getAll`                |
| `mockCreateReport`          | `reports.create`                |
| `mockExportReport`          | `reports.export`                |
| `mockSendOtp`               | `auth.sendOtp`                  |
| `mockVerifyOtp`             | `auth.verifyOtp`                |
| `mockGetLatestNews`         | `finnhub.getLatestNews`         |
| `mockCreateCheckoutSession` | `credits.createCheckoutSession` |
| `mockGetInvoices`           | `credits.getInvoices`           |

---

## Selectors

Rules for locating elements in specs:

- **Every element is located via `data-testid` + `getByTestId`.** Add the `data-testid` attribute to the component when it doesn't have one yet, including headings, banners, badges and copy that a test asserts on.
- **Never use `getByRole`, `getByLabelText`, `getByText` or `getByPlaceholder`** to locate elements. They are brittle (copy, roles and placeholders change) and are banned as locators.
- **Verify visible content by locating with `getByTestId(...)` and asserting the text** with `.toContainText(...)` / `.toHaveText(...)`. Those are assertions (not locators), so they stay allowed and keep copy coverage.
- **Never target library-internal attributes** (e.g. `[data-input-otp="true"]`, `[data-slot]`) nor CSS/tag/id locators (`locator('#id')`, `locator('strong')`) for assertions; add a `data-testid` instead.
- When a component renders **responsive variants** (e.g. the section nav's desktop row + mobile dropdown), give each variant a distinct testid (`nav-<id>` vs `nav-mobile-<id>`) so a single `getByTestId` never matches two elements (Playwright strict mode).
- **Testids reused across specs (or repeated) are encapsulated in Page Objects under `e2e/pos/*.po.ts`; specs never hardcode testid strings.** Each Page Object receives `page: Page` and exposes locators (via `getByTestId`) plus small navigation/action helpers; assertions stay in the specs.

Existing test ids: `email-input`, `sign-in-button`, `otp-input`, `auth-title`, `confirm-otp-button`, `use-different-email-button` (auth); `ticker-input`, `analysis-type-select`, `analysis-type-option`, `generate-report-button`, `report-created-toast` (analysis form); `report-ticker-heading`, `report-type-badge`, `report-section-<id>`, `nav-<id>` / `nav-mobile-<id>`, `sentiment-score`, `export-pdf-button` (report view); `token-package-<id>`, `buy-now-button`, `token-balance`, `payment-success-banner`, `payment-canceled-banner`, `pending-payment-banner`, `pending-payment-amount`, `pending-payment-description` (tokens).

---

## Test suites

All suites run sequentially (`workers: 1`, `fullyParallel: false`) to avoid port conflicts. In CI, `retries: 2` and `forbidOnly` are on.

### `01-auth.spec.ts`: Auth flow

Runs **without** the global `storageState` (no cookies, unauthenticated).

- Shows the email step on `/auth`
- Transitions to OTP step after submitting email (mocks `sendOtp`)
- Navigates away from `/auth` after confirming OTP (mocks `sendOtp` + `verifyOtp`)

Note: `input-otp` renders a hidden `<input data-input-otp="true">` that captures keystrokes. Tests use `page.keyboard.type('123456')` rather than clicking individual slot divs.

### `02-create-report.spec.ts`: Create report

Mocks `credits.get`, `reports.create` and `reports.getAll`.

- Renders the analysis form with the Generate Report button
- Fills ticker + selects analysis type via the select → submits
- Expects a "being generated" toast → redirect to `/reports`

### `03-view-report.spec.ts`: View report page

The most comprehensive suite. The report page is fully server-rendered using data from the mock server (`MOCK_REPORT` + `MOCK_STOCK_DATA`); `finnhub.getLatestNews` is mocked in `beforeEach`.

Tests cover:

- Stock ticker in heading
- Report type badge
- Section nav labels, by id: `overview` (Summary), `market-outlook` (Market & Analyst Outlook), `key-metrics` (Key Financial Metrics), `analysis` (Full Report), `sig-dev` (Happening Now), `media-mentions` (Expert Coverage), `sector-scores` (Sector Scores)
- Summary section content
- Market & Analyst Outlook: price chart copy and the analyst recommendations bar (counts in `MOCK_FUNDAMENTALS` sum to 35). Copy only; chart data is live (see [Known exception](#known-exception-live-yahoo-price-chart))
- Key Financial Metrics: metric groups (Growth, Profitability, Valuation, Financial Health)
- Key Financial Metrics: fundamentals blocks (Next Quarter EPS, earnings vs estimates with beat/miss, revenue by year, insider activity)
- AI Sentiment Score gauge
- "What's Happening Now" (significant development)
- "What Experts Are Saying" (analyst reports)
- "How It Compares" (sector scores)
- Section nav scroll: clicking a label scrolls the corresponding section into view

### `04-export-report.spec.ts`: PDF export

- Clicking "Export PDF" triggers a file download with filename `AAPL-analysis.pdf`
- A delayed mock verifies the button shows "Generating..." and is disabled during the async operation

### `05-full-flow.spec.ts`: Full happy path

End-to-end: create report → view report → export PDF, all in one test. Also asserts no console errors occur during the entire flow (excluding favicon 404s).

### `06-tokens.spec.ts`: Credits / tokens page

Mocks `credits.get`, `credits.getInvoices`, and `credits.createCheckoutSession`.

- Renders the three packages (Starter / Pro / Expert) with their credit amounts and Buy Now buttons
- Shows the current credit balance
- Clicking Buy Now redirects to the mocked Stripe checkout URL
- Success / cancel banners driven by query params, and the pending payment banner driven by a pending invoice

---

## Running locally

```bash
# Run all tests headlessly (recommended)
pnpm e2e

# Open Playwright UI for visual inspection and debugging
pnpm e2e:ui

# Run with Playwright inspector (step-through debugging)
pnpm e2e:debug
```

All three commands go through `e2e/run.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

# Ports used by the E2E stack: 54321 = mock Supabase/Finnhub, 3001 = Next.js webServer.
PORTS=(54321 3001)

cleanup() {
    command -v lsof >/dev/null 2>&1 || return 0
    for port in "${PORTS[@]}"; do
        local pids
        pids="$(lsof -ti:"$port" 2>/dev/null || true)"
        [ -n "$pids" ] || continue
        kill $pids 2>/dev/null || true
        sleep 0.2
        kill -9 $pids 2>/dev/null || true
    done
}

trap cleanup EXIT
cleanup

playwright test "$@"
```

- `trap cleanup EXIT` fires on both normal exit and Ctrl+C, so ports 54321 and 3001 are always released.
- The leading `cleanup` call frees sockets left open by a previous run that was killed hard.
- Each process gets a graceful `SIGTERM` first, then `SIGKILL` if it ignores it.
- When `lsof` is not installed, cleanup is a no-op instead of failing the run.

### Local vs CI mode

`playwright.config.ts` checks `process.env.CI` to decide the web server command:

| Environment | Command      | Why                                                                     |
| ----------- | ------------ | ----------------------------------------------------------------------- |
| Local       | `pnpm dev`   | No build needed, instant startup                                        |
| CI          | `pnpm start` | Tests the production bundle; built in a separate step before `pnpm e2e` |

`reuseExistingServer: !process.env.CI`: locally, Playwright reuses a running dev server on port 3001 if present.

---

## CI/CD

All workflows run on push to `main` and on pull requests to `main` (`opened`, `synchronize`, `reopened`, `ready_for_review`), except where noted. The Smoke Tests and PR Checks jobs skip draft PRs, and in every workflow a newer push cancels an in-progress PR run (`concurrency`).

### `.github/workflows/e2e.yml` (Smoke Tests)

```
container: mcr.microsoft.com/playwright:v<version>-jammy
checkout → composite setup → restore .next/cache → node --run build → pnpm e2e
```

The job runs inside the **official Playwright container**, which ships Chromium and all its system dependencies pre-installed, pinned to the `@playwright/test` version (currently `v1.61.1-jammy`). This removes the `playwright install --with-deps` / `install-deps` steps and the browser cache. Keep the image tag in sync with the version in `package.json` when upgrading Playwright.

The build step is required because CI uses `pnpm start` (production server). `.next/cache` is cached by lockfile + source hash to speed it up. Env vars for the mock server are set at the workflow level so they are available both to the build (Next.js env validation) and to `pnpm e2e`.

### `.github/workflows/e2e-yahoo.yml` (Yahoo Contract)

Runs the live Yahoo contract test (`pnpm e2e:yahoo`) on pull requests, on a daily cron (06:00 UTC) and on `workflow_dispatch`. It does not run on push to `main`. See [Live Yahoo contract test](#live-yahoo-contract-test).

### `.github/workflows/pr-checks.yml` (PR Checks)

Three parallel jobs, with the same mock env vars as the Smoke Tests workflow:

| Job               | Steps                                       |
| ----------------- | ------------------------------------------- |
| Lint & Knip       | `node --run lint` + `node --run knip`       |
| Unit Tests        | `node --run test`                           |
| Build & Typecheck | `node --run build` + `node --run typecheck` |

### `.github/actions/setup/action.yml`: composite action

Shared setup used by every job (DRY). Installs pnpm (`11.9.0`), Node 24 (with the pnpm cache), and project dependencies (`pnpm install --frozen-lockfile`).

> **Important:** `actions/checkout@v6` is NOT inside the composite action. GitHub Actions needs the repo checked out before it can resolve `./.github/actions/setup`. Each job must run `actions/checkout@v6` first.

---

## File map

```
e2e/
├── mock-server.ts          # node:http server on :54321, fakes Supabase + Finnhub
├── global-setup.ts         # starts mock server, writes auth-state.json
├── global-teardown.ts      # stops mock server
├── run.sh                  # wrapper script: cleanup stale ports + playwright test "$@"
├── fixtures/
│   ├── auth-state.json     # generated on each run, git-ignored
│   └── mock-data.ts        # MOCK_REPORT, MOCK_STOCK_DATA, MOCK_NEWS_ITEMS, etc.
├── support/
│   └── mock-trpc.ts        # page.route() helpers for each tRPC procedure
├── pos/                    # Page Objects: encapsulate data-testid locators per area
│   ├── auth.po.ts
│   ├── analysis-form.po.ts
│   ├── report.po.ts
│   └── tokens.po.ts
└── tests/
    ├── 01-auth.spec.ts
    ├── 02-create-report.spec.ts
    ├── 03-view-report.spec.ts
    ├── 04-export-report.spec.ts
    ├── 05-full-flow.spec.ts
    ├── 06-tokens.spec.ts
    └── yahoo-contract.spec.ts   # LIVE Yahoo API, excluded from the main run (see below)

playwright.config.ts        # root: mocked suite (webServer, globalSetup, storageState)
playwright.yahoo.config.ts  # root: live Yahoo contract test only (no server/mock/browser)
.github/
├── actions/setup/
│   └── action.yml          # composite action: pnpm + node + install
└── workflows/
    ├── e2e.yml             # mocked E2E job in Playwright container (push/PR → main)
    ├── e2e-yahoo.yml       # live Yahoo contract test (PR → main + daily cron + manual dispatch)
    └── pr-checks.yml       # lint + knip / unit / build + typecheck (push/PR → main)
```

---

## Live Yahoo contract test

`e2e/tests/yahoo-contract.spec.ts` is the one spec that deliberately does **not** mock the network: it calls the real `yahoo-finance2` API from the Playwright runner's Node context (no web server, no mock server, no browser, no auth state). It is a drift canary: it mirrors the exact calls and field paths the app consumes (see `src/_bff/modules/yahoo/`) so a Yahoo API change surfaces here instead of in production.

Because it depends on Yahoo being reachable, it is isolated from the mocked suite:

- The main `playwright.config.ts` sets `testIgnore: '**/yahoo-contract.spec.ts'`, so `pnpm e2e` and the `e2e.yml` job never run it.
- It has its own `playwright.yahoo.config.ts` (no `webServer`/`globalSetup`/`storageState`, 60 s timeout) and script `pnpm e2e:yahoo`.
- CI runs it in its own workflow (`.github/workflows/e2e-yahoo.yml`) on PRs, on a daily `schedule` and on `workflow_dispatch`. A Yahoo outage fails only that check, never the Smoke Tests or PR Checks jobs. That workflow needs no Playwright browser install (the test launches none).

Assertion strategy: hard-assert fields that are reliably present for the large-cap ticker (types/keys), and assert shape-only-when-present for volatile arrays (`sigDevs`, `reports`, `insiderTransactions`) to avoid false negatives.

---

## Adding new tests

### 1. Add mock data

Add constants to `e2e/fixtures/mock-data.ts`. Keep data realistic (the report view tests assert on specific text from `MOCK_AI_RESPONSE`, financial metrics from `MOCK_FINANCIALS`, fundamentals from `MOCK_FUNDAMENTALS`, etc.).

### 2. Add a new Supabase table response (if needed)

In `e2e/mock-server.ts`, add a new `if (url.startsWith('/rest/v1/<table>'))` branch **before** the generic `rest/v1` catch-all:

```ts
if (url.startsWith('/rest/v1/my_table')) {
    return respond(res, wantObject ? MOCK_MY_ITEM : [MOCK_MY_ITEM])
}
```

### 3. Add a tRPC mock (if needed)

Add a helper in `e2e/support/mock-trpc.ts`. Use the namespaced procedure path (`<module>.<procedure>`), and a RegExp with a lookahead when the name is a prefix of another procedure (see `mockGetCredits`):

```ts
export async function mockMyProcedure(page: Page, data: MyType) {
    await page.route('**/api/trpc/myModule.myProcedure**', (route) =>
        route.fulfill({ contentType: 'application/json', body: batchResponse(data) })
    )
}
```

### 4. Write the spec

Create `e2e/tests/NN-my-feature.spec.ts` (next number in sequence). Register mocks in `test.beforeEach` or at the top of individual tests. Use `storageState` from the global config (authenticated by default); override with `test.use({ storageState: { cookies: [], origins: [] } })` for unauthenticated flows. Follow the [Selectors](#selectors) rules: locate everything via `getByTestId` through a Page Object in `e2e/pos/`, never `getByRole`/`getByLabelText`/`getByText`/`getByPlaceholder`, and verify copy with `.toContainText(...)` / `.toHaveText(...)`.

If the page renders a server component that calls a service the mock server doesn't cover (like the Yahoo price chart), make sure it degrades gracefully and don't assert on its live data.
