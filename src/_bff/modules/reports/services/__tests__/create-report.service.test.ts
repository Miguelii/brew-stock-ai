import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Effect } from 'effect'
import type { User } from '@supabase/supabase-js'
import { createReport } from '@/_bff/modules/reports/services/create-report.service'
import { PROMPT_COSTS_MAP, PROMPTS_MAP } from '@/_bff/modules/analysis/constants'
import { failureTag } from '@/_bff/lib/tests-utils'

const {
    createDBServerClientMock,
    deductCreditMock,
    refundCreditsMock,
    insertReportMock,
    enqueueMock,
} = vi.hoisted(() => ({
    createDBServerClientMock: vi.fn(),
    deductCreditMock: vi.fn(),
    refundCreditsMock: vi.fn(),
    insertReportMock: vi.fn(),
    enqueueMock: vi.fn(),
}))

vi.mock('@/_bff/core/db', () => ({
    createDBServerClient: createDBServerClientMock,
}))
vi.mock('@/_bff/modules/credits/services/deduct-credit.service', () => ({
    deductCredit: deductCreditMock,
}))
vi.mock('@/_bff/modules/credits/services/refund-credits.service', () => ({
    refundCredits: refundCreditsMock,
}))
vi.mock('@/_bff/lib/server-logger', () => ({ Logger: vi.fn() }))
vi.mock('@/_bff/modules/reports/repositories/reports.repository', () => ({
    insertReport: insertReportMock,
}))
vi.mock('@/_bff/modules/reports/jobs/process-report.job', () => ({
    enqueueReportProcessing: enqueueMock,
}))

const USER = { id: 'user-1' } as User
const PROMPT_TYPE = Object.keys(PROMPTS_MAP)[0]!
const SUPABASE = { from: vi.fn() }

describe('createReport', () => {
    beforeEach(() => {
        createDBServerClientMock.mockReset().mockResolvedValue(SUPABASE)
        deductCreditMock.mockReset().mockReturnValue(Effect.succeed(4))
        insertReportMock.mockReset().mockReturnValue(Effect.succeed('r-1'))
        enqueueMock.mockReset().mockReturnValue(Effect.void)
        refundCreditsMock.mockReset().mockReturnValue(Effect.void)
    })

    it('deducts credits, inserts the report and enqueues background processing', async () => {
        const id = await Effect.runPromise(createReport(USER, 'AAPL', PROMPT_TYPE))

        expect(id).toBe('r-1')
        expect(deductCreditMock).toHaveBeenCalledWith(
            'user-1',
            SUPABASE,
            PROMPT_COSTS_MAP[PROMPT_TYPE] ?? 1
        )
        expect(insertReportMock).toHaveBeenCalledWith(SUPABASE, {
            userId: 'user-1',
            stock: 'AAPL',
            type: PROMPT_TYPE,
            isDev: false,
        })
        expect(enqueueMock).toHaveBeenCalledWith('r-1')
        expect(refundCreditsMock).not.toHaveBeenCalled()
    })

    it('refunds the deducted credits and propagates the error when the insert fails', async () => {
        insertReportMock.mockReturnValue(Effect.fail({ _tag: 'CreateReportError' }))

        const exit = await Effect.runPromiseExit(createReport(USER, 'AAPL', PROMPT_TYPE))

        expect(failureTag(exit)).toBe('CreateReportError')
        expect(refundCreditsMock).toHaveBeenCalledWith(
            'user-1',
            PROMPT_COSTS_MAP[PROMPT_TYPE] ?? 1,
            SUPABASE
        )
        expect(enqueueMock).not.toHaveBeenCalled()
    })

    it('still propagates the insert error when the refund also fails', async () => {
        insertReportMock.mockReturnValue(Effect.fail({ _tag: 'CreateReportError' }))
        refundCreditsMock.mockReturnValue(Effect.fail({ _tag: 'RefundCreditsError' }))

        const exit = await Effect.runPromiseExit(createReport(USER, 'AAPL', PROMPT_TYPE))

        expect(failureTag(exit)).toBe('CreateReportError')
    })

    it('fails with InvalidPromptTypeError before touching credits or the database', async () => {
        const exit = await Effect.runPromiseExit(createReport(USER, 'AAPL', 'not-a-prompt'))

        expect(failureTag(exit)).toBe('InvalidPromptTypeError')
        expect(createDBServerClientMock).not.toHaveBeenCalled()
        expect(deductCreditMock).not.toHaveBeenCalled()
        expect(insertReportMock).not.toHaveBeenCalled()
    })

    it('propagates a credit failure and never inserts the report', async () => {
        deductCreditMock.mockReturnValue(Effect.fail({ _tag: 'InsufficientCreditsError' }))

        const exit = await Effect.runPromiseExit(createReport(USER, 'AAPL', PROMPT_TYPE))

        expect(failureTag(exit)).toBe('InsufficientCreditsError')
        expect(insertReportMock).not.toHaveBeenCalled()
        expect(enqueueMock).not.toHaveBeenCalled()
    })

    it('fails with CreateSbClientError when the Supabase client cannot be created', async () => {
        createDBServerClientMock.mockRejectedValue(new Error('no env'))

        const exit = await Effect.runPromiseExit(createReport(USER, 'AAPL', PROMPT_TYPE))
        expect(failureTag(exit)).toBe('CreateSbClientError')
    })
})
