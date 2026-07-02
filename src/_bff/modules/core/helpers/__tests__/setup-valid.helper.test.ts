import { describe, it, expect, vi } from 'vitest'
import webpush from 'web-push'
import { setupVapid } from '@/_bff/modules/core/helpers/setup-valid.helper'

// The env modules validate process.env at import time, so they are mocked
// before the helper pulls them in.
vi.mock('web-push', () => ({ default: { setVapidDetails: vi.fn() } }))
vi.mock('@/env/server', () => ({ ServerEnv: { VAPID_PRIVATE_KEY: 'test-private-key' } }))
vi.mock('@/env/client', () => ({ ClientEnv: { NEXT_PUBLIC_VAPID_PUBLIC_KEY: 'test-public-key' } }))

describe('setupVapid', () => {
    it('configures web-push with the mailto subject and the VAPID key pair', () => {
        setupVapid()

        expect(webpush.setVapidDetails).toHaveBeenCalledTimes(1)
        expect(webpush.setVapidDetails).toHaveBeenCalledWith(
            expect.stringMatching(/^mailto:/),
            'test-public-key',
            'test-private-key'
        )
    })
})
