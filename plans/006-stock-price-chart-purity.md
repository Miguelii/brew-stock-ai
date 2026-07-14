# 006 — Remove Date.now() from StockPriceChart render (purity) + drop dead memoization

- **Status**: TODO
- **Commit**: 9332d06
- **Severity**: MEDIUM
- **Category**: Bugs & correctness / Performance
- **Rule**: react-hooks-js/purity (+ react-doctor/react-compiler-no-manual-memoization on the same file)
- **Estimated scope**: 1 file (`src/modules/report-view/report-market-outlook-card/stock-price-chart/index.tsx`), ~15 changed lines

## Problem

The stock price chart — on the core report page — calls `Date.now()` inside a `useMemo` during render:

```tsx
// src/modules/report-view/report-market-outlook-card/stock-price-chart/index.tsx:49-65 — current
const filtered = useMemo(() => {
    if (!data) return []
    const cutoff = Date.now() - RANGE_DAYS[range] * 86_400_000 // ← impure during render
    return data.filter((p) => p.date >= cutoff)
}, [data, range])

const monthTicks = useMemo(() => {
    const seen = new Set<string>()
    return filtered
        .filter(({ date }) => {
            const key = new Date(date).toISOString().slice(0, 7)
            if (seen.has(key)) return false
            seen.add(key)
            return true
        })
        .map(({ date }) => date)
}, [filtered])
```

Nondeterministic APIs in the render body break the purity contract that hydration, React Compiler memoization, and StrictMode double-invocation rely on — the compiler bails out of memoizing this component. Both `useMemo` wrappers are additionally dead weight under React Compiler (`reactCompiler: true` in `next.config.ts`).

## Target

Canonical recipe (react-hooks-js `purity`, "values needed once per mount"): defer the impure read into a `useState` lazy initializer. The chart's data is fixed per report, so a per-mount timestamp is semantically identical to today's behavior. With the compiler auto-memoizing, the `useMemo` wrappers are removed rather than rewritten:

```tsx
// target — lines 46-65 region
export function StockPriceChart({ data, low, high }: Props) {
    const [range, setRange] = useState<Range>('1Y')
    // Impure read deferred to mount; render stays deterministic (purity rule).
    const [now] = useState(() => Date.now())

    const cutoff = now - RANGE_DAYS[range] * 86_400_000
    const filtered = data ? data.filter((p) => p.date >= cutoff) : []

    const seen = new Set<string>()
    const monthTicks = filtered
        .filter(({ date }) => {
            const key = new Date(date).toISOString().slice(0, 7)
            if (seen.has(key)) return false
            seen.add(key)
            return true
        })
        .map(({ date }) => date)

    // ...rest of the component unchanged
```

Remove `useMemo` from the react import (keep `useState`).

## Repo conventions to follow

- Preserve the existing early-return empty state (`if (!data?.length)`) and all chart JSX untouched.
- 4-space indent, no relative imports.

## Steps

1. In `stock-price-chart/index.tsx`, add `const [now] = useState(() => Date.now())` under the `range` state.
2. Replace the two `useMemo` blocks with the plain derivations shown in Target.
3. Update the react import to drop `useMemo`.
4. Re-read the diff: props, JSX, and the filtering semantics must be identical.

## Boundaries

- Do NOT change `RANGE_DAYS`, `RANGES`, the tooltip, or any recharts props.
- Do NOT touch `lazy.tsx` / `server.tsx` / `skeleton.tsx` siblings (the lazy-loading setup is correct as-is).
- Do NOT add dependencies.
- STOP if the file has drifted from commit 9332d06; report the drift instead of improvising.

## Verification

- **Mechanical**:
    - `npx react-doctor@latest --scope changed` — the `purity` diagnostic and this file's `react-compiler-no-manual-memoization` warnings clear; score does not regress.
    - `pnpm check` and `pnpm test` pass.
- **Behavior check**: open any report (e.g. the `/example-report` page) — the chart renders, and switching the range buttons (1M/6M/1Y…) refilters the series exactly as before, with month ticks still deduplicated. In React DevTools Profiler, confirm clicking a range button re-renders only the chart subtree.
- **Done when**: diagnostics clear, checks pass, and range switching behaves identically.
