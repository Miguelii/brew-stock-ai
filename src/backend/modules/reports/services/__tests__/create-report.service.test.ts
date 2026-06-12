import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Effect } from 'effect'
import type { User } from '@supabase/supabase-js'
import { createReport } from '@/backend/modules/reports/services/create-report.service'
import { PROMPT_COSTS_MAP, PROMPTS_MAP } from '@/backend/modules/analysis/constants'
import { failureTag } from '@/backend/__tests__/utils'

const { createSbServerClientMock, deductCreditMock, insertReportMock, enqueueMock } = vi.hoisted(
    () => ({
        createSbServerClientMock: vi.fn(),
        deductCreditMock: vi.fn(),
        insertReportMock: vi.fn(),
        enqueueMock: vi.fn(),
    })
)

vi.mock('@/lib/utils.server', () => ({ createSbServerClient: createSbServerClientMock }))
vi.mock('@/backend/modules/credits/services/deduct-credit.service', () => ({
    deductCredit: deductCreditMock,
}))
vi.mock('@/backend/modules/reports/repositories/reports.repository', () => ({
    insertReport: insertReportMock,
}))
vi.mock('@/backend/modules/reports/jobs/process-report.job', () => ({
    enqueueReportProcessing: enqueueMock,
}))

const USER = { id: 'user-1' } as User
const PROMPT_TYPE = Object.keys(PROMPTS_MAP)[0]!
const SUPABASE = { from: vi.fn() }

describe('createReport', () => {
    beforeEach(() => {
        createSbServerClientMock.mockReset().mockResolvedValue(SUPABASE)
        deductCreditMock.mockReset().mockReturnValue(Effect.succeed(4))
        insertReportMock.mockReset().mockReturnValue(Effect.succeed('r-1'))
        enqueueMock.mockReset().mockReturnValue(Effect.void)
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
        })
        expect(enqueueMock).toHaveBeenCalledWith('r-1')
    })

    it('fails with InvalidPromptTypeError before touching credits or the database', async () => {
        const exit = await Effect.runPromiseExit(createReport(USER, 'AAPL', 'not-a-prompt'))

        expect(failureTag(exit)).toBe('InvalidPromptTypeError')
        expect(createSbServerClientMock).not.toHaveBeenCalled()
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
        createSbServerClientMock.mockRejectedValue(new Error('no env'))

        const exit = await Effect.runPromiseExit(createReport(USER, 'AAPL', PROMPT_TYPE))
        expect(failureTag(exit)).toBe('CreateSbClientError')
    })
})
