# React Improvement Plans

Produced by an `improve-react` audit at commit `9332d06` (2026-07-14), using react-doctor 0.7.8 as evidence (baseline score **43/100**, 12 errors / 53 warnings — roughly half were vetted as false positives on this codebase; see below). Plans are self-contained: any agent can execute one without the audit conversation. Each plan carries its own verification section; re-run `npx react-doctor@latest --scope changed` after each.

## Execution order & status

| Order | Plan                                                                                  | Severity | Status | Depends on                        |
| ----- | ------------------------------------------------------------------------------------- | -------- | ------ | --------------------------------- |
| 2     | [001-cookie-consent-gtag-crash](001-cookie-consent-gtag-crash.md)                     | HIGH     | TODO   | —                                 |
| 3     | [002-public-header-scroll-state](002-public-header-scroll-state.md)                   | MED-HIGH | TODO   | —                                 |
| 4     | [004-lazy-motion-bundle](004-lazy-motion-bundle.md)                                   | MEDIUM   | TODO   | 002 (same file: public-header)    |
| 5     | [005-hydration-state-sync-external-store](005-hydration-state-sync-external-store.md) | MEDIUM   | TODO   | —                                 |
| 6     | [006-stock-price-chart-purity](006-stock-price-chart-purity.md)                       | MEDIUM   | TODO   | —                                 |
| 7     | [007-hygiene-sweep](007-hygiene-sweep.md)                                             | LOW      | TODO   | 002, 004, 006 (overlapping files) |

001 next as the only user-facing bug. 005 and 006 are independent and can run in any order after 001.

## Vetted false positives (do NOT "fix" these)

- `supabase-client-owned-authz-field` ×5 — all in `_bff` server-side services/repositories; the rule targets browser-side Supabase writes.
- `unused-file` on `src/hooks/use-mobile.ts` — imported by `src/components/ui/sonner.tsx`.
- `prefer-dynamic-import` on recharts — already lazy via `stock-price-chart/lazy.tsx`.
- `url-prefilled-privileged-action` on the auth callback — `safeRedirectUrl` already enforces same-origin.
- `js-combine-iterations` ×6, `no-array-index-as-key` ×4, `only-export-components` (shadcn CVA convention), `no-giant-component` (vendored Aceternity component), `js-hoist-intl` (`currency` is a parameter; cold path), `rerender-defer-reads-hook` (single-route component) — reviewed and rejected as noise.
