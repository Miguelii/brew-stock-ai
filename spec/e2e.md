# Smoke (E2E) Test Suite

Playwright-based end-to-end tests that run against the full Next.js application with **zero real database or external API calls**. Everything is intercepted by a local mock server or Playwright's `page.route()`.

---

## Table of Contents

1. [Why full mock?](#why-full-mock)
2. [Architecture](#architecture)
3. [Startup sequence](#startup-sequence)
4. [Mock server](#mock-server)
5. [Auth — fake cookies](#auth--fake-cookies)
6. [tRPC mocking](#trpc-mocking)
7. [Selectors](#selectors)
8. [Test suites](#test-suites)
9. [Running locally](#running-locally)
10. [CI/CD](#cicd)
11. [File map](#file-map)
12. [Adding new tests](#adding-new-tests)

---

## Why full mock?

The report page (`/reports/[id]`) is **server-rendered**. The Effect services `getReportById` and `getSession` make HTTP calls from the **Node.js process** (not the browser) to Supabase. Playwright's `page.route()` only intercepts browser requests — it has no visibility into server-side fetches.

Two layers of interception are therefore needed:

| Layer                        | What it intercepts                                                 | Mechanism                                    |
| ---------------------------- | ------------------------------------------------------------------ | -------------------------------------------- |
| **Mock server** (port 54321) | Server-side requests from Next.js → Supabase REST + Auth + Finnhub | `node:http` server started in `globalSetup`  |
| **`page.route()`**           | Browser-side tRPC calls                                            | Playwright route handler registered per-test |

The Next.js dev/prod server is pointed at the mock server via env vars in `playwright.config.ts` `webServer.command`.

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
  │    ├─ 01-auth.spec.ts        page.route() → tRPC sendOtp / verifyOtp
  │    ├─ 02-create-report.spec  page.route() → tRPC getCredits / createReport
  │    ├─ 03-view-report.spec    page.route() → tRPC getLatestNews
  │    │                         mock server  → Supabase reports + stock_data
  │    ├─ 04-export-report.spec  page.route() → tRPC exportReport
  │    ├─ 05-full-flow.spec      all of the above combined
  │    └─ 06-tokens.spec         page.route() → tRPC credits.*
  │
  └─ globalTeardown
       └─ stopMockSupabase()  →  port 54321 closed
```

---

## Mock server

**File:** `e2e/mock-server.ts`

A plain `node:http` server — no extra dependencies. Started on `127.0.0.1:54321` before Playwright launches the Next.js web server.

### Routes

| URL prefix                     | Response                                                                          |
| ------------------------------ | --------------------------------------------------------------------------------- |
| `GET /auth/v1/user`            | `MOCK_USER` object (authenticated user)                                           |
| `*  /auth/v1/*`                | `{}` (catch-all for token refresh etc.)                                           |
| `GET /api/v1/company-news*`    | `MOCK_NEWS_ITEMS[]` (Finnhub proxy)                                               |
| `GET /rest/v1/reports*`        | `MOCK_REPORT` (object if `Accept: application/vnd.pgrst.object+json`, else array) |
| `GET /rest/v1/stock_data*`     | `MOCK_STOCK_DATA` (same object/array logic)                                       |
| `GET /rest/v1/*`               | `[]` or `{}` (catch-all for other tables)                                         |
| `POST/PATCH/DELETE /rest/v1/*` | `{}`                                                                              |

### Shutdown behaviour

`stopMockSupabase` calls `server.closeAllConnections()` before `server.close()`. This force-drains keep-alive connections that Next.js holds open, which would otherwise prevent the `close()` callback from firing and leave `pnpm e2e` hanging.

The teardown always resolves — if the server was already closed by a SIGINT handler, `ERR_SERVER_NOT_RUNNING` is silently ignored.

### SIGINT / SIGTERM handling

`globalSetup` registers `process.once('SIGINT', forceClose)` and `process.once('SIGTERM', forceClose)` immediately after the server starts. This ensures the socket is released even when Ctrl+C is pressed before `globalTeardown` runs.

`process.once` (not `on`) is intentional — it does not shadow Playwright's own signal handler.

---

## Auth — fake cookies

**File:** `e2e/global-setup.ts`

No browser, no magic link, no Supabase Admin API. `globalSetup` generates fake cookies entirely in Node.js and writes them to `e2e/fixtures/auth-state.json`.

### Cookie derivation

`@supabase/ssr` derives the storage key from the Supabase URL hostname:

```
NEXT_SUPABASE_URL=http://localhost:54321
→ hostname: "localhost"
→ cookie name: "sb-localhost-auth-token.0"   (chunk 0 — session fits in one chunk)
```

The cookie value is:

```
"base64-" + base64url(JSON.stringify(session))
```

where `session` is a minimal Supabase session object containing a fake JWT and a mock user.

### Fake JWT

The JWT is **not validated** by the mock server — it just reads `auth.users` via the `/auth/v1/user` route which always returns `MOCK_USER`. The JWT is only needed to satisfy Supabase SSR client cookie parsing.

```
header  = base64url({"alg":"HS256","typ":"JWT"})
payload = base64url({"sub":"pw-test-user-id","email":"playwright@test.local","role":"authenticated","exp":<now+1year>})
sig     = "bW9jaw"   (static mock bytes — never verified)
```

### Why `auth-state.json` is git-ignored

The file contains `expires_at` computed from `Date.now()`, so it changes on every test run. It is regenerated by `globalSetup` before each run. The `.gitignore` entry is `/e2e/fixtures/auth-state.json`.

`playwright.config.ts` ensures an empty placeholder exists at startup (for `--ui` mode, which reads the config before `globalSetup` runs):

```ts
if (!existsSync(AUTH_STATE_PATH)) {
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

Each helper registers a `page.route()` handler that fulfills matching tRPC requests with the expected shape:

```ts
export async function mockGetCredits(page: Page, credits = MOCK_CREDITS) {
    // RegExp with a lookahead so `credits.get` never swallows `credits.getInvoices`
    await page.route(/\/api\/trpc\/credits\.get(?![A-Za-z])/, (route) =>
        route.fulfill({ contentType: 'application/json', body: batchResponse(credits) })
    )
}
```

These intercept **browser-side** calls only. Server-side tRPC calls (from RSC/Server Actions) go through the mock server instead.

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

- **Interactive elements (inputs, selects, buttons that tests act on) must be located via `data-testid` + `getByTestId`.** Add the `data-testid` attribute to the component when it doesn't have one yet.
- **Never use `getByPlaceholder`** — placeholders are UI copy and change without warning.
- **Never target library-internal attributes** (e.g. `[data-input-otp="true"]`, `[data-slot]`) — they are implementation details of third-party packages.
- `getByRole` / `getByText` remain acceptable for **asserting visible content** (headings, banners, copy) — that is what those tests are meant to verify.

Existing test ids: `email-input`, `sign-in-button`, `otp-input` (auth), `ticker-input`, `analysis-type-select`, `generate-report-button` (analysis form), `export-pdf-button` (report view).

---

## Test suites

All suites run sequentially (`workers: 1`, `fullyParallel: false`) to avoid port conflicts.

### `01-auth.spec.ts` — Auth flow

Runs **without** the global `storageState` (no cookies — unauthenticated).

- Shows email input on `/auth`
- Transitions to OTP step after submitting email (mocks `sendOtp`)
- Navigates away from `/auth` after confirming OTP (mocks `sendOtp` + `verifyOtp`)

Note: `input-otp` renders a hidden `<input data-input-otp="true">` that captures keystrokes. Tests use `page.keyboard.type('123456')` rather than clicking individual slot divs.

### `02-create-report.spec.ts` — Create report

- Renders the analysis form
- Fills ticker + selects analysis type via combobox → submits
- Expects a "being generated" toast → redirect to `/reports`

### `03-view-report.spec.ts` — View report page

The most comprehensive suite. The report page is fully server-rendered using data from the mock server.

Tests cover:

- Stock ticker in heading
- Report type badge
- Section nav labels (Summary, Key Financial Metrics, Full AI Report, Happening Now, Expert Coverage, Sector Scores)
- Summary section content
- Key Financial Metrics section (sub-headings, groups)
- AI Sentiment Score gauge
- "What's Happening Now" (significant development)
- "What Experts Are Saying" (analyst reports)
- "How It Compares" (sector scores)
- Section nav scroll: clicking a label scrolls the corresponding section into view

### `04-export-report.spec.ts` — PDF export

- Clicking "Export PDF" triggers a file download with filename `AAPL-analysis.pdf`
- A delayed mock verifies the button shows "Generating..." and is disabled during the async operation

### `05-full-flow.spec.ts` — Full happy path

End-to-end: create report → view report → export PDF, all in one test. Also asserts no console errors occur during the entire flow (excluding favicon 404s).

### `06-tokens.spec.ts` — Credits / tokens page

Mocks `credits.get`, `credits.getInvoices`, and `credits.createCheckoutSession`.

- Renders the three packages (Starter / Pro / Expert) with their credit amounts and Buy Now buttons
- Shows the current credit balance
- Clicking Buy Now redirects to the mocked Stripe checkout URL
- Success / cancel / pending payment banners driven by query params

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
cleanup() {
    lsof -ti:54321 -ti:3001 2>/dev/null | xargs kill -9 2>/dev/null || true
}
trap cleanup EXIT   # fires on both normal exit AND Ctrl+C
cleanup             # kill any stale processes from a previous interrupted run
playwright test "$@"
```

The `trap cleanup EXIT` ensures ports 54321 and 3001 are always released, even after `Ctrl+C`. The leading `cleanup` call handles the case where a previous run was killed hard and left sockets open.

### Local vs CI mode

`playwright.config.ts` checks `process.env.CI` to decide the web server command:

| Environment | Command      | Why                                                                     |
| ----------- | ------------ | ----------------------------------------------------------------------- |
| Local       | `pnpm dev`   | No build needed — instant startup                                       |
| CI          | `pnpm start` | Tests the production bundle; built in a separate step before `pnpm e2e` |

`reuseExistingServer: !process.env.CI` — locally, Playwright reuses a running dev server on port 3001 if present.

---

## CI/CD

### `.github/workflows/e2e.yml`

Triggered on pull requests to `main`.

```
checkout → composite setup → playwright install chromium → pnpm build → pnpm e2e
```

The build step is required because CI uses `pnpm start` (production server). Env vars for the mock server are set at the job level so they are available both to `pnpm build` (Next.js env validation) and to `pnpm e2e`.

### `.github/workflows/pr-checks.yml`

Four parallel jobs on every PR to `main`:

| Job         | Steps                           |
| ----------- | ------------------------------- |
| Lint & Knip | `pnpm lint` + `pnpm knip`       |
| Typecheck   | `pnpm build` + `pnpm typecheck` |
| Unit Tests  | `pnpm test`                     |
| Build       | `pnpm build`                    |

### `.github/actions/setup/action.yml` — composite action

Shared setup used by every job (DRY). Installs pnpm, Node 22, and project dependencies.

> **Important:** `actions/checkout@v6 is NOT inside the composite action. GitHub Actions needs the repo checked out before it can resolve `./.github/actions/setup`. Each job must run `actions/checkout@v6` first.

---

## File map

```
e2e/
├── mock-server.ts          # node:http server on :54321 — fakes Supabase + Finnhub
├── global-setup.ts         # starts mock server, writes auth-state.json
├── global-teardown.ts      # stops mock server
├── run.sh                  # wrapper script: cleanup stale ports + playwright test "$@"
├── fixtures/
│   ├── auth-state.json     # generated on each run — git-ignored
│   └── mock-data.ts        # MOCK_REPORT, MOCK_STOCK_DATA, MOCK_NEWS_ITEMS, etc.
├── support/
│   └── mock-trpc.ts        # page.route() helpers for each tRPC procedure
└── tests/
    ├── 01-auth.spec.ts
    ├── 02-create-report.spec.ts
    ├── 03-view-report.spec.ts
    ├── 04-export-report.spec.ts
    ├── 05-full-flow.spec.ts
    └── 06-tokens.spec.ts

playwright.config.ts        # root — Playwright config, webServer, storageState
.github/
├── actions/setup/
│   └── action.yml          # composite action: pnpm + node + install
└── workflows/
    ├── e2e.yml             # E2E job (PR → main)
    └── pr-checks.yml       # lint / typecheck / unit / build (PR → main)
```

---

## Adding new tests

### 1. Add mock data

Add constants to `e2e/fixtures/mock-data.ts`. Keep data realistic (the report view tests assert on specific text from `MOCK_AI_RESPONSE`, financial metrics from `MOCK_FINANCIALS`, etc.).

### 2. Add a new Supabase table response (if needed)

In `e2e/mock-server.ts`, add a new `if (url.startsWith('/rest/v1/<table>'))` branch **before** the generic `rest/v1` catch-all:

```ts
if (url.startsWith('/rest/v1/my_table')) {
    return respond(res, wantObject ? MOCK_MY_ITEM : [MOCK_MY_ITEM])
}
```

### 3. Add a tRPC mock (if needed)

Add a helper in `e2e/support/mock-trpc.ts`:

```ts
export async function mockMyProcedure(page: Page, data: MyType) {
    await page.route('**/api/trpc/myProcedure**', (route) =>
        route.fulfill({ contentType: 'application/json', body: batchResponse(data) })
    )
}
```

### 4. Write the spec

Create `e2e/tests/NN-my-feature.spec.ts` (next number in sequence). Register mocks in `test.beforeEach` or at the top of individual tests. Use `storageState` from the global config (authenticated by default) — override with `test.use({ storageState: { cookies: [], origins: [] } })` for unauthenticated flows. Follow the [Selectors](#selectors) rules — `data-testid` for interactive elements, never `getByPlaceholder`.
