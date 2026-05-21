@AGENTS.md

# Project Conventions

## Language

**ALL code must be written in English — no exceptions.**

This includes: variable names, function names, type names, constants, file names, code comments, JSDoc, inline strings used as identifiers (cache keys, error tags, enum values), and any other code artifact.

Human-facing UI copy and documentation may be in any language, but **everything inside `.ts` / `.tsx` files must be English.**

## Services (Effect-TS)

All services must use Effect-TS. Follow this exact pattern:

```typescript
import 'server-only'
import { Effect } from 'effect'
import { createSbServerClient } from '@/lib/utils.server'
import { CreateSbClientError, SomeError } from '@/services/utils/constants'

export const myService = Effect.fn('myService')(function* (param: string) {
    const supabase = yield* Effect.tryPromise({
        try: () => createSbServerClient(),
        catch: (cause) => new CreateSbClientError({ cause, error_hash: 'unique_hash' }),
    })

    const { data, error } = yield* Effect.tryPromise({
        try: () => supabase.from('table').select('*'),
        catch: (cause) => new SomeError({ cause, error_hash: 'unique_hash' }),
    })

    if (error) {
        return yield* new SomeError({ cause: error, error_hash: 'unique_hash' })
    }

    return data
})
```

### Rules
- Always `import 'server-only'` at the top
- Use `Effect.fn('serviceName')` for automatic telemetry
- All errors must extend `Data.TaggedError` and live in `src/services/utils/constants.ts`
- Every error must have `cause: unknown` and `error_hash: string` fields
- `error_hash` must be a unique short string identifier (e.g. `'ecrtrptsbclnt'`)
- Use `return yield*` when failing (makes termination explicit)
- Never use try-catch inside `Effect.gen` — Effect failures are not thrown
- Supabase queries always check both the `Effect.tryPromise` catch AND the `error` field returned

### Error types location
All error classes live in `src/services/utils/constants.ts`. Add new ones there before creating a service.

### File structure
```
src/services/
  analysis/        # AI analysis services
  reports/         # Report CRUD services
  supabase/        # Auth services
  utils/
    constants.ts   # All error classes + shared schemas
    prompts.ts     # AI prompts
```

### tRPC — exposing a service
Every service is exposed via `src/server/appRouter.ts` using the `runEffect` helper:

```typescript
myProcedure: publicProcedure
    .input(z.object({ param: z.string().min(1) }))
    .query(({ input }) =>                               // or .mutation()
        runEffect(myService(input.param), 'myService', (error) =>
            Match.value(error).pipe(
                Match.tag('SomeError', () => 'INTERNAL_SERVER_ERROR' as const),
                Match.tag('UnauthenticatedError', () => 'UNAUTHORIZED' as const),
                Match.exhaustive                         // required — fails to compile if a case is missing
            )
        )
    ),
```

### Calling from Server Components
Use the caller — no HTTP overhead:

```typescript
import { createCaller } from '@/server/caller'

const caller = await createCaller()
const data = await caller.myProcedure({ param: 'value' })
```

### Calling from Client Components
Use `trpc.<procedure>.useMutation()` or `trpc.<procedure>.useQuery()`:

```typescript
const mutation = trpc.myProcedure.useMutation()
const promise: Promise<ReturnType> = mutation.mutateAsync({ param: 'value' })
```

Always assign `mutateAsync` to an explicitly typed `Promise<T>` variable before passing to Effect to avoid TypeScript deep instantiation errors.

---

### Imports — ALWAYS use the `@/` alias

**Never** use relative imports (`./`, `../`). **Always** use the `@/` path alias for every import within `src/`:

```tsx
// ❌ Wrong — relative paths
import { getSession } from './get-session'
import { getStockAnalysis } from '../analysis/get-stock-analysis'

// ✅ Correct — alias paths
import { getSession } from '@/services/auth/get-session'
import { getStockAnalysis } from '@/services/analysis/get-stock-analysis'
```

This applies to all files — services, components, modules, helpers, types, etc. No exceptions.

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

            <main className="max-w-5xl mx-auto px-6 py-12 lg:pb-24">
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
- Default `<main>` width is `max-w-5xl`; wider layouts (e.g. pricing) may use `max-w-7xl`

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

Key token mappings:
- `text-primary` — main body text
- `text-primary-foreground` — text on top of `bg-primary` (e.g. dark buttons, dark sections)
- `text-muted-foreground` — secondary/dimmed text
- `text-primary-muted` — muted variant (project custom token)
- `bg-background` — page background
- `bg-card` — card/surface background
- `bg-primary` — primary brand background (dark)
- `bg-muted` — subtle background tint
- `border-border` — default border color
- `text-accent-blue` / `bg-accent-blue` — brand accent

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