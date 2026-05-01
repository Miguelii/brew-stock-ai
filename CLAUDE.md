@AGENTS.md

# Project Conventions

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

Always type page and layout props using the project's typed helpers — never use raw `{ params, searchParams }`:

```tsx
// Page
type Props = PageProps<'/analysis/[ticker]'>

// Layout
type Props = LayoutProps<'/dashboard'>
```

The string must match the exact file path relative to `src/app/` (without the filename). Update the path for each page accordingly.

---

### Styling — ALWAYS use `cn()` for class merging

**Never** use template literals or string concatenation for conditional classes. **Always** use the `cn()` utility from `@/lib/utils`:

```tsx
// ❌ Wrong
className={`base-class ${condition ? 'class-a' : 'class-b'}`}

// ✅ Correct
className={cn('base-class', condition ? 'class-a' : 'class-b')}
className={cn('base-class', {
  condition: 'conditional-class'
})}
ƒ```

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

## Schema Task (with validation)

```ts
import { schemaTask } from "@trigger.dev/sdk";
import { z } from "zod";

export const validatedTask = schemaTask({
  id: "validated-task",
  schema: z.object({
    name: z.string(),
    age: z.number(),
    email: z.string().email(),
  }),
  run: async (payload) => {
    // Payload is automatically validated and typed
    return { message: `Hello ${payload.name}, age ${payload.age}` };
  },
});
```

## Triggering Tasks

### From Backend Code

```ts
import { tasks } from "@trigger.dev/sdk";
import type { processData } from "./trigger/tasks";

// Single trigger
const handle = await tasks.trigger<typeof processData>("process-data", {
  userId: "123",
  data: [{ id: 1 }, { id: 2 }],
});

// Batch trigger (up to 1,000 items, 3MB per payload)
const batchHandle = await tasks.batchTrigger<typeof processData>("process-data", [
  { payload: { userId: "123", data: [{ id: 1 }] } },
  { payload: { userId: "456", data: [{ id: 2 }] } },
]);
```

## Logging & Tracing

```ts
import { task, logger } from "@trigger.dev/sdk";

export const tracedTask = task({
  id: "traced-task",
  run: async (payload, { ctx }) => {
    logger.info("Task started", { userId: payload.userId });

    // Custom trace with attributes
    const user = await logger.trace(
      "fetch-user",
      async (span) => {
        span.setAttribute("user.id", payload.userId);
        span.setAttribute("operation", "database-fetch");

        const userData = await database.findUser(payload.userId);
        span.setAttribute("user.found", !!userData);

        return userData;
      },
      { userId: payload.userId }
    );

    logger.debug("User fetched", { user: user.id });

    try {
      const result = await processUser(user);
      logger.info("Processing completed", { result });
      return result;
    } catch (error) {
      logger.error("Processing failed", {
        error: error.message,
        userId: payload.userId,
      });
      throw error;
    }
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