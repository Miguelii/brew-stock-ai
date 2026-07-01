import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Effect } from 'effect'
import { processReport } from '@/_backend/modules/reports/processors/process-report.processor'
import { ReportStatus } from '@/types/ReportDTO'
import { failureTag } from '@/_backend/__tests__/utils'

const { createSbAdminClientMock, getStockAnalysisMock, sendPushMock } = vi.hoisted(() => ({
    createSbAdminClientMock: vi.fn(),
    getStockAnalysisMock: vi.fn(),
    sendPushMock: vi.fn(),
}))

vi.mock('@/lib/utils.server', () => ({ createSbAdminClient: createSbAdminClientMock }))
vi.mock('@trigger.dev/sdk', () => ({ logger: { log: vi.fn(), error: vi.fn() } }))
vi.mock('@/_backend/modules/analysis/processors/get-stock-analysis.processor', () => ({
    getStockAnalysis: getStockAnalysisMock,
}))
vi.mock('@/_backend/modules/core/processors/send-push-notification-to-user.processor', () => ({
    sendPushNotificationToUser: sendPushMock,
}))

const REPORT = { id: 'report-1', stock: 'AAPL', type: 'fundamental', user_id: 'user-1' }

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
        createSbAdminClientMock.mockReset()
    })

    it('runs the analysis and notifies the user on the happy path', async () => {
        const { client } = makeSupabase({ data: REPORT, error: null })
        createSbAdminClientMock.mockReturnValue(client)

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

    it('fails with FetchReportForTaskError when the report does not exist', async () => {
        const { client } = makeSupabase({ data: null, error: { message: 'not found' } })
        createSbAdminClientMock.mockReturnValue(client)

        const exit = await Effect.runPromiseExit(processReport('missing-report'))
        expect(failureTag(exit)).toBe('FetchReportForTaskError')
        expect(getStockAnalysisMock).not.toHaveBeenCalled()
    })

    it('marks the report as FAILED and re-fails with the analysis error', async () => {
        const { client, update, updateEq } = makeSupabase({ data: REPORT, error: null })
        createSbAdminClientMock.mockReturnValue(client)
        getStockAnalysisMock.mockReturnValue(Effect.fail({ _tag: 'StockAnalysisError' }))

        const exit = await Effect.runPromiseExit(processReport('report-1'))
        expect(failureTag(exit)).toBe('StockAnalysisError')
        expect(update).toHaveBeenCalledWith({ status: ReportStatus.FAILED })
        expect(updateEq).toHaveBeenCalledWith('id', 'report-1')
        expect(sendPushMock).not.toHaveBeenCalled()
    })

    it('still succeeds when the push notification fails', async () => {
        const { client } = makeSupabase({ data: REPORT, error: null })
        createSbAdminClientMock.mockReturnValue(client)
        sendPushMock.mockReturnValue(Effect.die(new Error('push service down')))

        await expect(Effect.runPromise(processReport('report-1'))).resolves.toEqual({
            reportId: 'report-1',
        })
    })
})
