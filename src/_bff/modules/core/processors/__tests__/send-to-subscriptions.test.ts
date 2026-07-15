import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Effect } from 'effect'
import { sendToSubscriptions } from '@/_bff/modules/core/processors/send-to-subscriptions.processor'
import { failureTag } from '@/_bff/__tests__/utils'

const { sendNotificationMock } = vi.hoisted(() => ({ sendNotificationMock: vi.fn() }))

vi.mock('web-push', () => ({ default: { sendNotification: sendNotificationMock } }))

const ROWS = [
    { subscription: { endpoint: 'https://push.example/a' } as PushSubscriptionJSON },
    { subscription: { endpoint: 'https://push.example/b' } as PushSubscriptionJSON },
]

describe('sendToSubscriptions', () => {
    beforeEach(() => {
        // oxlint-disable-next-line unicorn/no-useless-undefined
        sendNotificationMock.mockReset().mockResolvedValue(undefined)
    })

    it('sends the payload to every subscription', async () => {
        const result = await Effect.runPromise(sendToSubscriptions(ROWS, 'Title', 'Body'))

        expect(result).toEqual({ success: true })
        expect(sendNotificationMock).toHaveBeenCalledTimes(2)
        expect(sendNotificationMock).toHaveBeenCalledWith(
            ROWS[0]!.subscription,
            JSON.stringify({
                title: 'Title',
                body: 'Body',
                icon: '/web-app-manifest-192x192.png',
            })
        )
    })

    it('fails with SendPushNotificationError when a dispatch rejects', async () => {
        sendNotificationMock.mockRejectedValue(new Error('endpoint gone'))

        const exit = await Effect.runPromiseExit(sendToSubscriptions(ROWS, 'Title', 'Body'))
        expect(failureTag(exit)).toBe('SendPushNotificationError')
    })
})
