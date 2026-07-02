import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Effect } from 'effect'
import { sendPushNotificationToUser } from '@/_bff/modules/core/processors/send-push-notification-to-user.processor'
import { failureTag } from '@/_bff/__tests__/utils'

const { createSbAdminClientMock, setupVapidMock, selectSubscriptionsMock, sendToSubsMock } =
    vi.hoisted(() => ({
        createSbAdminClientMock: vi.fn(),
        setupVapidMock: vi.fn(),
        selectSubscriptionsMock: vi.fn(),
        sendToSubsMock: vi.fn(),
    }))

vi.mock('@/lib/utils.server', () => ({ createSbAdminClient: createSbAdminClientMock }))
vi.mock('@/_bff/modules/core/helpers/setup-valid.helper', () => ({
    setupVapid: setupVapidMock,
}))
vi.mock('@/_bff/modules/core/repositories/push-subscriptions.repository', () => ({
    selectPushSubscriptions: selectSubscriptionsMock,
}))
vi.mock('@/_bff/modules/core/processors/send-to-subscriptions.processor', () => ({
    sendToSubscriptions: sendToSubsMock,
}))

const SUPABASE = { from: vi.fn() }
const ROWS = [{ subscription: { endpoint: 'https://push.example' } }]

describe('sendPushNotificationToUser', () => {
    beforeEach(() => {
        createSbAdminClientMock.mockReset().mockReturnValue(SUPABASE)
        setupVapidMock.mockReset()
        selectSubscriptionsMock
            .mockReset()
            .mockReturnValue(Effect.succeed({ data: ROWS, error: null }))
        sendToSubsMock.mockReset().mockReturnValue(Effect.succeed({ success: true as const }))
    })

    it('uses the admin client and dispatches to the user subscriptions', async () => {
        const result = await Effect.runPromise(
            sendPushNotificationToUser('user-1', 'Title', 'Body')
        )

        expect(result).toEqual({ success: true })
        expect(selectSubscriptionsMock).toHaveBeenCalledWith(SUPABASE, 'user-1')
        expect(sendToSubsMock).toHaveBeenCalledWith(ROWS, 'Title', 'Body')
    })

    it('reports no_subscription when the user has no registered devices', async () => {
        selectSubscriptionsMock.mockReturnValue(Effect.succeed({ data: [], error: null }))

        await expect(
            Effect.runPromise(sendPushNotificationToUser('user-1', 'Title', 'Body'))
        ).resolves.toEqual({ success: false, reason: 'no_subscription' })
    })

    it('fails with SendPushNotificationError when the VAPID setup throws', async () => {
        setupVapidMock.mockImplementation(() => {
            throw new Error('missing VAPID keys')
        })

        const exit = await Effect.runPromiseExit(
            sendPushNotificationToUser('user-1', 'Title', 'Body')
        )
        expect(failureTag(exit)).toBe('SendPushNotificationError')
    })
})
