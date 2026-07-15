import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Effect } from 'effect'
import type { User } from '@supabase/supabase-js'
import { subscribePush } from '@/_bff/modules/core/services/subscribe-push.service'

const { createSbServerClientMock, upsertMock } = vi.hoisted(() => ({
    createSbServerClientMock: vi.fn(),
    upsertMock: vi.fn(),
}))

vi.mock('@/lib/utils.server', () => ({ createSbServerClient: createSbServerClientMock }))
vi.mock('@/_bff/modules/core/repositories/push-subscriptions.repository', () => ({
    upsertPushSubscription: upsertMock,
}))

const USER = { id: 'user-1' } as User
const SUBSCRIPTION = { endpoint: 'https://push.example' } as PushSubscriptionJSON
const SUPABASE = { from: vi.fn() }

describe('subscribePush', () => {
    beforeEach(() => {
        createSbServerClientMock.mockReset().mockResolvedValue(SUPABASE)
        upsertMock.mockReset().mockReturnValue(Effect.void)
    })

    it('stores the subscription using the service-role client', async () => {
        const result = await Effect.runPromise(subscribePush(USER, SUBSCRIPTION))

        expect(result).toEqual({ success: true })
        expect(createSbServerClientMock).toHaveBeenCalledWith(true)
        expect(upsertMock).toHaveBeenCalledWith(SUPABASE, 'user-1', SUBSCRIPTION)
    })
})
