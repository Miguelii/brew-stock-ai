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
