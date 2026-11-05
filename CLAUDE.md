@AGENTS.md

# Project Conventions

## Language

**ALL code must be written in English, no exceptions.**

This includes: variable names, function names, type names, constants, file names, code comments, JSDoc, inline strings used as identifiers (cache keys, error tags, enum values), and any other code artifact.

Human-facing UI copy and documentation may be in any language, but **everything inside `.ts` / `.tsx` files must be English.**

## General Rules

- Do not start a dev server unless explicitly asked
- Use always pnpm
- NEVER use em-dashes ("—") in any writing: UI copy, code comments, docs, commit messages. Rephrase with commas, colons, parentheses, or separate sentences instead
- For shadcn components ALWAYS use `base-ui`, NEVER `radix-ui`
- When creating any kind of function or component, if you need to declare a type, those declarations always go at the beginning of the file. NEVER declare a type and leave it in the middle of the file.

## Imports: ALWAYS use the `@/` alias

**Never** use relative imports (`./`, `../`). **Always** use the `@/` path alias for every import within `src/`:

```tsx
// ❌ Wrong: relative paths
import { getSession } from './get-session'
import { getStockAnalysis } from '../analysis/get-stock-analysis'

// ✅ Correct: alias paths
import { getSession } from '@/_bff/modules/auth/get-session'
import { getStockAnalysis } from '@/_bff/modules/analysis/processors/get-stock-analysis.processor'
```

This applies to all files: services, components, modules, helpers, types, etc. No exceptions.

## Services (Effect-TS)

All services must use Effect-TS. Follow this pattern (supabase only as example):

```typescript
import { Effect } from 'effect'
import { createDBServerClient } from '@/_bff/core/db'
import { CreateSbClientError, SomeError } from '@/_bff/lib/errors'
import { ErrorCode } from '@/_bff/lib/error-codes'

export const myService = Effect.fn('myService')(function* (param: string) {
    const supabase = yield* Effect.tryPromise({
        try: () => createDBServerClient(),
        catch: (cause) => new CreateSbClientError({ cause, error_hash: ErrorCode.SOME_UNIQUE_CODE }),
    })

    const { data, error } = yield* Effect.tryPromise({
        try: () => supabase.from('table').select('*'),
        catch: (cause) => new SomeError({ cause, error_hash: ErrorCode.SOME_UNIQUE_CODE }),
    })

    if (error) {
        return yield* new SomeError({ cause: error, error_hash: ErrorCode.SOME_UNIQUE_CODE })
    }

    return data
})
```

The project is on **Effect v4**. Translate v3 snippets from older docs or the `effect-ts` skill before using them: `Effect.catchAll` / `Effect.orElse` → `Effect.catch`, `Effect.catchAllCause` → `Effect.catchCause`, `Effect.fork` → `Effect.forkChild`, `Effect.zipRight` → `Effect.andThen`, `Either` / `Effect.either` → `Result` / `Effect.result`, and `Cause` is a flat `cause.reasons` array (`Cause.findErrorOption`, `Cause.isDieReason`). Full guide: `https://github.com/Effect-TS/effect/blob/main/MIGRATION.md`

### Rules
- Use `Effect.fn('serviceName')` for automatic telemetry
- All errors must extend `Data.TaggedError` and live in `src/_bff/lib/errors.ts`
- Every error must have `cause: unknown` and `error_hash: ErrorCode` fields
- `error_hash` must be an `ErrorCode` member defined in `src/_bff/lib/error-codes.ts` (e.g. `ErrorCode.REPORT_CREATE_SB_CLIENT`)
- Use `return yield*` when failing (makes termination explicit)
- Never use try-catch inside `Effect.gen`, Effect failures are not thrown
- If Supabase queries, always check both the `Effect.tryPromise` catch AND the `error` field returned

## tRPC: controllers, services, repositories (NestJS-style layering)

Each tRPC route is a **controller**: a thin binding in
`src/_bff/modules/<module>/controllers/<name>.controller.ts` that delegates to an exported
**service** in `services/<name>.service.ts`. Data access lives in **repositories**
(`repositories/<table>.repository.ts`).

```typescript
// 1) src/_bff/modules/credits/services/get-credits.service.ts: exported business logic
import { Effect } from 'effect'
import { createDBServerClient } from '@/_bff/core/db'
import { CreateSbClientError } from '@/_bff/lib/errors'
import { ErrorCode } from '@/_bff/lib/error-codes'
import { selectCredits } from '@/_bff/modules/credits/repositories/credits.repository'
import type { User } from '@supabase/supabase-js'

export const getCredits = Effect.fn('getCredits')(function* (user: User) {
    const supabase = yield* Effect.tryPromise({
        try: () => createDBServerClient(),
        catch: (cause) =>
            new CreateSbClientError({ cause, error_hash: ErrorCode.TOKENS_GET_SB_CLIENT }),
    })

    return yield* selectCredits(supabase, user.id)
})
```

```typescript
// 2) src/_bff/modules/credits/repositories/credits.repository.ts: exported data access
export const selectCredits = Effect.fn('selectCredits')(function* (
    supabase: SupabaseClient,
    userId: string
) {
    const { data, error } = yield* Effect.tryPromise({
        try: () =>
            supabase.from('user_credits').select('credits').eq('user_id', userId).maybeSingle(),
        catch: (cause) => new GetCreditsError({ cause, error_hash: ErrorCode.TOKENS_GET_FETCH }),
    })

    if (error) {
        return yield* new GetCreditsError({ cause: error, error_hash: ErrorCode.TOKENS_GET_FETCH })
    }

    return (data?.credits ?? 0) as number
})
```

```typescript
// 3) src/_bff/modules/credits/controllers/get-credits.controller.ts: thin tRPC binding
import { Match } from 'effect'
import { protectedProcedure } from '@/_bff/trpc/server'
import { runEffect } from '@/_bff/trpc/utils'
import { getCredits } from '@/_bff/modules/credits/services/get-credits.service'

export const GET_CREDITS_PROTECTED_CONTROLLER = protectedProcedure
    .query(({ ctx }) =>                                 // or .input(z.object({...})).mutation(({ input, ctx }) => ...)
        runEffect(getCredits(ctx.user), 'getCredits', (error) =>
            Match.value(error).pipe(
                Match.tag('CreateSbClientError', () => 'INTERNAL_SERVER_ERROR' as const),
                Match.tag('GetCreditsError', () => 'INTERNAL_SERVER_ERROR' as const),
                Match.exhaustive                       // required, fails to compile if a case is missing
            )
        )
    )
```

```typescript
// 4) src/_bff/modules/credits/credits.router.ts: module composition root
import 'server-only'
import { router } from '@/_bff/trpc/server'
import { GET_CREDITS_PROTECTED_CONTROLLER } from '@/_bff/modules/credits/controllers/get-credits.controller'

export const CREDITS_ROUTER = router({
    get: GET_CREDITS_PROTECTED_CONTROLLER,
    // ...
})

// 5) src/_bff/trpc/router.ts: appRouter composes module routers (namespaced)
export const appRouter = router({
    credits: CREDITS_ROUTER,   // → trpcClient.credits.get.useQuery()
    reports: REPORTS_ROUTER,   // → trpcClient.reports.create.useMutation()
    // ...
})
```

### Rules
- **Controllers** are thin: zod input schema + `runEffect(...)` + the error→TRPC-code `Match` map. No `Effect.fn`, no business logic, no Supabase access. One file per route, named `controllers/<name>.controller.ts`, exporting exactly **one** constant: `<NAME>_PROTECTED_CONTROLLER` or `<NAME>_PUBLIC_CONTROLLER`.
- **Services** (`services/<name>.service.ts`) are exported `Effect.fn(...)` functions holding the business logic. They create the Supabase client (choosing publishable vs service-role key) and pass it into repositories.
- **Repositories** (`repositories/<table>.repository.ts`) are exported `Effect.fn(...)` functions that receive `supabase: SupabaseClient` as their first parameter (the service decides which key to use) and wrap queries with the dual error check (catch + `error` field). One file per table/domain, never imported across modules.
- `runEffect` comes from `@/_bff/trpc/utils`; the `Match.value(error).pipe(… Match.exhaustive)` mapping lives in the controller file.
- Use `protectedProcedure` (from `@/_bff/trpc/server`) for authenticated routes: `ctx.user` is guaranteed, pass it into the service. It runs `getSession()` once per request (cached), throws `401` when there is no user and `500` on infrastructure failure. Auth is enforced by the middleware, so **never** map `UnauthenticatedError` / `GetUserError` in the `Match`.
- Use `publicProcedure` for unauthenticated routes (auth flows, public forms).
- Register controllers in the module's `<module>.router.ts` (exporting `<MODULE>_ROUTER`), and register that router under its namespace in `src/_bff/trpc/router.ts`. Always `import 'server-only'` at the top, only on `.router` files.

### Calling from Server Components
Use the caller, no HTTP overhead:

```typescript
import { createCaller } from '@/_bff/trpc/caller'

const caller = await createCaller()
const data = await caller.reports.getById({ id })
```

### Calling from Client Components
Use `trpcClient.<module>.<procedure>.useMutation()` or `trpcClient.<module>.<procedure>.useQuery()`:

```typescript
const mutation = trpcClient.reports.create.useMutation()
const promise: Promise<ReturnType> = mutation.mutateAsync({ param: 'value' })
```

Always assign `mutateAsync` to an explicitly typed `Promise<T>` variable before passing to Effect to avoid TypeScript deep instantiation errors.

## Backend module layout

All backend code lives under `src/_bff/modules/<module>/`, split by responsibility:

- `<module>.router.ts`: module composition root, exports `<MODULE>_ROUTER`
- `controllers/<name>.controller.ts`, `services/<name>.service.ts`, `repositories/<table>.repository.ts`: see the tRPC rules above. Services are also the cross-module entry point (used by Trigger.dev jobs)
- `processors/<name>.processor.ts`: multi-step pipeline steps reused by services and Trigger.dev jobs (exported)
- `jobs/<name>.job.ts`: Trigger.dev tasks owned by this module (each `jobs/` dir must be listed in `trigger.config.ts` `dirs`)
- MCP (`src/_bff/modules/mcp/`): `tools/<name>.tool.ts` are the MCP counterpart of controllers (one exported `<NAME>_TOOL` registrar each: zod input + `runToolEffect` + exhaustive `Match`), composed in `mcp.handler.ts` and mounted at `src/app/api/mcp/route.ts`. The MCP never calls the AI model, it only returns data and prompts (see `spec/analysis-context.md`)
- `helpers/<name>.helper.ts`: pure helpers (fetchers, builders, mappers)
- `constants/index.ts`, `types/index.ts`: module constants and types
- `<feature>/`: a sub-feature that outgrew a single file gets its own folder (e.g. `analysis/prompts/`, `reports/pdf/`). `reports/pdf/` is the reference: `index.ts` is the entry point and only composes, `templates/<name>.template.ts` hold HTML only (they interpolate values, never compute them), `helpers/<name>.helper.ts` hold the pure logic, plus the folder's own `constants.ts`, `types.ts` and `styles.ts`

**Dependency direction**: controller → service → (repository | processor | helper); jobs → services/processors of their own module. Cross-module imports only via `services/` or `processors/`, never another module's controller or repository.

`_bff` never imports from `src/lib`, `src/modules`, `src/components`, `src/hooks` or `src/app`: if it needs something from there, move it to `src/_bff/core/` (see "Code placement" below). Not to be confused with `src/_bff/modules/core/`, the tRPC module for feedback, consent cookies and push notifications.

Shared error classes live in `src/_bff/lib/errors.ts`, their `ErrorCode` values in `src/_bff/lib/error-codes.ts`. The tRPC transport layer lives in `src/_bff/trpc/`: `server.ts` (procedures and the auth middleware), `utils.ts` (`runEffect`), `context.ts`, `router.ts` (`appRouter`) and `caller.ts` (`createCaller`). Its client half is frontend code: `src/lib/trpc.ts` (`trpcClient`) and `src/providers/trpc-provider.tsx`.

## Code placement: formatters, helpers and constants

Ownership follows usage. For any value formatter (numbers, percentages, currency, dates, labels), pure helper or constant:

| Consumers | Where it lives |
| --- | --- |
| Frontend **and** `_bff` | `src/_bff/core/constants/<theme>.constants.ts`, `src/_bff/core/helpers/<theme>.helper.ts`, `src/_bff/core/utils/<theme>.utils.ts`, one file per theme (e.g. `contact-form.constants.ts`, `financial-signals.helper.ts`, `formatters.utils.ts`). Their shared types go in `src/types/` (e.g. `MetricTile.d.ts`) |
| 2+ frontend modules | `src/lib/constants.ts` (constants), `src/lib/formatters.ts` (formatters), `src/lib/utils.server.ts` (server-side frontend utils) |
| A single module | Colocated `utils.ts` (formatters) or `constants.ts` (constants) next to the deepest common consumer (e.g. `src/modules/account/invoices-table/utils.ts`). In `_bff`, a helper used by a single file may be a private (non-exported) function in that file |

```ts
// ✅ Used by report-view AND _bff
import { fmtPct, fmtNum } from '@/_bff/core/utils/formatters.utils'

// ✅ Only used inside invoices-table
import { formatPaymentMethod } from '@/modules/account/invoices-table/utils'
```

Rules:
- Files under `src/_bff/core/` must stay importable from client components, so no `import 'server-only'` there. The exceptions are `constants/credit-packages.constants.ts` and `db/index.ts` (which holds `createDBServerClient` and `createDBAdminClient`), whose consumers are all server-side.
- **Never** duplicate a formatter: before adding one, read `src/_bff/core/utils/formatters.utils.ts`, `src/lib/formatters.ts` and the module's own `utils.ts`. Do not keep an inventory of them here, it rots.
- When something gains a consumer on the other side (frontend ↔ `_bff`) or in a second module, **promote it** to the matching file above, creating the theme file if it does not exist. When it loses that consumer, move it back next to its remaining users.
- Watch intra-file dependencies before demoting: a constant that another export in the same file uses must stay with that consumer (e.g. `CHROMIUM_PACK_PATH` lives in `src/_bff/modules/reports/constants/index.ts`, its only consumer is the reports module).
- Keep formatters pure (input → string), null/undefined-safe (return `'N/A'` or `null`), and documented with a one-line comment when the behaviour is non-obvious.

## Forms (react-hook-form + shadcn)

All forms follow this structure: logic in a dedicated hook, UI in the component.

### Hook (`use-my-form.ts`)
```typescript
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
    field: z.string().min(1, 'Required'),
})

export type FormValues = z.infer<typeof formSchema>

export const useMyForm = () =>
    useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: { field: '' },
    })
```

### Component
```typescript
'use client'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useMyForm, type FormValues } from './use-my-form'

export function MyForm() {
    const form = useMyForm()

    const onSubmit = async (values: FormValues) => { ... }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="field"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Label</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}
```

### Rules
- Form schema and types always in the hook file
- Hook file named `use-<form-name>.ts`, colocated with the component
- Always use `FormField` + `FormControl` + `FormMessage`, never raw inputs outside of this pattern
- Always use shadcn components from `@/components/ui/`: **never Radix directly, always Base UI**
- For dropdowns always use `Select` from `@/components/ui/select`
- For Select with react-hook-form: use `value={field.value}` + `onValueChange={field.onChange}`
- To display a label in Select trigger while storing a key as value, pass children to `SelectValue`:
  ```tsx
  <SelectValue>{options.find(o => o.value === field.value)?.label}</SelectValue>
  ```
- Inputs that should be uppercase: add `className="uppercase"` and `onChange={e => field.onChange(e.target.value.toUpperCase())}`

## Components

### Props: ALWAYS use a named `type Props`

**Never** inline the type directly in the function signature. **Always** declare a named `type Props` above the component:

```tsx
// ❌ Wrong: inline type in signature
export function MyComponent({ name, email }: { name?: string; email?: string }) { ... }

// ✅ Correct: named type above the component
type Props = {
    name?: string
    email?: string
}

export function MyComponent({ name, email }: Props) { ... }
```

### Styling: ALWAYS use `cn()` for class merging

**Never** use template literals or string concatenation for conditional classes. **Always** use the `cn()` utility from `@/lib/utils`:

```tsx
// ❌ Wrong
className={`base-class ${condition ? 'class-a' : 'class-b'}`}

// ✅ Correct
className={cn('base-class', condition ? 'class-a' : 'class-b')}
className={cn('base-class', {
  condition: 'conditional-class'
})}
```

### Styling: ALWAYS use semantic theme tokens for colors

**Never** use hardcoded color utilities like `text-white`, `text-black`, `bg-white`, `bg-black`, `text-gray-*`, etc. **Always** use the project's semantic CSS variable tokens:

```tsx
// ❌ Wrong: hardcoded colors break dark mode and theme consistency
className="text-white bg-black text-gray-500"

// ✅ Correct: semantic tokens that respect the active theme
className="text-primary-foreground bg-primary text-muted-foreground"
```

When placing light text on a dark surface, always use `text-primary-foreground`, never `text-white`.

## Next.js Page & Layout Props

**ALWAYS** use the project's generated typed helpers. **NEVER** define props manually with raw types.

```tsx
// ✅ Correct: page
type Props = PageProps<'/analysis/[ticker]'>

// ✅ Correct: layout
type Props = LayoutProps<'/dashboard'>

// ❌ WRONG: never do this, not even for dynamic routes
type Props = { params: Promise<{ slug: string }> }
type Props = { params: { slug: string }; searchParams: { q: string } }
```

Rules:
- The string must match the exact route path relative to `src/app/` (without the filename)
- Pages use `PageProps<'...'>`, layouts use `LayoutProps<'...'>`
- These types live in `.next/types/routes.d.ts` and are auto-generated at build time: if a new route isn't there yet, run the build once to regenerate
- **No exceptions**: even if the route doesn't exist in the generated types yet, never write the type by hand, add the page first and let the build generate it

## Pages format

Every page under `src/app/` must follow this exact structure: metadata constants, the `Metadata` export, and the component body with `BreadcrumbSchema`.

```tsx
import type { Metadata } from 'next'
import { ClientEnv } from '@/env/client'
import { BreadcrumbSchema } from '@/components/structured-data'

export const dynamic = 'force-static'

const SITE_URL = ClientEnv.NEXT_PUBLIC_WEBSITE_URL
const META_TITLE = 'Page Title'
const META_DESCRIPTION = 'Compelling description, 140 to 160 chars, includes a CTA or key benefit.'
const META_URL = `${SITE_URL}/page-slug`

export const metadata: Metadata = {
    title: META_TITLE,
    description: META_DESCRIPTION,
    alternates: {
        canonical: META_URL,
    },
    openGraph: {
        title: META_TITLE,
        description: META_DESCRIPTION,
        url: META_URL,
    },
    twitter: {
        title: META_TITLE,
        description: META_DESCRIPTION,
    },
}

export default function MyPage() {
    return (
        <>
            <BreadcrumbSchema
                items={[
                    { name: 'Home', url: `${SITE_URL}/` },
                    { name: META_TITLE, url: META_URL },
                ]}
            />

            <main className="main-container">
                {/* content */}
            </main>
        </>
    )
}
```

### Rules
- `META_DESCRIPTION` must never be an empty string, write a real description before shipping
- All four metadata keys (`title`, `description`, `openGraph`, `twitter`) must always be populated from the same constants
- `BreadcrumbSchema` is always the first child of the fragment, before `<main>`
- Default `<main>` width is `main-container`; wider layouts (e.g. pricing) may use `main-container-lg`

## Analysis flow (`spec/analysis-context.md`)

`spec/analysis-context.md` is the single source of truth for everything the model sees when it
generates a report. Read it before touching any file of the analysis flow, and update it **in the
same change** whenever that flow changes.

Counts as the analysis flow: the prompts (`src/_bff/modules/analysis/prompts/`), the context
builders (`src/_bff/modules/yahoo/helpers/build-*.helper.ts` and the news/technical builders), the
data fetched or mapped for them (`src/_bff/modules/yahoo/`, `src/_bff/modules/finnhub/`: processors,
mappers and helpers), the pipeline in
`src/_bff/modules/analysis/processors/get-stock-analysis.processor.ts`, the model call and its
post-processing, the shape saved in `stock_data` (`src/types/ReportDTO.ts`), and the caching or
refresh paths (including the admin Tickers refresh).

Keep in sync, in this order: the master table of context blocks, the block details with their exact
field list, the assembled prompt skeleton, the model and output section, the caching table and the
file map. Keep the `[EXISTING]` / `[NEW]` tags accurate, and state it explicitly when a new field
only reaches reports generated after the change (`stock_data` is not backfilled).

## Smoke (E2E) tests

Before creating or modifying any file under `e2e/` or `playwright.config.ts`, read `spec/e2e.md` to understand the mock architecture, cookie format, tRPC batch response shape, and the two-layer interception pattern (mock server for server-side calls, `page.route()` for browser-side calls).

Selectors: locate EVERY element via `data-testid` + `getByTestId`, adding the attribute to the component if missing (headings, banners, badges and copy included). NEVER use `getByRole`, `getByLabelText`, `getByText` or `getByPlaceholder` to locate elements, and never library-internal attributes (e.g. `[data-input-otp]`) or CSS/tag/id locators. To verify copy, locate with `getByTestId(...)` and assert the text with `.toContainText(...)` / `.toHaveText(...)`. Testids reused across specs live in Page Objects under `e2e/pos/*.po.ts`; specs never hardcode testid strings.

## Trigger.dev (v4)

- **MUST** use `@trigger.dev/sdk`, NEVER `client.defineJob`
- Tasks live in `src/_bff/modules/<module>/jobs/<name>.job.ts`, and every `jobs/` directory must be listed in `trigger.config.ts` `dirs`
- A job calls its own module's `services/` or `processors/`, never a controller or a repository
- Keep tasks stateless and idempotent (mandatory for payment and other critical operations), use queues to bound concurrency against external services, and distinguish retryable failures from fatal ones
