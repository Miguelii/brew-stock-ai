import { Cause, Exit, Option } from 'effect'
import type { SupabaseClient } from '@supabase/supabase-js'

// Fixture shape for large upstream types: every field optional, Dates kept whole
export type DeepPartial<T> = T extends Date
    ? T
    : T extends (infer U)[]
      ? DeepPartial<U>[]
      : T extends object
        ? { [K in keyof T]?: DeepPartial<T[K]> }
        : T

// Extracts the tagged failure of an Exit, or null when the effect succeeded.
export const failureTag = <E>(exit: Exit.Exit<unknown, E>): string | null => {
    if (!Exit.isFailure(exit)) return null
    const failure = Cause.findErrorOption(exit.cause)
    return Option.isSome(failure) ? (failure.value as { _tag: string })._tag : null
}

// Wraps a per-table query chain mock into a minimal SupabaseClient.
export const asClient = <Chain>(from: Chain): SupabaseClient =>
    ({ from: () => from }) as unknown as SupabaseClient
