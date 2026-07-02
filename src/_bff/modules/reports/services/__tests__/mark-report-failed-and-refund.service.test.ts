import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Effect } from 'effect'
import { markReportFailedAndRefund } from '@/_bff/modules/reports/services/mark-report-failed-and-refund.service'
import { failureTag } from '@/_bff/__tests__/utils'

const { createSbAdminClientMock, markReportFailedMock, refundCreditsMock } = vi.hoisted(() => ({
    createSbAdminClientMock: vi.fn(),
    markReportFailedMock: vi.fn(),
    refundCreditsMock: vi.fn(),
}))

vi.mock('@/lib/utils.server', () => ({ createSbAdminClient: createSbAdminClientMock }))
vi.mock('@/_bff/modules/reports/repositories/reports.repository', () => ({
    markReportFailed: markReportFailedMock,
}))
vi.mock('@/_bff/modules/credits/services/refund-credits.service', () => ({
    refundCredits: refundCreditsMock,
}))
vi.mock('@/_bff/modules/analysis/constants', () => ({
    PROMPT_COSTS_MAP: { deep: 2 },
}))

const CLIENT = { tag: 'admin-client' }

describe('markReportFailedAndRefund', () => {
    beforeEach(() => {
        createSbAdminClientMock.mockReset().mockReturnValue(CLIENT)
        markReportFailedMock.mockReset()
        refundCreditsMock.mockReset().mockReturnValue(Effect.succeed(3))
    })

    it('refunds the prompt cost when the report transitions to FAILED', async () => {
        markReportFailedMock.mockReturnValue(Effect.succeed({ user_id: 'user-1', type: 'deep' }))

        const result = await Effect.runPromise(markReportFailedAndRefund('r-1'))

        expect(markReportFailedMock).toHaveBeenCalledWith(CLIENT, 'r-1')
        expect(refundCreditsMock).toHaveBeenCalledWith('user-1', 2, CLIENT)
        expect(result).toEqual({ userId: 'user-1', type: 'deep', refund: 2 })
    })

    it('refunds 1 credit when the prompt type has no configured cost', async () => {
        markReportFailedMock.mockReturnValue(Effect.succeed({ user_id: 'user-1', type: 'unknown' }))

        await Effect.runPromise(markReportFailedAndRefund('r-1'))

        expect(refundCreditsMock).toHaveBeenCalledWith('user-1', 1, CLIENT)
    })

    it('skips the refund when the report was already FAILED', async () => {
        markReportFailedMock.mockReturnValue(Effect.succeed(null))

        await expect(Effect.runPromise(markReportFailedAndRefund('r-1'))).resolves.toBeNull()
        expect(refundCreditsMock).not.toHaveBeenCalled()
    })

    it('propagates repository failures', async () => {
        markReportFailedMock.mockReturnValue(Effect.fail({ _tag: 'MarkReportFailedError' }))

        const exit = await Effect.runPromiseExit(markReportFailedAndRefund('r-1'))
        expect(failureTag(exit)).toBe('MarkReportFailedError')
    })
})
