import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Effect } from 'effect'
import { AiGenerationError } from '@/_bff/lib/errors'
import { ErrorCode } from '@/_bff/lib/error-codes'
import { processReport } from '@/_bff/modules/reports/processors/process-report.processor'
import { failureTag } from '@/_bff/lib/tests-utils'

const { createDBAdminClientMock, getStockAnalysisMock, sendPushMock } = vi.hoisted(() => ({
    createDBAdminClientMock: vi.fn(),
    getStockAnalysisMock: vi.fn(),
    sendPushMock: vi.fn(),
}))

vi.mock('@/_bff/core/db', () => ({
    createDBAdminClient: createDBAdminClientMock,
}))
vi.mock('@trigger.dev/sdk', () => ({ logger: { log: vi.fn(), error: vi.fn() } }))
vi.mock('@/_bff/modules/analysis/processors/get-stock-analysis.processor', () => ({
    getStockAnalysis: getStockAnalysisMock,
}))
vi.mock('@/_bff/modules/core/processors/send-push-notification-to-user.processor', () => ({
    sendPushNotificationToUser: sendPushMock,
}))

const REPORT = {
    id: 'report-1',
    stock: 'AAPL',
    type: 'fundamental',
    user_id: 'user-1',
    status: 'GENERATING',
}

// Minimal client implementing .from('reports').select().eq().single() and .update().eq().
const makeSupabase = (fetchResult: { data: unknown; error: unknown }) => {
    const updateEq = vi.fn().mockResolvedValue({ data: null, error: null })
    const update = vi.fn(() => ({ eq: updateEq }))
    const client = {
        from: () => ({
            select: () => ({
                eq: () => ({ single: () => Promise.resolve(fetchResult) }),
            }),
            update,
        }),
    }
    return { client, update, updateEq }
}

describe('processReport', () => {
    beforeEach(() => {
        getStockAnalysisMock.mockReset().mockReturnValue(Effect.void)
        sendPushMock.mockReset().mockReturnValue(Effect.void)
        createDBAdminClientMock.mockReset()
    })

    it('runs the analysis and notifies the user on the happy path', async () => {
        const { client } = makeSupabase({ data: REPORT, error: null })
        createDBAdminClientMock.mockReturnValue(client)

        const result = await Effect.runPromise(processReport('report-1'))
        expect(result).toEqual({ reportId: 'report-1' })
        expect(getStockAnalysisMock).toHaveBeenCalledWith(
            'AAPL',
            'fundamental',
            'report-1',
            client,
            undefined
        )
        expect(sendPushMock).toHaveBeenCalledWith(
            'user-1',
            'AAPL analysis ready',
            expect.any(String)
        )
    })

    it('skips the analysis when the report is no longer GENERATING', async () => {
        const { client } = makeSupabase({ data: { ...REPORT, status: 'COMPLETED' }, error: null })
        createDBAdminClientMock.mockReturnValue(client)

        const result = await Effect.runPromise(processReport('report-1'))
        expect(result).toEqual({ reportId: 'report-1' })
        expect(getStockAnalysisMock).not.toHaveBeenCalled()
        expect(sendPushMock).not.toHaveBeenCalled()
    })

    it('fails with FetchReportForTaskError when the report does not exist', async () => {
        const { client } = makeSupabase({ data: null, error: { message: 'not found' } })
        createDBAdminClientMock.mockReturnValue(client)

        const exit = await Effect.runPromiseExit(processReport('missing-report'))
        expect(failureTag(exit)).toBe('FetchReportForTaskError')
        expect(getStockAnalysisMock).not.toHaveBeenCalled()
    })

    it('propagates the analysis error without touching the report status', async () => {
        const { client, update } = makeSupabase({ data: REPORT, error: null })
        createDBAdminClientMock.mockReturnValue(client)
        getStockAnalysisMock.mockReturnValue(
            Effect.fail(
                new AiGenerationError({
                    cause: null,
                    error_hash: ErrorCode.ANALYSIS_AI_GENERATION,
                    symbol: 'AAPL',
                })
            )
        )

        const exit = await Effect.runPromiseExit(processReport('report-1'))
        expect(failureTag(exit)).toBe('AiGenerationError')
        // The FAILED transition (and credit refund) is owned by the job's onFailure.
        expect(update).not.toHaveBeenCalled()
        expect(sendPushMock).not.toHaveBeenCalled()
    })

    it('still succeeds when the push notification fails', async () => {
        const { client } = makeSupabase({ data: REPORT, error: null })
        createDBAdminClientMock.mockReturnValue(client)
        sendPushMock.mockReturnValue(Effect.die(new Error('push service down')))

        await expect(Effect.runPromise(processReport('report-1'))).resolves.toEqual({
            reportId: 'report-1',
        })
    })
})
