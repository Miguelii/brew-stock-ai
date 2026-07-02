# BrewStockAI

AI-powered stock analysis — get institutional-grade financial insights, market sentiment, and technical indicators for any equity. For less than a coffee ☕

## Technical Tools

Some cool highlighted tools this project uses:

- **[Effect](https://effect.website):** a powerful TypeScript library designed to help developers easily create complex, synchronous, and asynchronous programs.
- **[tRPC](https://trpc.io):** end-to-end typesafe APIs, used to expose Effect services to the client.
- **[Trigger.dev](https://trigger.dev):** background job processing for long-running AI analysis tasks.
- **[Supabase](https://supabase.com):** Postgres database with auth and real-time capabilities.
- **[Vercel AI SDK](https://sdk.vercel.ai):** streaming AI responses with structured output using Claude (Anthropic).
- **[TanStack Query](https://tanstack.com/query):** server state management and caching on the client.
- **[Puppeteer](https://pptr.dev):** headless browser used to generate PDF exports of analysis reports.

## Code Quality Tools

This project uses automated code quality tools to maintain consistency:

- **[vite-plus](https://github.com/vite-plus/vite-plus):** unified toolchain that bundles linting, formatting and testing:
    - **oxlint:** Rust-based linter (replaces ESLint)
    - **oxfmt:** Rust-based code formatter (replaces Prettier)
    - **Vitest:** unit testing
- **[Knip](https://knip.dev):** detects unused files, exports, and dependencies.
- **TypeScript:** provides type safety.
- **[Husky](https://typicode.github.io/husky):** runs pre-commit hooks automatically.

## How It Works

```mermaid
flowchart TD
    U["User"] -->|"ticker + prompt"| UI["Next.js Client"]

    subgraph API["tRPC API"]
        UI --> CR["reports.create"]
    end

    PG[("Supabase / Postgres")]
    TQ[["Trigger.dev Queue"]]

    CR -->|"insert report (GENERATING)\ndeduct credits"| PG
    CR --> TQ
    CR -.->|"reportId returned immediately"| UI

    subgraph BG["Background Job (Trigger.dev)"]
        JOB["process-report Job"] --> ANALYSIS["getStockAnalysis"]

        subgraph YF["Yahoo Finance"]
            YAHOO["fundamentals · scores · reports"]
            PRICE["price history\n→ technical indicators"]
        end

        ANALYSIS --> YAHOO
        ANALYSIS --> PRICE
        ANALYSIS --> FINNHUB["Finnhub\nnews"]

        ANALYSIS --> AI{{"AI Analysis using Claude"}}
        AI --> SAVE["Save analysis + sentiment"]
        SAVE --> PUSH["Push notification"]
    end

    TQ --> JOB
    JOB -.->|"on failure"| FAIL["mark FAILED\n+ refund credits"]
    FAIL --> PG
    YAHOO -.->|"TTL cache"| PG
    SAVE -->|"persist"| PG

    PUSH -.-> U
    UI -->|"poll while GENERATING\nread report"| PG
```

## Credits & Payments

```mermaid
flowchart TD
    U["User"] -->|"buy credit package"| CHK["credits.createCheckoutSession"]
    CHK --> STRIPE["Stripe Checkout"]
    STRIPE -->|"webhook\n(signature verified)"| WH["/api/webhooks/stripe"]

    PG[("Supabase / Postgres")]

    WH -->|"claim event_id\n(idempotency)"| PG
    WH -->|"add_credits RPC"| PG

    U -->|"create report"| SPEND["deduct credits"]
    SPEND --> PG

    JOB["process-report Job"] -.->|"on failure\nrefund credits"| PG
```
