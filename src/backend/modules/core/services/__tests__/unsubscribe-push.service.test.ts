import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Effect } from 'effect'
import type { User } from '@supabase/supabase-js'
import { unsubscribePush } from '@/backend/modules/core/services/unsubscribe-push.service'

const { createSbServerClientMock, deleteMock } = vi.hoisted(() => ({
    createSbServerClientMock: vi.fn(),
    deleteMock: vi.fn(),
}))

vi.mock('@/lib/utils.server', () => ({ createSbServerClient: createSbServerClientMock }))
vi.mock('@/backend/modules/core/repositories/push-subscriptions.repository', () => ({
    deletePushSubscription: deleteMock,
}))

const USER = { id: 'user-1' } as User
const SUPABASE = { from: vi.fn() }

describe('unsubscribePush', () => {
    beforeEach(() => {
        createSbServerClientMock.mockReset().mockResolvedValue(SUPABASE)
        deleteMock.mockReset().mockReturnValue(Effect.void)
    })

    it('removes the subscription for the current user', async () => {
        const result = await Effect.runPromise(unsubscribePush(USER))

        expect(result).toEqual({ success: true })
        expect(deleteMock).toHaveBeenCalledWith(SUPABASE, 'user-1')
    })
})
