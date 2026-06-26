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

## Scripts

### 🚀 Development

| Command          | Description                                                |
| ---------------- | ---------------------------------------------------------- |
| `pnpm dev`       | Start the Next.js dev server                               |
| `pnpm dev:low`   | Dev server with reduced memory (`max-old-space-size=2048`) |
| `pnpm dev:https` | Dev server over HTTPS (experimental)                       |

### 📦 Build & Production

| Command      | Description                |
| ------------ | -------------------------- |
| `pnpm build` | Create a production build  |
| `pnpm start` | Serve the production build |

### ✨ Code Quality

| Command          | Description                                  |
| ---------------- | -------------------------------------------- |
| `pnpm lint`      | Lint with oxlint (via vite-plus)             |
| `pnpm fmt`       | Format with oxfmt                            |
| `pnpm typecheck` | Type-check with `tsc --noEmit`               |
| `pnpm check`     | Lint **and** typecheck in one go             |
| `pnpm knip`      | Find unused files, exports, and dependencies |

### 🧪 Testing

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `pnpm test`       | Run unit tests once (Vitest)         |
| `pnpm test:watch` | Run unit tests in watch mode         |
| `pnpm e2e`        | Run end-to-end tests (Playwright)    |
| `pnpm e2e:ui`     | Run e2e tests with the Playwright UI |
| `pnpm e2e:debug`  | Run e2e tests in debug mode          |

### ⚙️ Background Jobs (Trigger.dev)

| Command               | Description                            |
| --------------------- | -------------------------------------- |
| `pnpm trigger:dev`    | Run the Trigger.dev dev server locally |
| `pnpm trigger:deploy` | Deploy Trigger.dev tasks               |
