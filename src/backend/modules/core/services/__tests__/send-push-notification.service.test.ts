import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Effect } from 'effect'
import type { User } from '@supabase/supabase-js'
import { sendPushNotification } from '@/backend/modules/core/services/send-push-notification.service'
import { failureTag } from '@/backend/__tests__/utils'

const { createSbServerClientMock, setupVapidMock, selectSubscriptionsMock, sendToSubsMock } =
    vi.hoisted(() => ({
        createSbServerClientMock: vi.fn(),
        setupVapidMock: vi.fn(),
        selectSubscriptionsMock: vi.fn(),
        sendToSubsMock: vi.fn(),
    }))

vi.mock('@/lib/utils.server', () => ({ createSbServerClient: createSbServerClientMock }))
vi.mock('@/backend/modules/core/helpers/setup-valid.helper', () => ({
    setupVapid: setupVapidMock,
}))
vi.mock('@/backend/modules/core/repositories/push-subscriptions.repository', () => ({
    selectPushSubscriptions: selectSubscriptionsMock,
}))
vi.mock('@/backend/modules/core/processors/send-to-subscriptions.processor', () => ({
    sendToSubscriptions: sendToSubsMock,
}))

const USER = { id: 'user-1' } as User
const SUPABASE = { from: vi.fn() }
const ROWS = [{ subscription: { endpoint: 'https://push.example' } }]

describe('sendPushNotification', () => {
    beforeEach(() => {
        createSbServerClientMock.mockReset().mockResolvedValue(SUPABASE)
        setupVapidMock.mockReset()
        selectSubscriptionsMock
            .mockReset()
            .mockReturnValue(Effect.succeed({ data: ROWS, error: null }))
        sendToSubsMock.mockReset().mockReturnValue(Effect.succeed({ success: true as const }))
    })

    it('dispatches the notification to the user subscriptions', async () => {
        const result = await Effect.runPromise(sendPushNotification(USER, 'Title', 'Body'))

        expect(result).toEqual({ success: true })
        expect(setupVapidMock).toHaveBeenCalled()
        expect(selectSubscriptionsMock).toHaveBeenCalledWith(SUPABASE, 'user-1')
        expect(sendToSubsMock).toHaveBeenCalledWith(ROWS, 'Title', 'Body')
    })

    it('reports no_subscription when the user has no registered devices', async () => {
        selectSubscriptionsMock.mockReturnValue(Effect.succeed({ data: [], error: null }))

        const result = await Effect.runPromise(sendPushNotification(USER, 'Title', 'Body'))

        expect(result).toEqual({ success: false, reason: 'no_subscription' })
        expect(sendToSubsMock).not.toHaveBeenCalled()
    })

    it('fails with GetPushSubscriptionError when the subscription query errors', async () => {
        selectSubscriptionsMock.mockReturnValue(
            Effect.succeed({ data: null, error: { message: 'boom' } })
        )

        const exit = await Effect.runPromiseExit(sendPushNotification(USER, 'Title', 'Body'))
        expect(failureTag(exit)).toBe('GetPushSubscriptionError')
    })
})
