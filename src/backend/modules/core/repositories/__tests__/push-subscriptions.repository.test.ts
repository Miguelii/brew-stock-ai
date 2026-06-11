import { describe, it, expect, vi } from 'vitest'
import { Cause, Effect, Exit, Option } from 'effect'
import type { SupabaseClient } from '@supabase/supabase-js'
import {
    deletePushSubscription,
    selectPushSubscriptions,
    upsertPushSubscription,
} from '@/backend/modules/core/repositories/push-subscriptions.repository'

const asClient = (from: Record<string, unknown>): SupabaseClient =>
    ({ from: () => from }) as unknown as SupabaseClient

const SUBSCRIPTION = { endpoint: 'https://push.example' } as PushSubscriptionJSON

// Extracts the tagged failure of an Exit, or null when the effect succeeded.
const failureTag = <E>(exit: Exit.Exit<unknown, E>): string | null => {
    if (!Exit.isFailure(exit)) return null
    const failure = Cause.failureOption(exit.cause)
    return Option.isSome(failure) ? (failure.value as { _tag: string })._tag : null
}

describe('selectPushSubscriptions', () => {
    it('returns the raw response with the subscription rows', async () => {
        const rows = [{ subscription: SUBSCRIPTION }]
        const eq = vi.fn().mockResolvedValue({ data: rows, error: null })
        const supabase = asClient({ select: () => ({ eq }) })

        const res = await Effect.runPromise(selectPushSubscriptions(supabase, 'user-1'))
        expect(res.data).toEqual(rows)
        expect(eq).toHaveBeenCalledWith('user_id', 'user-1')
    })

    it('fails with GetPushSubscriptionError when the query rejects', async () => {
        const eq = vi.fn().mockRejectedValue(new Error('network down'))
        const supabase = asClient({ select: () => ({ eq }) })

        const exit = await Effect.runPromiseExit(selectPushSubscriptions(supabase, 'user-1'))
        expect(failureTag(exit)).toBe('GetPushSubscriptionError')
    })
})

describe('upsertPushSubscription', () => {
    it('upserts the subscription keyed by user id', async () => {
        const upsert = vi.fn().mockResolvedValue({ error: null })
        const supabase = asClient({ upsert })

        await Effect.runPromise(upsertPushSubscription(supabase, 'user-1', SUBSCRIPTION))
        expect(upsert).toHaveBeenCalledWith(
            { user_id: 'user-1', subscription: SUBSCRIPTION },
            { onConflict: 'user_id' }
        )
    })

    it('fails with SavePushSubscriptionError when the upsert returns an error', async () => {
        const upsert = vi.fn().mockResolvedValue({ error: { message: 'boom' } })
        const supabase = asClient({ upsert })

        const exit = await Effect.runPromiseExit(
            upsertPushSubscription(supabase, 'user-1', SUBSCRIPTION)
        )
        expect(failureTag(exit)).toBe('SavePushSubscriptionError')
    })
})

describe('deletePushSubscription', () => {
    it('deletes the subscription row for the user', async () => {
        const eq = vi.fn().mockResolvedValue({ error: null })
        const del = vi.fn(() => ({ eq }))
        const supabase = asClient({ delete: del })

        await Effect.runPromise(deletePushSubscription(supabase, 'user-1'))
        expect(eq).toHaveBeenCalledWith('user_id', 'user-1')
    })

    it('fails with DeletePushSubscriptionError when the delete returns an error', async () => {
        const eq = vi.fn().mockResolvedValue({ error: { message: 'boom' } })
        const supabase = asClient({ delete: () => ({ eq }) })

        const exit = await Effect.runPromiseExit(deletePushSubscription(supabase, 'user-1'))
        expect(failureTag(exit)).toBe('DeletePushSubscriptionError')
    })
})
