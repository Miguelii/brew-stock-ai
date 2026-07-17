@AGENTS.md

# Project Conventions

## Language

**ALL code must be written in English — no exceptions.**

This includes: variable names, function names, type names, constants, file names, code comments, JSDoc, inline strings used as identifiers (cache keys, error tags, enum values), and any other code artifact.

Human-facing UI copy and documentation may be in any language, but **everything inside `.ts` / `.tsx` files must be English.**

## General Rules

- Do not start a dev server unless explicitly asked
- Use always pnpm
- NEVER use em-dashes ("—") in any writing: UI copy, code comments, docs, commit messages. Rephrase with commas, colons, parentheses, or separate sentences instead
- For shadcn components ALWAYS use `base-ui`, NEVER `radix-ui`
- When creating any kind of function or component, if you need to declare a type, those declarations always go at the beginning of the file. NEVER declare a type and leave it in the middle of the file.

## Services (Effect-TS)

All services must use Effect-TS. Follow this pattern (supabase only as example):

```typescript
import { Effect } from 'effect'
import { createSbServerClient } from '@/lib/utils.server'
import { CreateSbClientError, SomeError } from '@/_bff/lib/errors'
import { ErrorCode } from '@/_bff/lib/error-codes'

export const myService = Effect.fn('myService')(function* (param: string) {
    const supabase = yield* Effect.tryPromise({
        try: () => createSbServerClient(),
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

### Rules
- Use `Effect.fn('serviceName')` for automatic telemetry
- All errors must extend `Data.TaggedError` and live in `src/_bff/lib/errors.ts`
- Every error must have `cause: unknown` and `error_hash: ErrorCode` fields
- `error_hash` must be an `ErrorCode` member defined in `src/_bff/lib/error-codes.ts` (e.g. `ErrorCode.REPORT_CREATE_SB_CLIENT`)
- Use `return yield*` when failing (makes termination explicit)
- Never use try-catch inside `Effect.gen` — Effect failures are not thrown
- If Supabase queries, always check both the `Effect.tryPromise` catch AND the `error` field returned

### tRPC — controllers, services, repositories (NestJS-style layering)
Each tRPC route is a **controller**: a thin binding in
`src/_bff/modules/<module>/controllers/<name>.controller.ts` that delegates to an exported
**service** in `services/<name>.service.ts`. Data access lives in **repositories**
(`repositories/<table>.repository.ts`). Controllers contain **no business logic and no Supabase
queries** — only the zod input schema, the `runEffect` call, and the error→TRPC-code `Match` map.

```typescript
// 1) src/_bff/modules/credits/services/get-credits.service.ts — exported business logic
import { Effect } from 'effect'
import { createSbServerClient } from '@/lib/utils.server'
import { CreateSbClientError } from '@/_bff/lib/errors'
import { ErrorCode } from '@/_bff/lib/error-codes'
import { selectCredits } from '@/_bff/modules/credits/repositories/credits.repository'
import type { User } from '@supabase/supabase-js'

export const getCredits = Effect.fn('getCredits')(function* (user: User) {
    const supabase = yield* Effect.tryPromise({
        try: () => createSbServerClient(),
        catch: (cause) =>
            new CreateSbClientError({ cause, error_hash: ErrorCode.TOKENS_GET_SB_CLIENT }),
    })

    return yield* selectCredits(supabase, user.id)
})
```

```typescript
// 2) src/_bff/modules/credits/repositories/credits.repository.ts — exported data access
//    Repositories RECEIVE the Supabase client as a parameter — the service decides which key to use.
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
// 3) src/_bff/modules/credits/controllers/get-credits.controller.ts — thin tRPC binding
import { Match } from 'effect'
import { protectedProcedure } from '@/_trpc/server'
import { runEffect } from '@/_trpc/utils'
import { getCredits } from '@/_bff/modules/credits/services/get-credits.service'

export const GET_CREDITS_PROTECTED_CONTROLLER = protectedProcedure
    .query(({ ctx }) =>                                 // or .input(z.object({...})).mutation(({ input, ctx }) => ...)
        runEffect(getCredits(ctx.user), 'getCredits', (error) =>
            Match.value(error).pipe(
                Match.tag('CreateSbClientError', () => 'INTERNAL_SERVER_ERROR' as const),
                Match.tag('GetCreditsError', () => 'INTERNAL_SERVER_ERROR' as const),
                Match.exhaustive                       // required — fails to compile if a case is missing
            )
        )
    )
```

Each module composes its controllers in a router file at the module root, and `appRouter`
namespaces the module routers:

- Always `import 'server-only'` at the top, only on `.router` files

```typescript
// 4) src/_bff/modules/credits/credits.router.ts — module composition root
import 'server-only'
import { router } from '@/_trpc/server'
import { GET_CREDITS_PROTECTED_CONTROLLER } from '@/_bff/modules/credits/controllers/get-credits.controller'

export const CREDITS_ROUTER = router({
    get: GET_CREDITS_PROTECTED_CONTROLLER,
    // ...
})

// 5) src/_trpc/router/index.ts — appRouter composes module routers (namespaced)
export const appRouter = router({
    credits: CREDITS_ROUTER,   // → trpcClient.credits.get.useQuery()
    reports: REPORTS_ROUTER,   // → trpcClient.reports.create.useMutation()
    // ...
})
```

#### Rules
- Controller files **must** be named `src/_bff/modules/<module>/controllers/<name>.controller.ts` and export exactly **one** constant: `<NAME>_PROTECTED_CONTROLLER` or `<NAME>_PUBLIC_CONTROLLER`.
- Controllers are **thin**: zod input schema + `runEffect(...)` + `Match` error map. No `Effect.fn`, no business logic, no Supabase access.
- Services (`services/<name>.service.ts`) are **exported** `Effect.fn(...)` functions holding the business logic. They create the Supabase client (choosing publishable vs service-role key) and pass it into repositories.
- Repositories (`repositories/<table>.repository.ts`) are **exported** `Effect.fn(...)` functions that receive `supabase: SupabaseClient` as their first parameter and wrap queries with the dual error check (catch + `error` field). One file per table/domain. **No cross-module imports.**
- **Dependency direction**: controller → service → (repository | processor | helper). Cross-module imports go through `services/` or `processors/` only — never another module's controller or repository.
- Use `protectedProcedure` (from `@/_trpc/server`) for authenticated routes — `ctx.user` is guaranteed; pass it into the service. Auth is enforced by the middleware, so **never** map `UnauthenticatedError` / `GetUserError` in the `Match`.
- Use `publicProcedure` for unauthenticated routes (auth flows, public forms).
- `runEffect` comes from `@/_trpc/utils`; the `Match.value(error).pipe(… Match.exhaustive)` mapping lives in the controller file.
- Register controllers in the module's `<module>.router.ts` (exporting `<MODULE>_ROUTER`), and register that router under its namespace in `src/_trpc/router/index.ts`.

`protectedProcedure` runs `getSession()` once per request (cached) and injects `ctx.user`: it throws `401` when there is no user and `500` on infrastructure failure. Services still create their own Supabase client, so each one controls whether it uses the publishable or service-role key.

### Calling from Server Components
Use the caller — no HTTP overhead:

```typescript
import { createCaller } from '@/_trpc/server/caller'

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

### Backend module layout
All backend code lives under `src/_bff/modules/<module>/`, split by responsibility (NestJS-style):
- `<module>.router.ts` — module composition root; exports `<MODULE>_ROUTER` composing the module's controllers. Registered under its namespace in `src/_trpc/router/index.ts`.
- `controllers/<name>.controller.ts` — thin tRPC binding (zod schema + `runEffect` + `Match` error map); exports `<NAME>_<PROTECTED|PUBLIC>_CONTROLLER`. No logic, no Supabase.
- `services/<name>.service.ts` — exported `Effect.fn` business logic; creates the Supabase client and orchestrates repositories/processors/helpers. The cross-module entry point (also used by Trigger.dev jobs).
- `repositories/<table>.repository.ts` — exported `Effect.fn` data access; receives `supabase: SupabaseClient` as a parameter. One file per table/domain. Never imported across modules.
- `processors/<name>.processor.ts` — multi-step pipeline steps reused by services and Trigger.dev jobs (exported).
- `jobs/<name>.job.ts` — Trigger.dev tasks owned by this module (each `jobs/` dir must be listed in `trigger.config.ts` `dirs`).
- `helpers/<name>.helper.ts` — pure helpers (fetchers, builders, mappers).
- `constants/index.ts`, `types/index.ts` — module constants and types.

**Dependency direction**: controller → service → (repository | processor | helper); jobs → services/processors of their own module. Cross-module imports only via `services/` or `processors/` — never another module's controller or repository.

Shared error classes live in `src/_bff/lib/errors.ts`; their `ErrorCode` values in `src/_bff/lib/error-codes.ts`. tRPC infra lives in `src/_trpc/`: `server` (procedures, router, auth middleware), `utils` (`runEffect`), `context`, `api` (`appRouter`), and `server/caller` (`createCaller`).

---

### Imports — ALWAYS use the `@/` alias

**Never** use relative imports (`./`, `../`). **Always** use the `@/` path alias for every import within `src/`:

```tsx
// ❌ Wrong — relative paths
import { getSession } from './get-session'
import { getStockAnalysis } from '../analysis/get-stock-analysis'

// ✅ Correct — alias paths
import { getSession } from '@/_bff/modules/auth/get-session'
import { getStockAnalysis } from '@/_bff/modules/analysis/processors/get-stock-analysis.processor'
```

This applies to all files — services, components, modules, helpers, types, etc. No exceptions.

---

### Formatters & constants — ownership follows usage

Placement rule for value-formatting helpers (numbers, percentages, currency, dates, labels, etc.) and constants:

- **Used by 2+ modules (or shared between frontend and `_bff`)** → define once in `src/lib/formatters.ts` / `src/lib/constants.ts` and import from there.
- **Used by a single module** → colocate it in that module: a `utils.ts` (formatters) or `constants.ts` (constants) next to the deepest common consumer (e.g. `src/modules/account/invoices-table/utils.ts`). In `_bff`, a helper used by a single file may be a private (non-exported) function in that file.

```ts
// ✅ Shared by report-view AND _bff → lives in src/lib/formatters.ts
import { fmtPct, fmtNum } from '@/lib/formatters'

// ✅ Only used inside report-financials-card → colocated utils.ts
import { fmtEstimatePeriod } from '@/modules/report-view/report-financials-card/utils'
```

Rules:
- **Never** duplicate a formatter: before adding one, reuse what exists in `src/lib/formatters.ts` (`fmtNum`, `fmtPct`, `fmtPrice`, `fmtLarge`, `toIso`, `fmtDate`, `formatDate`, …) or in the module's own `utils.ts`.
- When a colocated formatter gains a second consumer module, **promote it** to `src/lib/formatters.ts` (and vice-versa: a lib formatter that drops to one consumer may be demoted to that module).
- Keep formatters pure (input → string), null/undefined-safe (return `'N/A'` or `null`), and documented with a one-line comment when the behaviour is non-obvious.
- Watch intra-file dependencies before demoting a constant: a constant that another export in the same file uses must stay with that consumer (e.g. `CHROMIUM_PACK_PATH` lives in `src/_bff/modules/reports/constants/index.ts` — its only consumer is the reports module).

---

## Forms (react-hook-form + shadcn)

All forms follow this structure — logic in a dedicated hook, UI in the component.

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

## Next.js Page & Layout Props

**ALWAYS** use the project's generated typed helpers. **NEVER** define props manually with raw types.

```tsx
// ✅ Correct — page
type Props = PageProps<'/analysis/[ticker]'>

// ✅ Correct — layout
type Props = LayoutProps<'/dashboard'>

// ❌ WRONG — never do this, not even for dynamic routes
type Props = { params: Promise<{ slug: string }> }
type Props = { params: { slug: string }; searchParams: { q: string } }
```

Rules:
- The string must match the exact route path relative to `src/app/` (without the filename)
- Pages use `PageProps<'...'>`, layouts use `LayoutProps<'...'>`
- These types live in `.next/types/routes.d.ts` and are auto-generated at build time — if a new route isn't there yet, run the build once to regenerate
- **No exceptions**: even if the route doesn't exist in the generated types yet, never write the type by hand — add the page first and let the build generate it

---

## Pages format

Every page under  must follow this exact structure — metadata constants, the `Metadata` export, and the component body with `BreadcrumbSchema`.

```tsx
import type { Metadata } from 'next'
import { ClientEnv } from '@/env/client'
import { BreadcrumbSchema } from '@/components/structured-data'

export const dynamic = 'force-static'

const SITE_URL = ClientEnv.NEXT_PUBLIC_WEBSITE_URL
const META_TITLE = 'Page Title'
const META_DESCRIPTION = 'Compelling description, 140–160 chars, includes a CTA or key benefit.'
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
- `META_DESCRIPTION` must never be an empty string — write a real description before shipping
- All four metadata keys (`title`, `description`, `openGraph`, `twitter`) must always be populated from the same constants
- `BreadcrumbSchema` is always the first child of the fragment, before `<main>`
- Default `<main>` width is `main-container`; wider layouts (e.g. pricing) may use `main-container-lg`

---

### Styling — ALWAYS use `cn()` for class merging with correct format

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
---

### Styling — ALWAYS use semantic theme tokens for colors

**Never** use hardcoded color utilities like `text-white`, `text-black`, `bg-white`, `bg-black`, `text-gray-*`, etc. **Always** use the project's semantic CSS variable tokens:

```tsx
// ❌ Wrong — hardcoded colors break dark mode and theme consistency
className="text-white bg-black text-gray-500"

// ✅ Correct — semantic tokens that respect the active theme
className="text-primary-foreground bg-primary text-muted-foreground"
```

When placing light text on a dark surface, always use `text-primary-foreground` — never `text-white`.

---

### Motion — ALWAYS use `motion/react-client` in pages and Server Components

**Never** import from `motion/react` directly in `page.tsx`, `layout.tsx`, or any Server Component. **Always** use the RSC-safe client entry point:

```tsx
// ❌ Wrong — breaks Server Components / page.tsx
import { motion } from 'motion/react'

// ✅ Correct — RSC-safe import for pages and Server Components
import * as motion from 'motion/react-client'
```

The `motion/react-client` entry is the correct import for Next.js App Router pages and Server Components. Use `motion/react` only inside files already marked with `'use client'` that are **not** page or layout files.

---

### Component props — ALWAYS use a named `type Props`

**Never** inline the type directly in the function signature. **Always** declare a named `type Props` above the component:

```tsx
// ❌ Wrong — inline type in signature
export function MyComponent({ name, email }: { name?: string; email?: string }) { ... }

// ✅ Correct — named type above the component
type Props = {
    name?: string
    email?: string
}

export function MyComponent({ name, email }: Props) { ... }
```

---

### Rules
- Form schema and types always in the hook file
- Hook file named `use-<form-name>.ts`, colocated with the component
- Always use `FormField` + `FormControl` + `FormMessage` — never raw inputs outside of this pattern
- Always use shadcn components from `@/components/ui/` — **never Radix directly, always Base UI**
- For dropdowns always use `Select` from `@/components/ui/select`
- For Select with react-hook-form: use `value={field.value}` + `onValueChange={field.onChange}`
- To display a label in Select trigger while storing a key as value, pass children to `SelectValue`:
  ```tsx
  <SelectValue>{options.find(o => o.value === field.value)?.label}</SelectValue>
  ```
- Inputs that should be uppercase: add `className="uppercase"` and `onChange={e => field.onChange(e.target.value.toUpperCase())}`


## Smoke (E2E) Tests

Before creating or modifying any file under `e2e/` or `playwright.config.ts`, read `spec/e2e.md` to understand the mock architecture, cookie format, tRPC batch response shape, and the two-layer interception pattern (mock server for server-side calls, `page.route()` for browser-side calls).

Selectors: interactive elements (inputs, selects, action buttons) must be located via `data-testid` + `getByTestId` — add the attribute to the component if missing. Never use `getByPlaceholder` or library-internal attributes (e.g. `[data-input-otp]`). `getByRole`/`getByText` are fine for asserting visible content.

---

<!-- TRIGGER.DEV basic START -->
# Trigger.dev Basic Tasks (v4)

**MUST use `@trigger.dev/sdk`, NEVER `client.defineJob`**

## Basic Task

```ts
import { task } from "@trigger.dev/sdk";

export const processData = task({
  id: "process-data",
  retry: {
    maxAttempts: 10,
    factor: 1.8,
    minTimeoutInMs: 500,
    maxTimeoutInMs: 30_000,
    randomize: false,
  },
  run: async (payload: { userId: string; data: any[] }) => {
    // Task logic - runs for long time, no timeouts
    console.log(`Processing ${payload.data.length} items for user ${payload.userId}`);
    return { processed: payload.data.length };
  },
});
```

## Best Practices

- **Concurrency**: Use queues to prevent overwhelming external services
- **Retries**: Configure exponential backoff for transient failures
- **Idempotency**: Always use for payment/critical operations
- **Metadata**: Track progress for long-running tasks
- **Machines**: Match machine size to computational requirements
- **Tags**: Use consistent naming patterns for filtering
- **Debouncing**: Use for user activity, webhooks, and notification batching
- **Batch triggering**: Use for bulk operations up to 1,000 items
- **Error Handling**: Distinguish between retryable and fatal errors

Design tasks to be stateless, idempotent, and resilient to failures. Use metadata for state tracking and queues for resource management.

<!-- TRIGGER.DEV advanced-tasks END -->