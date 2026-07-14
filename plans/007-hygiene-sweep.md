# 007 — Hygiene sweep: button types, dead memoization, JSON-LD escaping

- **Status**: TODO
- **Commit**: 9332d06
- **Severity**: LOW
- **Category**: Maintainability & architecture (+ minor Bugs/Security hardening)
- **Rule**: react-doctor/button-has-type, react-doctor/react-compiler-no-manual-memoization, react-doctor/unsafe-json-in-html
- **Estimated scope**: 7 files, all mechanical edits

> **Dependency**: run AFTER plans 002, 004, and 006 — this plan touches `report-section-nav`, `education-hub-list`, and files those plans also edit. Public-header's `button-has-type` (line 102) and stock-price-chart's `useMemo`s are handled there, NOT here.

## Problem & Target, per group

### A. `<button>` without `type` (canonical fix: explicit `type="button"` — none of these submit a form)

Add `type="button"` as the first attribute of each flagged button, e.g.:

```tsx
// current                                    // target
<button                                       <button
    aria-label="Open menu"                        type="button"
    onClick={() => setOpen(true)}                 aria-label="Open menu"
                                                  onClick={() => setOpen(true)}
```

Locations:

- `src/components/header/mobile-menu.tsx:38` (open menu), `:65` (close menu, inside `DrawerClose asChild`), `:115` (logout)
- `src/components/ui/prompt-card.tsx:38` (dismiss X)
- `src/modules/report-view/report-section-nav/index.tsx:50` (mobile dropdown toggle — also add `aria-expanded={isOpen}` here, matching the disclosure pattern from plan 002), `:66` (dropdown item), `:89` (desktop section button)

### B. Dead manual memoization under React Compiler (canonical fix: unwrap to the plain expression)

`reactCompiler: true` is set in `next.config.ts`; the compiler auto-memoizes every value and function, so these wrappers are redundant noise. All resolve to React's official hooks (validated — no lookalikes):

```tsx
// src/components/header/mobile-menu.tsx:27-30 — current → target
const onClickHandler = useCallback(() => {        const onClickHandler = () => {
    logout.mutate()                                   logout.mutate()
    setOpen(false)                                    setOpen(false)
}, [logout])                                      }
```

- `src/components/header/mobile-menu.tsx:27` — `onClickHandler` as above.
- `src/modules/admin/logs/logs-explorer.tsx:39` (`counts`) and `:51` (`filtered`) — unwrap both `useMemo(() => expr, [deps])` to `const x = expr` (keep the tally-building block as an IIFE-free plain block: compute `tally` in a small module-scope helper `function countByLevel(logs: AdminLog[])` and call it, or inline the loop before the return — pick the first: module-scope pure helper).
- `src/modules/education-hub/education-hub-list/index.tsx:25` (`sorted`) — this depends only on the module constant `EDUCATION_HUB_ARTICLES`; hoist it to module scope: `const SORTED_ARTICLES = EDUCATION_HUB_ARTICLES.toSorted((a, b) => b.publishedAt.localeCompare(a.publishedAt))` next to `FILTERS`. `:30` (`visible`) — unwrap to `const visible = active === 'all' ? SORTED_ARTICLES : SORTED_ARTICLES.filter((a) => a.theme === active)`.
- `src/modules/report-view/report-section-nav/index.tsx:34` (`closeDropdown`) — `const closeDropdown = () => setIsOpen(false)`.
- `src/modules/report-view/report-section-nav/use-active-section.ts:31` (`scrollTo`) — unwrap the `useCallback` to a plain arrow function; the hook's return shape `[activeId, scrollTo] as const` stays.
- Remove the now-unused `useCallback`/`useMemo` names from each react import.

### C. JSON-LD `JSON.stringify` without HTML escaping (canonical fix: escape `<`, `>`, `&`)

All 7 schema components in `src/components/structured-data/index.tsx` (lines 27, 47, 83, 135, 160, 189, 212) do:

```tsx
dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
```

The data is developer-authored today, but `ArticleSchema`/`FAQSchema`/`FinancialProductSchema`/`BreadcrumbSchema` take props — a future caller passing content containing `</script>` breaks out of the tag. Add one module-private helper (colocated: single-module consumer, per repo formatter-placement rule) and use it in all 7 places:

```tsx
// target — module-private, above OrganizationSchema
// JSON.stringify does not HTML-escape; a `</script>` or `<` in the data would
// break out of the script tag, so escape the three dangerous characters.
function jsonLdHtml(schema: object): { __html: string } {
    return {
        __html: JSON.stringify(schema)
            .replace(/</g, '\\u003c')
            .replace(/>/g, '\\u003e')
            .replace(/&/g, '\\u0026'),
    }
}
```

```tsx
// each of the 7 script tags
dangerouslySetInnerHTML={jsonLdHtml(organizationSchema)}
```

Do NOT export the helper (would trip `only-export-components`).

## Repo conventions to follow

- English-only identifiers; `@/` alias imports; 4-space indent.
- Colocation rule from CLAUDE.md: the JSON-LD helper stays private in `structured-data/index.tsx` until a second module needs it.

## Steps

1. Group A: add `type="button"` to the 7 buttons listed (plus `aria-expanded` on section-nav line 50).
2. Group B: unwrap the 6 memoization sites listed; hoist `SORTED_ARTICLES`; add the `countByLevel` module-scope helper in logs-explorer; clean up react imports.
3. Group C: add `jsonLdHtml` and replace the 7 `dangerouslySetInnerHTML` values.
4. Re-read the full diff and drop any unrelated churn.

## Boundaries

- Do NOT touch `public-header/index.tsx` or `stock-price-chart/index.tsx` (owned by plans 002/006).
- Do NOT change any schema content, button behavior, filter logic, or sort order.
- Do NOT add dependencies (`serialize-javascript`/`devalue` alternatives from the canonical prompt are overkill here).
- STOP if any file has drifted from commit 9332d06 beyond plans 002/004/006's expected changes; report the drift.

## Verification

- **Mechanical**:
    - `npx react-doctor@latest --scope changed` — the listed `button-has-type`, `react-compiler-no-manual-memoization`, and `unsafe-json-in-html` diagnostics clear; score does not regress.
    - `pnpm check` and `pnpm test` pass.
- **Behavior check**:
    - Mobile menu (app header): open, close, logout still work.
    - `/education-hub`: theme filters still show the right articles, newest first.
    - Report page section nav: dropdown (mobile) and section buttons (desktop) still scroll/highlight.
    - View source on `/` and validate the JSON-LD blocks parse (paste into https://validator.schema.org or `JSON.parse` the script contents in DevTools) — escaped `<` sequences are valid JSON and Google-compatible.
    - Admin `/logs`: level filters and counts unchanged.
- **Done when**: all listed diagnostics clear, checks pass, and the five behavior checks match current behavior.
