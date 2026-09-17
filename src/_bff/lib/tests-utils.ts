import { Cause, Exit, Option } from 'effect'
import type { SupabaseClient } from '@supabase/supabase-js'

// Extracts the tagged failure of an Exit, or null when the effect succeeded.
export const failureTag = <E>(exit: Exit.Exit<unknown, E>): string | null => {
    if (!Exit.isFailure(exit)) return null
    const failure = Cause.failureOption(exit.cause)
    return Option.isSome(failure) ? (failure.value as { _tag: string })._tag : null
}

// Wraps a per-table query chain mock into a minimal SupabaseClient.
export const asClient = (from: Record<string, unknown>): SupabaseClient =>
    ({ from: () => from }) as unknown as SupabaseClient
